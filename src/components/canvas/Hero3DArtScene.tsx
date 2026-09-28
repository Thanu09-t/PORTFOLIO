"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { scrollStore } from "@/lib/scrollStore";
import { useTexture } from "@react-three/drei";

// Generates a smooth ribbon mesh along a 3D spline curve
function createRibbonGeometry(
  curve: THREE.CatmullRomCurve3,
  segments = 120,
  width = 0.7
) {
  const points = curve.getPoints(segments);
  const frenetFrames = curve.computeFrenetFrames(segments, false);
  const vertices: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= segments; i++) {
    const pt = points[i];
    const binormal = frenetFrames.binormals[i];
    // Taper ends slightly
    const taper = Math.sin((i / segments) * Math.PI);
    const w = width * (0.4 + 0.6 * taper);

    const v1 = pt.clone().add(binormal.clone().multiplyScalar(w * 0.5));
    const v2 = pt.clone().add(binormal.clone().multiplyScalar(-w * 0.5));

    vertices.push(v1.x, v1.y, v1.z);
    vertices.push(v2.x, v2.y, v2.z);

    const u = i / segments;
    uvs.push(u, 0);
    uvs.push(u, 1);

    if (i < segments) {
      const a = i * 2;
      const b = i * 2 + 1;
      const c = (i + 1) * 2;
      const d = (i + 1) * 2 + 1;
      indices.push(a, b, c);
      indices.push(b, d, c);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();

  return { geo, basePoints: points, frenetFrames };
}

// 3D HUD Gyroscope Rings (matching the circular arcs in the image)
function GyroHudRings({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const ring3Ref = useRef<THREE.Group>(null);

  const ringGeo1 = useMemo(() => new THREE.RingGeometry(1.6 * scale, 1.63 * scale, 64), [scale]);
  const ringGeo2 = useMemo(() => new THREE.RingGeometry(1.2 * scale, 1.22 * scale, 48), [scale]);
  const ringGeo3 = useMemo(() => new THREE.RingGeometry(0.8 * scale, 0.82 * scale, 36), [scale]);

  // Dashed arc points
  const arcPoints = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const count = 48;
    for (let i = 0; i <= count; i++) {
      const angle = (i / count) * Math.PI * 1.5;
      pts.push(
        new THREE.Vector3(
          Math.cos(angle) * 1.9 * scale,
          Math.sin(angle) * 1.9 * scale,
          0
        )
      );
    }
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    return g;
  }, [scale]);

  const arcLine = useMemo(() => {
    const mat = new THREE.LineBasicMaterial({
      color: "#CBD5E1",
      transparent: true,
      opacity: 0.5,
    });
    return new THREE.Line(arcPoints, mat);
  }, [arcPoints]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const mx = scrollStore.mouseX;
    const my = scrollStore.mouseY;

    if (groupRef.current) {
      // Gyro tilt responsive to cursor
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        my * 0.35 + Math.sin(t * 0.6) * 0.08,
        0.05
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mx * 0.45 + Math.cos(t * 0.5) * 0.08,
        0.05
      );
    }
    if (ring1Ref.current) ring1Ref.current.rotation.z = t * 0.15;
    if (ring2Ref.current) ring2Ref.current.rotation.z = -t * 0.22;
    if (ring3Ref.current) ring3Ref.current.rotation.z = t * 0.3;
  });

  return (
    <group ref={groupRef} position={position}>
      <group ref={ring1Ref}>
        <mesh geometry={ringGeo1}>
          <meshBasicMaterial color="#718096" transparent opacity={0.45} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <group ref={ring2Ref}>
        <mesh geometry={ringGeo2}>
          <meshBasicMaterial color="#920513" transparent opacity={0.55} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <group ref={ring3Ref}>
        <mesh geometry={ringGeo3}>
          <meshBasicMaterial color="#A0AEC0" transparent opacity={0.35} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <primitive object={arcLine} />
    </group>
  );
}

