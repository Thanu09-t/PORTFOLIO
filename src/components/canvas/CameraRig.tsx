"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";
import { scrollStore } from "@/lib/scrollStore";

export default function CameraRig() {
  const { camera } = useThree();
  const targetRot = useRef({ x: 0, y: 0 });

  useFrame(() => {
    const p = scrollStore.progress;
    // On the 1st page (hero), amplify the 3D cursor response
    const heroMultiplier = p < 0.2 ? 1.8 : 1.0;

    targetRot.current.x += (scrollStore.mouseY * 0.22 * heroMultiplier - targetRot.current.x) * 0.05;
    targetRot.current.y += (scrollStore.mouseX * 0.28 * heroMultiplier - targetRot.current.y) * 0.05;

    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      targetRot.current.y * 1.5,
      0.08
    );
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      -targetRot.current.x * 1.5,
      0.08
    );
    camera.position.z = 9 - p * 2.2;
    camera.lookAt(
      targetRot.current.y * 0.4,
      -targetRot.current.x * 0.3,
      0
    );
  });

  return null;
}
