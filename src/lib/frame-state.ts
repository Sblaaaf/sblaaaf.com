/**
 * Mutable, non-reactive state shared between the DOM layer and the WebGL scene.
 *
 * Why not React state / a store with subscriptions?
 * Pointer and scroll values change on every frame. Pushing them through React
 * would re-render components 60 times per second. Instead, producers (Lenis,
 * pointer listener) write here and consumers (`useFrame`) read here, once per tick.
 *
 * Only ever written on the client; the server never touches it.
 */
export type FrameState = {
  pointer: { x: number; y: number };
  scroll: { y: number; velocity: number; progress: number };
  reducedMotion: boolean;
};

export const frameState: FrameState = {
  pointer: { x: 0, y: 0 },
  scroll: { y: 0, velocity: 0, progress: 0 },
  reducedMotion: false,
};
