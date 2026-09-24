import { ScrubText } from "@/components/dom/ScrubText";
import { Wordmark } from "@/components/dom/Wordmark";
import { site } from "@/config/site";

const disciplines = [
  { index: "01", title: "Développement", detail: "Next.js · Node · Rails · Spring" },
  { index: "02", title: "Creative dev", detail: "WebGL · Shaders · Motion" },
  { index: "03", title: "Graphisme", detail: "Identités · Typographie · Print" },
] as const;

const HomePage = () => (
  <>
    {/* Hero: typography is the visual. Bottom-aligned, the 3D blob sits behind. */}
    <section className="flex min-h-svh flex-col justify-end px-4 pb-6 md:px-8 md:pb-8">
      <div className="mb-8 grid grid-cols-2 gap-4 font-mono text-xs text-muted uppercase md:grid-cols-4">
        <p>{site.name}</p>
        <p>{site.role}</p>
        <p className="hidden md:block">{site.location}</p>
        <p className="hidden text-right md:block">
          <span className="text-accent">●</span> Disponible
        </p>
      </div>
      <Wordmark
        text={site.alias.toUpperCase()}
        className="-ml-[0.04em] text-[20vw] leading-[0.78] font-black tracking-[-0.06em]"
      />
    </section>

    <section className="px-4 py-32 md:px-8 md:py-48">
      <p className="mb-10 font-mono text-xs text-accent uppercase">(Manifeste)</p>
      <ScrubText
        className="max-w-[22ch] text-[clamp(2rem,6vw,6rem)] leading-[0.95] font-semibold tracking-tighter"
        text="Du code qui a du goût, du design qui tient la charge. Des interfaces rapides, lisibles et vivantes."
      />
    </section>

    <section className="px-4 pb-32 md:px-8" aria-labelledby="disciplines-title">
      <h2 id="disciplines-title" className="mb-6 font-mono text-xs text-muted uppercase">
        Disciplines
      </h2>
      <ul className="border-t border-line">
        {disciplines.map(({ index, title, detail }) => (
          <li
            key={index}
            className="group grid grid-cols-[3rem_1fr] items-baseline gap-4 border-b border-line py-6 md:grid-cols-[6rem_1fr_auto]"
          >
            <span className="font-mono text-xs text-muted">{index}</span>
            <span className="text-[clamp(1.75rem,5vw,4.5rem)] leading-none font-semibold tracking-tighter transition-colors group-hover:text-accent">
              {title}
            </span>
            <span className="col-start-2 font-mono text-xs text-muted uppercase md:col-start-auto">
              {detail}
            </span>
          </li>
        ))}
      </ul>
    </section>
  </>
);

export default HomePage;