// 3D Parametric Dynamic Ribbons (Crimson, Silver, White)
function DynamicRibbons() {
  const crimsonMesh = useRef<THREE.Mesh>(null);
  const silverMesh = useRef<THREE.Mesh>(null);
  const whiteMesh = useRef<THREE.Mesh>(null);
  const streamersRef = useRef<THREE.LineSegments>(null);

  // Define sweeping curves inspired by the artwork
  const { crimsonData, silverData, whiteData } = useMemo(() => {
    // 1. Bold primary crimson ribbon swooshing from bottom-left up through center to top-right
    const crimsonCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-13.0, -4.5, -1.0),
      new THREE.Vector3(-7.5, -2.8, 0.4),
      new THREE.Vector3(-2.2, -1.5, 1.4),
      new THREE.Vector3(0.8, -0.8, 1.8),
      new THREE.Vector3(4.8, 0.2, 1.1),
      new THREE.Vector3(8.5, 2.0, 0.2),
      new THREE.Vector3(13.0, 4.2, -1.2),
    ]);

    // 2. Metallic silver/chrome ribbon flowing closely parallel
    const silverCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-12.5, -4.0, -0.6),
      new THREE.Vector3(-6.8, -2.4, 0.8),
      new THREE.Vector3(-1.6, -1.2, 1.6),
      new THREE.Vector3(1.6, -0.4, 1.5),
      new THREE.Vector3(5.5, 0.6, 0.8),
      new THREE.Vector3(9.0, 2.5, -0.2),
      new THREE.Vector3(13.2, 4.8, -1.5),
    ]);

    // 3. Crisp pearl white accent ribbon
    const whiteCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-12.0, -3.5, -0.3),
      new THREE.Vector3(-6.2, -1.9, 1.0),
      new THREE.Vector3(-1.0, -0.8, 1.7),
      new THREE.Vector3(2.2, 0.0, 1.2),
      new THREE.Vector3(6.2, 1.2, 0.5),
      new THREE.Vector3(9.5, 3.1, -0.5),
      new THREE.Vector3(13.5, 5.2, -1.8),
    ]);

    const cData = createRibbonGeometry(crimsonCurve, 150, 0.9);
    const sData = createRibbonGeometry(silverCurve, 150, 0.7);
    const wData = createRibbonGeometry(whiteCurve, 150, 0.5);

    return { crimsonData: cData, silverData: sData, whiteData: wData };
  }, []);

  // Fine wireframe streamer lines following the ribbon contour
  const streamerGeo = useMemo(() => {
    const pts: number[] = [];
    const count = 120;
    for (let line = 0; line < 6; line++) {
      const offset = (line - 2.5) * 0.12;
      for (let i = 0; i < count; i++) {
        const u1 = i / count;
        const u2 = (i + 1) / count;
        const p1 = crimsonData.basePoints[Math.floor(u1 * (crimsonData.basePoints.length - 1))];
        const p2 = crimsonData.basePoints[Math.floor(u2 * (crimsonData.basePoints.length - 1))];
        pts.push(p1.x, p1.y + offset, p1.z + offset * 0.5);
        pts.push(p2.x, p2.y + offset, p2.z + offset * 0.5);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, [crimsonData]);

  // Dynamic frame update: undulate ribbons & react to cursor in real 3D
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const mx = scrollStore.mouseX;
    const my = scrollStore.mouseY;
    const p = scrollStore.progress;

    // Target cursor position in world space
    const mouseWorld = new THREE.Vector3(mx * 5.5, -my * 3.5, 1.2);

    // Slow fade — ribbons stay visible throughout the site
    const heroFalloff = THREE.MathUtils.clamp(1 - p * 1.6, 0.25, 1);

    const updateRibbon = (
      mesh: THREE.Mesh | null,
      data: ReturnType<typeof createRibbonGeometry>,
      speed: number,
      waveFreq: number,
      amp: number
    ) => {
      if (!mesh) return;
      const pos = mesh.geometry.attributes.position as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;
      const segCount = data.basePoints.length - 1;

      for (let i = 0; i <= segCount; i++) {
        const basePt = data.basePoints[i];
        const binormal = data.frenetFrames.binormals[i];
        const u = i / segCount;
        const taper = Math.sin(u * Math.PI);
        const w = (data.geo.attributes.uv.getX(i * 2 + 1) ? 0.7 : 0.5) * (0.4 + 0.6 * taper);

        // Harmonic sine wave motion
        const waveY = Math.sin(t * speed + u * waveFreq) * amp;
        const waveZ = Math.cos(t * (speed * 0.8) + u * (waveFreq * 1.2)) * (amp * 1.2);

        // Cursor interactive ripple / deflection
        const segCenter = new THREE.Vector3(basePt.x, basePt.y + waveY, basePt.z + waveZ);
        const distToMouse = segCenter.distanceTo(mouseWorld);
        const mouseInfluence = Math.exp(-distToMouse * 0.55) * 0.75;
        const cursorShiftY = (mouseWorld.y - segCenter.y) * mouseInfluence * 0.45;
        const cursorShiftX = (mouseWorld.x - segCenter.x) * mouseInfluence * 0.25;
        const cursorShiftZ = Math.sin(t * 4 + distToMouse * 3) * mouseInfluence * 0.4;

        const dynamicCenter = new THREE.Vector3(
          basePt.x + cursorShiftX,
          basePt.y + waveY + cursorShiftY,
          basePt.z + waveZ + cursorShiftZ
        );

        const v1 = dynamicCenter.clone().add(binormal.clone().multiplyScalar(w * 0.5));
        const v2 = dynamicCenter.clone().add(binormal.clone().multiplyScalar(-w * 0.5));

        arr[i * 6] = v1.x;
        arr[i * 6 + 1] = v1.y;
        arr[i * 6 + 2] = v1.z;

        arr[i * 6 + 3] = v2.x;
        arr[i * 6 + 4] = v2.y;
        arr[i * 6 + 5] = v2.z;
      }
      pos.needsUpdate = true;
      mesh.geometry.computeVertexNormals();

      if (mesh.material instanceof THREE.Material) {
        mesh.material.opacity = (mesh.material.userData.baseOpacity || 1) * heroFalloff;
      }
    };

    updateRibbon(crimsonMesh.current, crimsonData, 1.3, 4.2, 0.22);
    updateRibbon(silverMesh.current, silverData, 1.1, 4.8, 0.18);
    updateRibbon(whiteMesh.current, whiteData, 1.5, 5.2, 0.14);

    if (streamersRef.current) {
      (streamersRef.current.material as THREE.LineBasicMaterial).opacity = 0.35 * heroFalloff;
      streamersRef.current.position.y = Math.sin(t * 1.2) * 0.08;
      streamersRef.current.position.x = THREE.MathUtils.lerp(
        streamersRef.current.position.x,
        mx * 0.3,
        0.05
      );
    }
  });

  return (
    <group>
      {/* 1. Deep Crimson Gloss Ribbon */}
      <mesh ref={crimsonMesh} geometry={crimsonData.geo}>
        <meshPhysicalMaterial
          color="#9E0515"
          emissive="#4A0208"
          emissiveIntensity={0.25}
          metalness={0.4}
          roughness={0.2}
          clearcoat={0.9}
          clearcoatRoughness={0.15}
          side={THREE.DoubleSide}
          transparent
          opacity={0.95}
          userData={{ baseOpacity: 0.95 }}
        />
      </mesh>

      {/* 2. Brushed Silver / Chrome Ribbon */}
      <mesh ref={silverMesh} geometry={silverData.geo}>
        <meshStandardMaterial
          color="#D1D5DB"
          metalness={0.88}
          roughness={0.18}
          side={THREE.DoubleSide}
          transparent
          opacity={0.88}
          userData={{ baseOpacity: 0.88 }}
        />
      </mesh>

      {/* 3. Pearl White Satin Ribbon */}
      <mesh ref={whiteMesh} geometry={whiteData.geo}>
        <meshStandardMaterial
          color="#F8FAFC"
          metalness={0.3}
          roughness={0.25}
          side={THREE.DoubleSide}
          transparent
          opacity={0.92}
          userData={{ baseOpacity: 0.92 }}
        />
      </mesh>

      {/* 4. Fine Contour Streamer Lines */}
      <lineSegments ref={streamersRef} geometry={streamerGeo}>
        <lineBasicMaterial color="#E2E8F0" transparent opacity={0.35} />
      </lineSegments>
    </group>
  );
}

