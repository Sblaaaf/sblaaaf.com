"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

const subscribe = (onChange: () => void): (() => void) => {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
};

const getSnapshot = (): boolean => window.matchMedia(QUERY).matches;

// On the server we assume motion is allowed; the client value wins after hydration.
const getServerSnapshot = (): boolean => false;

/** Tracks the OS "reduce motion" setting (WCAG 2.3.3) and updates live. */
export const usePrefersReducedMotion = (): boolean =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
