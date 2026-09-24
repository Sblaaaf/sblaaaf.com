"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Color, Quaternion, Vector3, type Mesh, type ShaderMaterial } from "three";
import { palette } from "@/config/site";
import { frameState } from "@/lib/frame-state";
import { clamp, damp } from "@/lib/math";
import { fragmentShader, vertexShader } from "./shaders";

const BASE_AMPLITUDE = 0.16;
const MAX_DELTA = 1 / 20; // clamp dt after a tab switch or a long frame
const REDUCED_MOTION_SPEED = 0.15;

// Scratch objects reused every frame: zero allocation in the render loop (no GC spikes).
// Module scope is safe here: they are only used synchronously inside useFrame.
const pointerDirection = new Vector3();
const inverseRotation = new Quaternion();

const createUniforms = () => ({
  uTime: { value: 0 },
  uAmplitude: { value: BASE_AMPLITUDE },
  uFrequency: { value: 1.15 },
  uPointerDir: { value: new Vector3(0, 0, 1) },
  uPointerStrength: { value: 0.22 },
  uContourDensity: { value: 16 },
  uGlow: { value: 1 },
  uColorBase: { value: new Color("#1b1b1b") },
  uColorAccent: { value: new Color(palette.accent) },
});

type Uniforms = ReturnType<typeof createUniforms>;

export const NoiseBlob = () => {
  const meshRef = useRef<Mesh>(null);

  // Vertex cost is what matters here: fewer segments on touch (mobile) devices.
  // The sphere is indexed, so each vertex is shaded once (unlike an icosahedron).
  const [segments] = useState(() =>
    window.matchMedia("(pointer: coarse)").matches ? 96 : 128,
  );

  // Created once. Mutated every frame through the material ref, never re-allocated.
  const [uniforms] = useState(createUniforms);
  const materialRef = useRef<ShaderMaterial>(null);

  // Eased input values, persisted between frames without triggering renders.
  const motion = useRef({ time: 0, spin: 0, pointerX: 0, pointerY: 0, energy: 0, glow: 1 });

  useFrame((state, rawDelta) => {
    const mesh = meshRef.current;
    const material = materialRef.current;
    if (!mesh || !material) return;
    const u = material.uniforms as Uniforms;
    const m = motion.current;

    const dt = Math.min(rawDelta, MAX_DELTA);
    const { pointer, scroll, reducedMotion } = frameState;
    const speed = reducedMotion ? REDUCED_MOTION_SPEED : 1;

    // Time & inputs, eased frame-rate independently.
    m.time += dt * speed;
    m.spin += dt * 0.08 * speed;
    m.pointerX = damp(m.pointerX, pointer.x, 3, dt);
    m.pointerY = damp(m.pointerY, pointer.y, 3, dt);
    // Scroll velocity (px/frame from Lenis) → 0..1 "energy" that agitates the surface.
    const targetEnergy = reducedMotion ? 0 : clamp(Math.abs(scroll.velocity) / 40, 0, 1);
    m.energy = damp(m.energy, targetEnergy, 5, dt);

    // Full glow on the hero, dimmed once the reader scrolls into the content,
    // so body text keeps its contrast over the 3D layer.
    const scrolledScreens = scroll.y / Math.max(state.size.height, 1);
    m.glow = damp(m.glow, clamp(1 - scrolledScreens * 0.8, 0.3, 1), 4, dt);

    u.uTime.value = m.time;
    u.uAmplitude.value = BASE_AMPLITUDE + m.energy * 0.14;
    u.uFrequency.value = 1.15 + m.energy * 0.35;
    u.uGlow.value = m.glow;

    // Slow spin + tilt towards the pointer + a turn driven by reading progress.
    mesh.rotation.set(
      -m.pointerY * 0.35 + scroll.progress * Math.PI * 0.6,
      m.spin + m.pointerX * 0.5,
      0,
    );

    // Pointer direction expressed in the mesh's local space, for the bulge.
    pointerDirection.set(m.pointerX, m.pointerY, 1).normalize();
    inverseRotation.copy(mesh.quaternion).invert();
    u.uPointerDir.value.copy(pointerDirection).applyQuaternion(inverseRotation);

    // Responsive placement, read from the viewport (world units at z = 0):
    // off-center right on landscape, top-centered on portrait.
    const { width, height, aspect } = state.viewport;
    const isLandscape = aspect > 1;
    mesh.scale.setScalar(Math.min(width, height) * (isLandscape ? 0.34 : 0.4));
    mesh.position.set(isLandscape ? width * 0.2 : 0, isLandscape ? 0 : height * 0.14, 0);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, segments, segments]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};
