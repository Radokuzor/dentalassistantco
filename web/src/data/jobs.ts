// Approved job listings. Employer submissions land in Firestore `leads` (type "employer");
// once approved, add them here (later: build-time fetch from Firestore `jobs`) and emit JobPosting schema.
export type Job = { id: string; title: string; employer: string; city: string; pay: string; posted: string; validThrough: string };

export const jobs: Job[] = [];
