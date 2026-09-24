export const site = {
  alias: "sblaaaf",
  name: "Renaud Lourgouilloux",
  role: "Développeur fullstack & graphiste",
  location: "Nantes, FR",
  email: "hello@sblaaaf.com",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

/** Colors shared by the DOM (CSS tokens) and the WebGL scene. Keep in sync with globals.css. */
export const palette = {
  ink: "#0a0a0a",
  paper: "#f2f0eb",
  accent: "#d7ff3d",
} as const;
