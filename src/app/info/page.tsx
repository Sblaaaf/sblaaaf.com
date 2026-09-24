import type { Metadata } from "next";
import { ScrubText } from "@/components/dom/ScrubText";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Info" };

const InfoPage = () => (
  <section className="flex min-h-svh flex-col justify-end px-4 pt-32 pb-24 md:px-8">
    <p className="mb-10 font-mono text-xs text-accent uppercase">(Info)</p>
    <ScrubText
      className="max-w-[24ch] text-[clamp(2rem,5.5vw,5.5rem)] leading-[0.95] font-semibold tracking-tighter"
      text={`${site.name}, alias ${site.alias}. Développeur fullstack et graphiste indépendant à Nantes.`}
    />
    <dl className="mt-16 grid max-w-3xl grid-cols-[8rem_1fr] gap-y-3 font-mono text-xs uppercase">
      <dt className="text-muted">Contact</dt>
      <dd>
        <a href={`mailto:${site.email}`} className="underline-offset-4 hover:text-accent hover:underline">
          {site.email}
        </a>
      </dd>
      <dt className="text-muted">Basé à</dt>
      <dd>{site.location}</dd>
    </dl>
  </section>
);

export default InfoPage;
