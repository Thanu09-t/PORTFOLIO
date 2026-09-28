"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import Hero3DArtScene from "./Hero3DArtScene";
import NeuralCore from "./NeuralCore";
import ParticleField from "./ParticleField";
import SkillsField from "./SkillsField";
import CameraRig from "./CameraRig";
import { useIsMobile, useReducedMotion } from "@/lib/hooks";

export default function Scene() {
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <Canvas
        dpr={[1, isMobile ? 1.25 : 1.8]}
        camera={{ fov: 55, position: [0, 0, 9], near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        fallback={<div className="absolute inset-0 bg-bg" />}
      >
        <ambientLight color="#F1F5F9" intensity={0.7} />
        <directionalLight color="#FFFFFF" intensity={1.5} position={[4, 6, 8]} />
        <pointLight color="#920513" intensity={4.0} position={[5, 4, 6]} distance={35} />
        <pointLight color="#4C5665" intensity={2.5} position={[-6, -3, 5]} distance={35} />
        <Suspense fallback={null}>
          <Hero3DArtScene />
        </Suspense>
        <NeuralCore count={isMobile ? 220 : 420} reduced={reduced} />
        <ParticleField count={isMobile ? 200 : 500} />
        {!isMobile && <SkillsField />}
        <CameraRig />
      </Canvas>
    </div>
  );
}
