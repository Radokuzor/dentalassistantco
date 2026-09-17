// Generates firebase.json. The redirect map mirrors docs/03-seo-plan.md.
// Legacy blog slugs that haven't been rewritten yet get a temporary 302 to /blog/;
// the redirect disappears automatically once web/content/blog/<slug>.md exists.
// Run: node scripts/build-firebase-json.mjs   (also runs as part of `npm run build` in web/)
import fs from "node:fs";

const cdx = JSON.parse(fs.readFileSync("data/wayback/cdx-index.json", "utf8")).slice(1);
const written = new Set(fs.readdirSync("web/content/blog").map((f) => f.replace(/\.md$/, "")));
const legacySlugs = [...new Set(cdx.map(([url]) => url.match(/\/blog\/([a-z0-9-]+)\/?$/)?.[1]).filter((s) => s && s !== "page"))];

const permanent = [
  ["/programs/edda-test{,/**}", "/programs/expanded-duties-dental-assistant/"],
  ["/job-search{,/**}", "/jobs/"],
  ["/apply-online{,/**}", "/find-a-program/"],
  ["/book-tour{,/**}", "/find-a-program/"],
  ["/lp{,/**}", "/find-a-program/"],
  ["/why-choose-aida{,/**}", "/programs/dental-assistant/"],
  ["/live-patient-clinics{,/**}", "/programs/dental-assistant/"],
  ["/student-testimonials{,/**}", "/programs/dental-assistant/"],
  ["/testimonials{,/**}", "/programs/dental-assistant/"],
  ["/employer-testimonials{,/**}", "/hire/"],
  ["/about-us/dental-assistant-instructors{,/**}", "/about-us/"],
  ["/student-services{,/**}", "/resources/"],
  ["/video-tutorials{,/**}", "/resources/"],
  ["/thank-you{,-apply-online,-book-tour,-contact-us}{,/**}", "/"],
  ["/locations/mesa-arizona-3{,/**}", "/"],
  ["/student-refund-policy{,/**}", "/about-us/"],
  ["/transcriptdiplomacertificate-financial-hold-exemption-policy{,/**}", "/about-us/"],
  ["/feed{,/**}", "/feed.xml"],
  ["/sitemap_index.xml", "/sitemap.xml"],
  ["/*-sitemap.xml", "/sitemap.xml"],
  ["/blog/category/**", "/blog/"],
  ["/blog/author/**", "/blog/"],
].map(([source, destination]) => ({ source, destination, type: 301 }));

const temporary = legacySlugs
  .filter((slug) => !written.has(slug))
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
  firestore: { rules: "firestore.rules", indexes: "firestore.indexes.json" },
  emulators: { functions: { port: 5001 }, firestore: { port: 8080 }, hosting: { port: 5000 }, ui: { enabled: true } },
};

fs.writeFileSync("firebase.json", JSON.stringify(config, null, 2) + "\n");
console.log(`firebase.json: ${permanent.length} permanent + ${temporary.length} temporary redirects`);
