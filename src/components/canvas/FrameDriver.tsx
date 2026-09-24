"use client";

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Renders the R3F scene from the GSAP ticker instead of R3F's own rAF loop.
 * Requires `frameloop="never"` on <Canvas>.
 *
 * Result: one requestAnimationFrame for the whole site, in a fixed order:
 * Lenis (prioritized) → GSAP tweens / ScrollTrigger → WebGL render.
 */
export const FrameDriver = () => {
  const advance = useThree((state) => state.advance);

  useEffect(() => {
    // With frameloop="never", R3F computes delta as `timestamp - clock.elapsedTime`,
    // so it expects seconds — exactly what the GSAP ticker provides.
    const tick = (time: number): void => advance(time);
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [advance]);

  return null;
};
