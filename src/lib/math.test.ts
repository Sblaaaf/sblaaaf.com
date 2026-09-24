import { describe, expect, it } from "vitest";
import { clamp, damp, lerp, toNdc } from "./math";

describe("clamp", () => {
  it("keeps values inside the range", () => {
    expect(clamp(5, 0, 1)).toBe(1);
    expect(clamp(-5, 0, 1)).toBe(0);
    expect(clamp(0.5, 0, 1)).toBe(0.5);
  });
});

describe("lerp", () => {
  it("interpolates linearly", () => {
    expect(lerp(0, 10, 0.25)).toBe(2.5);
  });
});

describe("damp", () => {
  it("does not move when no time has passed", () => {
    expect(damp(0, 10, 8, 0)).toBe(0);
  });

  it("is frame-rate independent", () => {
    // One 1/30s step must land where two 1/60s steps land.
    const at30 = damp(0, 1, 6, 1 / 30);
    const at60 = damp(damp(0, 1, 6, 1 / 60), 1, 6, 1 / 60);
    expect(at30).toBeCloseTo(at60, 10);
  });

  it("converges towards the target", () => {
    expect(damp(0, 1, 10, 10)).toBeCloseTo(1, 5);
  });
});

describe("toNdc", () => {
  it("maps the viewport center to the origin", () => {
    expect(toNdc(500, 400, 1000, 800)).toEqual({ x: 0, y: 0 });
  });

  it("flips the y axis and clamps out-of-bounds values", () => {
    expect(toNdc(0, 0, 1000, 800)).toEqual({ x: -1, y: 1 });
    expect(toNdc(2000, 1600, 1000, 800)).toEqual({ x: 1, y: -1 });
  });
});
