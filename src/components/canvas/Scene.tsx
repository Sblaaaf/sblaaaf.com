"use client";

import { PerformanceMonitor } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import { palette } from "@/config/site";
import { FrameDriver } from "./FrameDriver";
import { NoiseBlob } from "./objects/NoiseBlob/NoiseBlob";

// Pixel ratio bounds. Above 1.5 the cost grows quadratically for a barely visible gain.
const DPR_MIN = 1;
const DPR_MAX = 1.5;

export const Scene = () => {
  const [dpr, setDpr] = useState(DPR_MAX);
  const [isReady, setIsReady] = useState(false);

  return (
    <Canvas
      frameloop="never"
      flat // no tone mapping: shader colors match the CSS palette exactly
      dpr={dpr}
      camera={{ position: [0, 0, 6], fov: 35, near: 0.1, far: 20 }}
      gl={{
        alpha: false, // opaque canvas = cheaper compositing on mobile
        antialias: true, // MSAA is resolved on-chip on mobile (tile-based) GPUs: cheap
        stencil: false,
        powerPreference: "high-performance",
      }}
      onCreated={() => setIsReady(true)}
      className={`transition-opacity duration-1000 ${isReady ? "opacity-100" : "opacity-0"}`}
    >
      <color attach="background" args={[palette.ink]} />
      <FrameDriver />
      {/* Drops the resolution when the device can't hold its refresh rate. */}
      <PerformanceMonitor
        flipflops={3}
        onIncline={() => setDpr(DPR_MAX)}
        onDecline={() => setDpr(DPR_MIN)}
        onFallback={() => setDpr(DPR_MIN)}
      />
      <NoiseBlob />
    </Canvas>
  );
};
