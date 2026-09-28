"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollStore } from "@/lib/scrollStore";

export default function NeuralCore({ count = 420, reduced = false }: { count?: number; reduced?: boolean }) {
  const group = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const pointsMatRef = useRef<THREE.PointsMaterial>(null);
  const linesMatRef = useRef<THREE.LineBasicMaterial>(null);
  const { basePositions, nodeGeo, lineGeo } = useMemo(() => {
    const ico = new THREE.IcosahedronGeometry(2.1, reduced ? 2 : 5);
    const posAttr = ico.getAttribute("position");
    const base: THREE.Vector3[] = [];
    const nodeArr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * posAttr.count);
      const v = new THREE.Vector3(posAttr.getX(idx), posAttr.getY(idx), posAttr.getZ(idx)).multiplyScalar(.92 + Math.random() * .16);
      base.push(v); nodeArr.set([v.x, v.y, v.z], i * 3);
    }
    const nGeo = new THREE.BufferGeometry(); nGeo.setAttribute("position", new THREE.BufferAttribute(nodeArr, 3));
    const lineVerts: number[] = [];
    for (let i = 0; i < count; i++) {
      let closest = -1; let closestD = Infinity;
      for (let j = 0; j < count; j++) { if (i === j) continue; const d = base[i].distanceToSquared(base[j]); if (d < closestD) { closestD = d; closest = j; } }
      if (closest >= 0 && Math.random() < .48) lineVerts.push(base[i].x, base[i].y, base[i].z, base[closest].x, base[closest].y, base[closest].z);
    }
    const lGeo = new THREE.BufferGeometry(); lGeo.setAttribute("position", new THREE.Float32BufferAttribute(lineVerts, 3));
    return { basePositions: base, nodeGeo: nGeo, lineGeo: lGeo };
  }, [count, reduced]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime(); const p = scrollStore.progress;
    if (!group.current) return;
    group.current.rotation.y = t * .06 + p * 2.4;
    group.current.rotation.x = Math.sin(t * .15) * .08 + p * .6;
    // Activate as user scrolls past the 1st page
    const coreVisibility = THREE.MathUtils.clamp((p - 0.08) * 3.5, 0, 1);
    group.current.scale.setScalar((.55 + coreVisibility * .55) * (1 + Math.sin(t * .8) * .018));
    group.current.position.x = THREE.MathUtils.lerp(0, -1.2, THREE.MathUtils.clamp(p * 3, 0, 1));
    group.current.position.z = THREE.MathUtils.lerp(0, -3.5, THREE.MathUtils.clamp(p * 3, 0, 1));
    if (pointsMatRef.current) pointsMatRef.current.opacity = (.05 + coreVisibility * .75);
    if (linesMatRef.current) linesMatRef.current.opacity = (.02 + coreVisibility * .35);
    if (!reduced && pointsRef.current) {
      const arr = (pointsRef.current.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
      for (let i = 0; i < basePositions.length; i++) { const b = basePositions[i]; arr[i*3] = b.x + Math.sin(t*.6+i)*.015; arr[i*3+1] = b.y + Math.cos(t*.5+i)*.015; arr[i*3+2] = b.z + Math.sin(t*.4+i*1.3)*.015; }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return <group ref={group}>
    <points ref={pointsRef} geometry={nodeGeo}><pointsMaterial ref={pointsMatRef} color="#F4AEA8" size={.025} transparent opacity={.8} depthWrite={false} /></points>
    <lineSegments geometry={lineGeo}><lineBasicMaterial ref={linesMatRef} color="#4C5665" transparent opacity={.4} /></lineSegments>
    <mesh><sphereGeometry args={[1.5, 32, 32]} /><meshBasicMaterial color="#920513" transparent opacity={.1} /></mesh>
  </group>;
}
