"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, type ReactNode, type RefObject } from "react";
import { frameState } from "@/lib/frame-state";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

/**
 * The context holds a ref, not the instance: consumers only need Lenis inside
 * event handlers (scrollTo, stop/start), so nothing re-renders when it is created.
 */
const LenisContext = createContext<RefObject<Lenis | null> | null>(null);

export const useLenis = (): RefObject<Lenis | null> => {
  const ref = useContext(LenisContext);
  if (!ref) throw new Error("useLenis must be used inside <SmoothScroll>");
  return ref;
};

const syncFrameState = (y: number, velocity: number, progress: number): void => {
  frameState.scroll.y = y;
  frameState.scroll.velocity = velocity;
  frameState.scroll.progress = progress;
};

type SmoothScrollProps = { children: ReactNode };

export const SmoothScroll = ({ children }: SmoothScrollProps) => {
  const lenisRef = useRef<Lenis | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    frameState.reducedMotion = reducedMotion;

    // Reduced motion: keep native scrolling, only feed the shared state.
    if (reducedMotion) {
      const onScroll = (): void => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        syncFrameState(window.scrollY, 0, max > 0 ? window.scrollY / max : 0);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    const lenis = new Lenis({
      autoRaf: false, // driven by the GSAP ticker below: one rAF for the whole site
      lerp: 0.1,
      anchors: true, // smooth-scroll <a href="#id"> links
      syncTouch: false, // keep native momentum on touch devices (best feel + perf)
    });
    lenisRef.current = lenis;

    const offScroll = lenis.on("scroll", (instance) => {
      syncFrameState(instance.scroll, instance.velocity, instance.progress);
      ScrollTrigger.update();
    });

    // GSAP gives seconds, Lenis expects milliseconds.
    const tick = (time: number): void => lenis.raf(time * 1000);
    // `prioritize = true`: Lenis runs first in the frame, so scroll-linked tweens
    // and the WebGL render (registered later) all read this frame's scroll value.
    gsap.ticker.add(tick, false, true);

    return () => {
      gsap.ticker.remove(tick);
      offScroll();
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  // Route change: the root layout (and this component) persists, the page doesn't.
  useEffect(() => {
    if (previousPathname.current === pathname) return; // skip first load (keeps #hash / restoration)
    previousPathname.current = pathname;

    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);

    // Wait one frame for the new page layout, then recompute trigger positions.
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>;
};
