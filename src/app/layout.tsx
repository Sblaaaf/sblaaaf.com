import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { CanvasRoot } from "@/components/canvas/CanvasRoot";
import { SiteFooter } from "@/components/dom/SiteFooter";
import { SiteHeader } from "@/components/dom/SiteHeader";
import { SmoothScroll } from "@/components/dom/SmoothScroll";
import { palette, site } from "@/config/site";
import "lenis/dist/lenis.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.alias} — ${site.name}`,
    template: `%s — ${site.alias}`,
  },
  description: `${site.name} (${site.alias}), ${site.role.toLowerCase()} basé à Nantes.`,
  authors: [{ name: site.name }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: site.alias,
  },
};

export const viewport: Viewport = {
  themeColor: palette.ink,
  colorScheme: "dark",
};

type RootLayoutProps = Readonly<{ children: ReactNode }>;

/**
 * The root layout is never unmounted by the App Router: anything rendered here
 * (WebGL canvas, Lenis, header) persists across navigations. Only `children` swaps.
 */
const RootLayout = ({ children }: RootLayoutProps) => (
  <html lang="fr" className={`${GeistSans.variable} ${GeistMono.variable}`}>
    <body className="bg-ink font-sans text-paper antialiased">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:bg-accent focus:px-4 focus:py-2 focus:text-ink"
      >
        Aller au contenu
      </a>

      {/* Layer 0 — fixed WebGL background, outside of the scrolling flow */}
      <CanvasRoot />

      {/* Layer 1 — DOM overlay, smooth-scrolled */}
      <SmoothScroll>
        <SiteHeader />
        <main id="main" className="relative z-10">
          {children}
        </main>
        <SiteFooter />
      </SmoothScroll>
    </body>
  </html>
);

export default RootLayout;