// 3D Interactive Depth Canvas Plane using the artwork
function InteractiveArtworkPlane() {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture("/hero-abstract-bg.jpg");
  const { viewport } = useThree();

  useMemo(() => {
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
  }, [texture]);

  // Compute oversized plane dimensions relative to Three.js camera viewport to prevent black edges
  const planeWidth = Math.max(viewport.width * 2.4, 40);
  const planeHeight = Math.max(viewport.height * 2.4, 28);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    const mx = scrollStore.mouseX;
    const my = scrollStore.mouseY;
    const p = scrollStore.progress;

    // Interactive 3D tilt & parallax on the background artwork plane (subtle and centered)
    meshRef.current.position.x = THREE.MathUtils.lerp(
      meshRef.current.position.x,
      -mx * 0.4,
      0.06
    );
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      my * 0.35,
      0.06
    );
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      my * 0.05 + Math.sin(t * 0.4) * 0.01,
      0.05
    );
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      mx * 0.06 + Math.cos(t * 0.5) * 0.01,
      0.05
    );

    // Subtle 3D vertex wave displacement
    const pos = meshRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const count = pos.count;
    for (let i = 0; i < count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      // Distance from mouse in local plane coordinates
      const dx = vx - mx * 8;
      const dy = vy - (-my * 5);
      const dist = Math.sqrt(dx * dx + dy * dy);
      const mouseWave = Math.sin(dist * 1.5 - t * 3) * Math.exp(-dist * 0.3) * 0.22;
      const ambientWave = Math.sin(vx * 0.5 + t * 1.2) * Math.cos(vy * 0.6 + t * 0.9) * 0.08;

      pos.setZ(i, mouseWave + ambientWave);
    }
    pos.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();

    // Slow fade — artwork stays visible throughout the site
    const heroFalloff = THREE.MathUtils.clamp(1 - p * 1.8, 0.25, 1);
    if (meshRef.current.material instanceof THREE.Material) {
      meshRef.current.material.opacity = heroFalloff;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -2.8]}>
      {/* Dynamic high-segment plane sized to ensure 100% full-bleed coverage */}
      <planeGeometry args={[planeWidth, planeHeight, 64, 48]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.35}
        metalness={0.15}
        transparent
        opacity={1}
        depthWrite={false}
      />
    </mesh>
  );
}

