import type { CSSProperties } from "react";

type WordmarkProps = { text: string; className?: string };

/**
 * Server component: the text is split into characters at render time,
 * so the CSS intro plays on first paint with zero JavaScript.
 * Screen readers get the whole word once (sr-only), not letter by letter.
 */
export const Wordmark = ({ text, className = "" }: WordmarkProps) => (
  <h1 className={className}>
    <span className="sr-only">{text}</span>
    <span aria-hidden="true" className="block whitespace-nowrap">
      {Array.from(text).map((char, index) => (
        <span key={`${char}-${index}`} className="char-mask">
          <span className="char" style={{ "--i": index } as CSSProperties}>
            {char}
          </span>
        </span>
      ))}
    </span>
  </h1>
);
