"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Single entry point for GSAP: every component imports from here, so plugins
 * are registered exactly once, before any animation is created.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);

  // GSAP normally "skips" time after a lag spike. Lenis and the WebGL scene
  // read the same ticker, so we want one continuous timeline instead.
  gsap.ticker.lagSmoothing(0);

  // Do not recalculate every trigger when the mobile address bar shows/hides:
  // it is the main source of scroll jank on iOS/Android.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger, useGSAP };
