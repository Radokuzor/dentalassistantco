// Generates firebase.json and vercel.json from one redirect map (mirrors docs/03-seo-plan.md).
// Legacy blog slugs that haven't been rewritten yet get a temporary 302 to /blog/;
// the redirect disappears automatically once web/content/blog/<slug>.md exists.
// Run: node scripts/build-firebase-json.mjs   (also runs as part of `npm run build` in web/)
import fs from "node:fs";

const cdx = JSON.parse(fs.readFileSync("data/wayback/cdx-index.json", "utf8")).slice(1);
// Testimonial URLs point at /stories/ once it has real, permissioned stories (web/src/data/stories.json).
const hasStories = JSON.parse(fs.readFileSync("web/src/data/stories.json", "utf8")).length > 0;
const storiesOr = (fallback) => (hasStories ? "/stories/" : fallback);
const written = new Set(fs.readdirSync("web/content/blog").map((f) => f.replace(/\.md$/, "")));
const legacySlugs = [...new Set(cdx.map(([url]) => url.match(/\/blog\/([a-z0-9-]+)\/?$/)?.[1]).filter((s) => s && s !== "page"))];

// Legacy posts that target the same query as a stronger post are merged into it (docs/06-content-plan.md).
const consolidated = {
  "dental-assistant-demand-colorado": "the-growing-demand-for-dental-assistants-in-colorado",
  "additional-responsibilities-edda": "understanding-the-role-of-expanded-duties-dental-assistants-edda",
  "difference-dental-assistant-expanded-duties-dental-assistant": "understanding-the-role-of-expanded-duties-dental-assistants-edda",
};

const permanent = [
  ...Object.entries(consolidated).map(([from, to]) => [`/blog/${from}{,/}`, `/blog/${to}/`]),
  ["/programs/edda-test{,/**}", "/programs/expanded-duties-dental-assistant/"],
  ["/job-search{,/**}", "/jobs/"],
  ["/apply-online{,/**}", "/find-a-program/"],
  ["/book-tour{,/**}", "/find-a-program/"],
  ["/lp{,/**}", "/find-a-program/"],
  ["/why-choose-aida{,/**}", "/programs/dental-assistant/"],
  ["/live-patient-clinics{,/**}", "/blog/live-patient-clinic-advantages-dental-assisting-education/"],
  ["/student-testimonials{,/**}", storiesOr("/programs/dental-assistant/")],
  ["/testimonials{,/**}", storiesOr("/programs/dental-assistant/")],
  ["/employer-testimonials{,/**}", storiesOr("/hire/")],
  ["/about-us/dental-assistant-instructors{,/**}", "/about-us/"],
  ["/student-services{,/**}", "/former-aida-students/"],
  ["/video-tutorials{,/**}", "/resources/"],
  ...["", "-apply-online", "-book-tour", "-contact-us"].map((s) => [`/thank-you${s}{,/**}`, "/"]),
  ["/locations/mesa-arizona-3{,/**}", "/"],
  ["/student-refund-policy{,/**}", "/former-aida-students/"],
  ["/transcriptdiplomacertificate-financial-hold-exemption-policy{,/**}", "/former-aida-students/"],
  ["/feed{,/**}", "/feed.xml"],
  ["/sitemap_index.xml", "/sitemap.xml"],
  ["/*-sitemap.xml", "/sitemap.xml"],
  ["/blog/category/**", "/blog/"],
  ["/blog/author/**", "/blog/"],
].map(([source, destination]) => ({ source, destination, type: 301 }));

const temporary = legacySlugs
  .filter((slug) => !written.has(slug) && !(slug in consolidated))
  .map((slug) => ({ source: `/blog/${slug}{,/}`, destination: "/blog/", type: 302 }));

const config = {
  hosting: {
    public: "web/out",
    cleanUrls: true,
    trailingSlash: true,
    ignore: ["firebase.json", "**/.*"],
    redirects: [...permanent, ...temporary],
    rewrites: [
      { source: "/api/collect{,/}", function: { functionId: "collect", region: "us-central1" } },
      { source: "/api/lead{,/}", function: { functionId: "lead", region: "us-central1" } },
    ],
    headers: [
      { source: "/_next/static/**", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/images/**", headers: [{ key: "Cache-Control", value: "public, max-age=2592000" }] },
      {
        source: "**",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ],
  },
  functions: [{ source: "functions", codebase: "default", predeploy: ["npm --prefix \"$RESOURCE_DIR\" run build"] }],
  // No `firestore` key on purpose: the (default) database is shared with another app (games, shot_content)
  // that has its own security rules. Never deploy rules from this repo.
  emulators: { functions: { port: 5001 }, hosting: { port: 5000 } },
};

fs.writeFileSync("firebase.json", JSON.stringify(config, null, 2) + "\n");
console.log(`firebase.json: ${permanent.length} permanent + ${temporary.length} temporary redirects`);

// Vercel uses path-to-regexp instead of Firebase globs. Vercel reads vercel.json before the build runs,
// so commit the regenerated file whenever the redirect map changes.
// With trailingSlash on, Vercel doesn't match "/x/:path*" against "/x/" (it 404s), so a Firebase
// "/x{,/**}" becomes two rules: "/x{/}?" for the page itself and "/x/:path+" for anything below it.
const toVercel = (src) => {
  if (src === "**") return ["/:path*"];
  if (src === "/*-sitemap.xml") return ["/:file(.+-sitemap\\.xml)"];
  if (src.endsWith("{,/**}")) {
    const base = src.slice(0, -"{,/**}".length);
    return [`${base}{/}?`, `${base}/:path+`];
  }
  if (src.endsWith("/**")) return [`${src.slice(0, -3)}/:path+`];
  return [src.replace(/\{,\/\}$/, "{/}?")];
};
const functionUrl = (id) => `https://us-central1-take-shots-f1a99.cloudfunctions.net/${id}`;

const vercel = {
  $schema: "https://openapi.vercel.sh/vercel.json",
  framework: null,
  installCommand: "npm ci --prefix web",
  buildCommand: "npm --prefix web run build",
  outputDirectory: "web/out",
  trailingSlash: true,
  redirects: config.hosting.redirects.flatMap(({ source, destination, type }) =>
    toVercel(source).map((s) => ({ source: s, destination, permanent: type === 301 })),
  ),
  rewrites: config.hosting.rewrites.flatMap(({ source, function: fn }) =>
    toVercel(source).map((s) => ({ source: s, destination: functionUrl(fn.functionId) })),
  ),
  headers: config.hosting.headers.flatMap(({ source, headers }) => toVercel(source).map((s) => ({ source: s, headers }))),
};

fs.writeFileSync("vercel.json", JSON.stringify(vercel, null, 2) + "\n");
console.log(`vercel.json: ${vercel.redirects.length} redirects, ${vercel.rewrites.length} rewrites`);
