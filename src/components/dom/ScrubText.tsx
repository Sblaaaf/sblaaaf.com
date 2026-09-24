"use client";

import { Fragment, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type ScrubTextProps = { text: string; className?: string };

/**
 * Words light up as the paragraph crosses the viewport.
 * `scrub: true` (no extra lag): Lenis already smooths the scroll value,
 * adding a scrub delay on top would feel "rubbery".
 */
export const ScrubText = ({ text, className = "" }: ScrubTextProps) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-word]",
          { opacity: 0.18 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: { trigger: ref.current, start: "top 85%", end: "bottom 50%", scrub: true },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <p ref={ref} className={className}>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span data-word>{word}</span>{" "}
        </Fragment>
      ))}
    </p>
  );
};
