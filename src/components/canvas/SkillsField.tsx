"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { scrollStore } from "@/lib/scrollStore";
import { SKILLS } from "@/lib/data";

export default function SkillsField() {
  const group = useRef<THREE.Group>(null);
  const [hot, setHot] = useState<number | null>(null);

  const nodes = useMemo(() => {
    return SKILLS.map((name, i) => {
      const phi = Math.acos(-1 + (2 * i) / SKILLS.length);
      const theta = Math.sqrt(SKILLS.length * Math.PI) * phi;
      const r = 3.1;
      const base = new THREE.Vector3(
        r * Math.cos(theta) * Math.sin(phi),
        r * Math.sin(theta) * Math.sin(phi),
        r * Math.cos(phi)
      );
      return { name, base, phase: Math.random() * Math.PI * 2 };
    });
  }, []);

  const [isActive, setIsActive] = useState(false);

  useFrame((state) => {
    if (!group.current) return;
    const active = scrollStore.activeSection === "skills";
    if (active !== isActive) setIsActive(active);
    const t = state.clock.getElapsedTime();
    const targetScale = active ? 1 : 0.001;
    group.current.scale.setScalar(
      THREE.MathUtils.lerp(group.current.scale.x, targetScale, 0.08)
    );
    if (active) {
      group.current.rotation.y = t * 0.05 + scrollStore.mouseX * 0.3;
      group.current.rotation.x = scrollStore.mouseY * 0.15;
    }
  });

  return (
    <group ref={group} position={[2.2, 0, -2]} scale={0.001}>
      {nodes.map((n, i) => (
        <SkillNode
          key={n.name}
          index={i}
          name={n.name}
          base={n.base}
          phase={n.phase}
          isHot={hot === i}
          active={isActive}
          onHover={(v) => setHot(v ? i : null)}
        />
      ))}
    </group>
  );
}

function SkillNode({
  name,
  base,
  phase,
  isHot,
  active,
  onHover,
}: {
  index: number;
  name: string;
  base: THREE.Vector3;
  phase: number;
  isHot: boolean;
  active: boolean;
  onHover: (v: boolean) => void;
}) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.getElapsedTime();
    const f = Math.sin(t * 0.8 + phase) * 0.06;
    mesh.current.position.copy(base).multiplyScalar(1 + f * 0.1);
    mesh.current.position.y += Math.sin(t * 0.6 + phase) * 0.08;
  });

  return (
    <mesh
      ref={mesh}
      position={base}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(true);
      }}
      onPointerOut={() => onHover(false)}
    >
      <sphereGeometry args={[0.04, 12, 12]} />
      <meshBasicMaterial color={isHot ? "#920513" : "#F4AEA8"} />
      {active && (
        <Html center distanceFactor={8} style={{ pointerEvents: "none" }}>
          <span
            className="font-mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.05em",
              whiteSpace: "nowrap",
              color: isHot ? "#E1E3E4" : "#BBC6CF",
              padding: "4px 9px",
              borderRadius: 4,
              border: `1px solid ${isHot ? "#920513" : "#4C5665"}`,
              background: "#0F1013",
              transition: "all .2s ease",
            }}
          >
            {name}
          </span>
        </Html>
      )}
    </mesh>
  );
}