// Interactive 3D Cursor Spotlight that follows the mouse in world space
function CursorSpotlight() {
  const lightRef = useRef<THREE.PointLight>(null);
  const secondaryLightRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    const mx = scrollStore.mouseX;
    const my = scrollStore.mouseY;
    const p = scrollStore.progress;
    const heroFalloff = THREE.MathUtils.clamp(1 - p * 1.6, 0.25, 1);

    if (lightRef.current) {
      // Smoothly track cursor in 3D world space
      lightRef.current.position.x = THREE.MathUtils.lerp(
        lightRef.current.position.x,
        mx * 6.5,
        0.1
      );
      lightRef.current.position.y = THREE.MathUtils.lerp(
        lightRef.current.position.y,
        -my * 4.5,
        0.1
      );
      lightRef.current.position.z = 2.8;
      lightRef.current.intensity = 3.5 * heroFalloff;
    }

    if (secondaryLightRef.current) {
      secondaryLightRef.current.position.x = -mx * 4.0;
      secondaryLightRef.current.position.y = my * 3.0;
      secondaryLightRef.current.position.z = 3.5;
      secondaryLightRef.current.intensity = 2.2 * heroFalloff;
    }
  });

  return (
    <>
      {/* Primary cursor tracking light (warm crimson/white sheen) */}
      <pointLight ref={lightRef} color="#FFD1D5" distance={18} decay={1.8} />
      {/* Counter rim light for metallic sheen */}
      <pointLight ref={secondaryLightRef} color="#E2E8F0" distance={22} decay={2} />
    </>
  );
}

export default function Hero3DArtScene() {
  return (
    <group>
      {/* Interactive 3D depth artwork background plane */}
      <InteractiveArtworkPlane />

      {/* Volumetric 3D dynamic fluid ribbons */}
      <DynamicRibbons />

      {/* Left HUD Gyroscopic Rings */}
      <GyroHudRings position={[-4.6, 0.4, 0.5]} scale={0.95} />

      {/* Right HUD Gyroscopic Rings */}
      <GyroHudRings position={[4.2, -1.3, 0.8]} scale={1.15} />

      {/* Cursor 3D interactive lighting */}
      <CursorSpotlight />
    </group>
  );
}
