"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/config/site";

const links = [
  { href: "/", label: "Index" },
  { href: "/info", label: "Info" },
] as const;

export const SiteHeader = () => {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex items-start justify-between px-4 py-4 font-mono text-xs tracking-wide uppercase md:px-8 md:py-6">
      <Link href="/" className="transition-colors hover:text-accent">
        {site.alias}
        <span className="text-accent">©</span>
      </Link>

      <nav aria-label="Navigation principale">
        <ul className="flex gap-6">
          {links.map(({ href, label }) => {
            const isCurrent = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isCurrent ? "page" : undefined}
                  className={`transition-colors hover:text-accent ${isCurrent ? "text-accent" : ""}`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
          <li>
            <a href={`mailto:${site.email}`} className="transition-colors hover:text-accent">
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};
