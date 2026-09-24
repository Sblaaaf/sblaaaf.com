export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export const lerp = (from: number, to: number, t: number): number => from + (to - from) * t;

/**
 * Frame-rate independent easing towards a target.
 * Unlike `lerp(a, b, 0.1)`, the result is the same at 30, 60 or 120 fps.
 * @param lambda smoothing speed (higher = snappier)
 * @param dt elapsed time in seconds
 */
export const damp = (current: number, target: number, lambda: number, dt: number): number =>
  lerp(current, target, 1 - Math.exp(-lambda * dt));

/** Converts a client pixel coordinate to normalized device coordinates (-1 → 1, y up). */
export const toNdc = (
  clientX: number,
  clientY: number,
  width: number,
  height: number,
): { x: number; y: number } => ({
  x: clamp((clientX / width) * 2 - 1, -1, 1),
  y: clamp(1 - (clientY / height) * 2, -1, 1),
});
