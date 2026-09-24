import { site } from "@/config/site";

export const SiteFooter = () => (
  <footer className="relative z-10 border-t border-line px-4 pt-16 pb-6 md:px-8">
    <p className="font-mono text-xs text-muted uppercase">Un projet, une idée&nbsp;?</p>
    <a
      href={`mailto:${site.email}`}
      className="mt-4 block text-[clamp(2rem,9vw,9rem)] leading-[0.9] font-semibold tracking-tighter break-all transition-colors hover:text-accent"
    >
      {site.email}
    </a>
    <div className="mt-16 flex justify-between font-mono text-xs text-muted uppercase">
      <span>
        © {new Date().getFullYear()} {site.name}
      </span>
      <span>{site.location}</span>
    </div>
  </footer>
);
