/**
 * Public URL, used for metadata (Open Graph, canonical).
 * Priority: explicit env var → Vercel production domain (set automatically) → local dev.
 */
const resolveSiteUrl = (): string => {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
};

export const site = {
  alias: "sblaaaf",
  name: "Renaud Lourgouilloux",
  role: "Développeur fullstack & graphiste",
  location: "Nantes, FR",
  email: "hello@sblaaaf.com",
  url: resolveSiteUrl(),
} as const;

/** Colors shared by the DOM (CSS tokens) and the WebGL scene. Keep in sync with globals.css. */
export const palette = {
  ink: "#0a0a0a",
  paper: "#f2f0eb",
  accent: "#d7ff3d",
} as const;
