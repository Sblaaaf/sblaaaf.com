"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { frameState } from "@/lib/frame-state";
import { toNdc } from "@/lib/math";
import { CanvasErrorBoundary } from "./CanvasErrorBoundary";

// three.js + R3F (~200 kB gz) live in their own chunk, never rendered on the server.
const Scene = dynamic(() => import("./Scene").then((mod) => mod.Scene), { ssr: false });

/**
 * Mounted once in the root layout, so it survives every route change:
 * the WebGL context, compiled shaders and animation state are never rebuilt.
 */
export const CanvasRoot = () => {
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    // Pointer is tracked on window: the canvas itself ignores pointer events
    // so the DOM overlay stays fully interactive.
    const onPointerMove = (event: PointerEvent): void => {
      const { x, y } = toNdc(event.clientX, event.clientY, window.innerWidth, window.innerHeight);
      frameState.pointer.x = x;
      frameState.pointer.y = y;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // Defer the 3D chunk until the main thread is idle: text paints and the page
    // becomes interactive first (better LCP / INP on mobile).
    const mount = (): void => setShouldMount(true);
    const hasIdleCallback = typeof window.requestIdleCallback === "function";
    const handle = hasIdleCallback
      ? window.requestIdleCallback(mount, { timeout: 1500 })
      : window.setTimeout(mount, 300);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      if (hasIdleCallback) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, []);

  return (
    // `h-lvh` (large viewport height): the canvas does not resize when the mobile
    // address bar collapses, which would otherwise reallocate the drawing buffer.
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-0 h-lvh">
      {shouldMount && (
        <CanvasErrorBoundary>
          <Scene />
        </CanvasErrorBoundary>
      )}
    </div>
  );
};
