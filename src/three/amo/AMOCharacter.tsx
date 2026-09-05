"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useExperienceStore } from "@/three/quality-controller";

export type AMOAnimationState =
  | "idle"
  | "curious"
  | "tracking"
  | "greeting"
  | "thinking"
  | "explaining"
  | "discovery"
  | "presentation"
  | "studio"
  | "device"
  | "camera"
  | "float"
  | "closing";

interface AMOCharacterProps {
  state?: AMOAnimationState;
  interactive?: boolean;
  scale?: number;
}

export function AMOCharacter({
  state = "idle",
  interactive = true,
  scale = 1,
}: AMOCharacterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const headGroupRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const winkVisorMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const tier = useExperienceStore((s) => s.tier);

  const [hovered, setHovered] = useState(false);

  // Pre-allocated vector references for 0 per-frame allocations (TRD §6)
  const mouseSmooth = useRef(new THREE.Vector2(0, 0));
  const targetHeadRot = useRef(new THREE.Vector3(0, 0, 0));
  const currentHeadRot = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((stateCtx, delta) => {
    if (!groupRef.current) return;

    const time = stateCtx.clock.getElapsedTime();
    const speedMult = hovered ? 1.3 : 1.0;

    // 1. Gentle breathing & hover oscillation
    const floatY = Math.sin(time * 2 * speedMult) * 0.05;
    groupRef.current.position.y = floatY;

    // 2. Dynamic Visor LED Wink Glow Pulse (Lime-Green #22C55E)
    if (winkVisorMatRef.current) {
      const baseIntensity = hovered ? 2.4 : 1.8;
      winkVisorMatRef.current.emissiveIntensity =
        baseIntensity + Math.sin(time * 3) * 0.35;
    }

    // 3. State-specific poses & limb micro-motions
    let headX = 0;
    let headY = 0;
    let headZ = 0;
    let leftArmX = 0;
    let leftArmZ = 0.2;
    let rightArmX = 0;
    let rightArmZ = -0.2;
    let leftLegX = 0;
    let rightLegX = 0;

    switch (state) {
      case "greeting":
        // Scene 1: Calm, curious arrival, head tilts slightly
        headZ = Math.sin(time * 2.5) * 0.08;
        headY = Math.sin(time * 1.5) * 0.12;
        headX = -0.04;
        rightArmX = Math.sin(time * 3) * 0.25 - 0.2;
        rightArmZ = -0.35;
        break;

      case "explaining":
      case "presentation":
        // Scene 2: Confident, playful stance (one hand gesturing outward)
        headY = Math.sin(time * 1.8) * 0.15;
        headX = -0.05;
        rightArmX = -0.7 + Math.sin(time * 2) * 0.1;
        rightArmZ = -0.5;
        leftArmX = 0.2;
        leftArmZ = 0.35;
        break;

      case "curious":
        // Scene 3: Calm and observant posture, head turning slightly side to side
        headY = Math.sin(time * 1.2) * 0.25;
        headZ = 0.12;
        leftArmX = Math.sin(time * 1.2) * 0.1;
        rightArmX = -Math.sin(time * 1.2) * 0.1;
        break;

      case "studio":
        // Scene 4: Leaning forward, one hand reaching toward desk adjusting equipment
        headX = 0.15;
        headY = 0.1;
        rightArmX = -0.8 + Math.sin(time * 2) * 0.08;
        rightArmZ = -0.2;
        leftArmX = 0.1;
        break;

      case "device":
        // Scene 5: Facing slightly to side, one arm raised interacting with unseen interface
        headX = 0.05;
        headY = -0.35;
        leftArmX = -0.9 + Math.sin(time * 2.5) * 0.12;
        leftArmZ = 0.4;
        rightArmX = 0.1;
        break;

      case "discovery":
        // Scene 6: Open, neutral stance, palm open and extended forward
        headY = Math.sin(time * 1.5) * 0.1;
        rightArmX = -0.6 + Math.sin(time * 2) * 0.05;
        rightArmZ = -0.3;
        leftArmX = -0.2;
        leftArmZ = 0.25;
        break;

      case "thinking":
        // Scene 8: Hands forward as if assembling/stacking blocks
        headX = 0.12;
        headZ = -0.1;
        leftArmX = -0.6 + Math.sin(time * 2) * 0.08;
        leftArmZ = 0.25;
        rightArmX = -0.6 - Math.sin(time * 2) * 0.08;
        rightArmZ = -0.25;
        break;

      case "closing":
        // Scene 9: Soft welcoming posture, slight head tilt
        headZ = 0.08 + Math.sin(time * 1.5) * 0.04;
        headY = Math.sin(time * 0.8) * 0.1;
        leftArmZ = 0.25;
        rightArmZ = -0.25;
        break;

      case "float":
        groupRef.current.position.y = Math.sin(time * 2.5) * 0.12;
        headZ = Math.sin(time * 1.8) * 0.06;
        leftLegX = Math.sin(time * 2) * 0.15;
        rightLegX = -Math.sin(time * 2) * 0.15;
        break;

      case "tracking":
      case "idle":
      default:
        headX = Math.sin(time * 1) * 0.03;
        headY = Math.sin(time * 0.8) * 0.04;
        leftArmX = Math.sin(time * 1.2) * 0.05;
        rightArmX = -Math.sin(time * 1.2) * 0.05;
        break;
    }

    targetHeadRot.current.set(headX, headY, headZ);

    // Smooth delta-damped lerp
    const lerpRate = delta * 5;
    currentHeadRot.current.x = THREE.MathUtils.lerp(
      currentHeadRot.current.x,
      targetHeadRot.current.x,
      lerpRate
    );
    currentHeadRot.current.y = THREE.MathUtils.lerp(
      currentHeadRot.current.y,
      targetHeadRot.current.y,
      lerpRate
    );
    currentHeadRot.current.z = THREE.MathUtils.lerp(
      currentHeadRot.current.z,
      targetHeadRot.current.z,
      lerpRate
    );

    // 4. Pointer tracking integration (Tier 2)
    if (interactive && tier >= 2 && headGroupRef.current) {
      mouseSmooth.current.x = THREE.MathUtils.lerp(
        mouseSmooth.current.x,
        stateCtx.pointer.x * 0.4,
        delta * 4
      );
      mouseSmooth.current.y = THREE.MathUtils.lerp(
        mouseSmooth.current.y,
        stateCtx.pointer.y * 0.3,
        delta * 4
      );

      headGroupRef.current.rotation.x =
        -mouseSmooth.current.y + currentHeadRot.current.x;
      headGroupRef.current.rotation.y =
        mouseSmooth.current.x + currentHeadRot.current.y;
      headGroupRef.current.rotation.z = currentHeadRot.current.z;
    } else if (headGroupRef.current) {
      headGroupRef.current.rotation.x = currentHeadRot.current.x;
      headGroupRef.current.rotation.y = currentHeadRot.current.y;
      headGroupRef.current.rotation.z = currentHeadRot.current.z;
    }

    // Limb rotations
    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = THREE.MathUtils.lerp(
        leftArmRef.current.rotation.x,
        leftArmX,
        lerpRate
      );
      leftArmRef.current.rotation.z = THREE.MathUtils.lerp(
        leftArmRef.current.rotation.z,
        leftArmZ,
        lerpRate
      );
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = THREE.MathUtils.lerp(
        rightArmRef.current.rotation.x,
        rightArmX,
        lerpRate
      );
      rightArmRef.current.rotation.z = THREE.MathUtils.lerp(
        rightArmRef.current.rotation.z,
        rightArmZ,
        lerpRate
      );
    }
    if (leftLegRef.current) {
      leftLegRef.current.rotation.x = THREE.MathUtils.lerp(
        leftLegRef.current.rotation.x,
        leftLegX,
        lerpRate
      );
    }
    if (rightLegRef.current) {
      rightLegRef.current.rotation.x = THREE.MathUtils.lerp(
        rightLegRef.current.rotation.x,
        rightLegX,
        lerpRate
      );
    }
  });

  return (
    <group
      ref={groupRef}
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* ============================================================ */}
      {/* 1. HEAD: Round White Astronaut Helmet with Dark Visor & Wink */}
      {/* ============================================================ */}
      <group ref={headGroupRef} position={[0, 0.48, 0]}>
        {/* Round White Helmet Outer Shell */}
        <mesh castShadow>
          <sphereGeometry args={[0.38, 32, 32]} />
          <meshStandardMaterial
            color="#FFFFFF"
            roughness={0.2}
            metalness={0.1}
          />
        </mesh>

        {/* Helmet Ear Ring Capsule Accents */}
        <mesh position={[0.37, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.3} metalness={0.2} />
        </mesh>
        <mesh position={[-0.37, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.3} metalness={0.2} />
        </mesh>

        {/* Subtle Dark Visor Screen */}
        <mesh position={[0, 0.02, 0.22]}>
          <boxGeometry args={[0.42, 0.22, 0.24]} />
          <meshStandardMaterial
            color="#090D16"
            roughness={0.1}
            metalness={0.85}
          />
        </mesh>

        {/* Visor Screen Front Bezel Plate */}
        <mesh position={[0, 0.02, 0.342]}>
          <planeGeometry args={[0.34, 0.16]} />
          <meshStandardMaterial
            color="#050811"
            roughness={0.05}
            metalness={0.9}
          />
        </mesh>

        {/* Visor LED Face: Green Wink Graphic */}
        {/* Left Eye: Closed Winking Eye (Arch Curve) */}
        <mesh position={[-0.08, 0.04, 0.344]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.03, 0.007, 8, 16, Math.PI]} />
          <meshStandardMaterial
            ref={winkVisorMatRef}
            color="#22C55E"
            emissive="#22C55E"
            emissiveIntensity={2.0}
            roughness={0.1}
          />
        </mesh>

        {/* Right Eye: Open Eye Dot */}
        <mesh position={[0.08, 0.04, 0.344]}>
          <sphereGeometry args={[0.022, 12, 12]} />
          <meshStandardMaterial
            color="#22C55E"
            emissive="#22C55E"
            emissiveIntensity={2.0}
            roughness={0.1}
          />
        </mesh>

        {/* Visor LED Smile: Curved Smile Arc */}
        <mesh position={[0, -0.03, 0.344]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.045, 0.006, 8, 16, Math.PI]} />
          <meshStandardMaterial
            color="#22C55E"
            emissive="#22C55E"
            emissiveIntensity={2.0}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 2. BODY: Black Tracksuit with "UA" Chest Monogram */}
      {/* ============================================================ */}
      <group position={[0, 0, 0]}>
        {/* Tracksuit Torso */}
        <mesh position={[0, -0.06, 0]} castShadow>
          <capsuleGeometry args={[0.26, 0.32, 16, 24]} />
          <meshStandardMaterial
            color="#18181B"
            roughness={0.65}
            metalness={0.15}
          />
        </mesh>

        {/* "UA" Wordmark Monogram Badge on Chest */}
        <mesh position={[0, 0.04, 0.24]}>
          <planeGeometry args={[0.11, 0.07]} />
          <meshStandardMaterial
            color="#FFFFFF"
            emissive="#FFFFFF"
            emissiveIntensity={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Tracksuit Zipper / Center Seam Accent */}
        <mesh position={[0, -0.08, 0.242]}>
          <planeGeometry args={[0.015, 0.26]} />
          <meshStandardMaterial color="#3F3F46" metalness={0.5} roughness={0.3} />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 3. ARMS: Black Tracksuit Sleeves with Shoulder Accent */}
      {/* ============================================================ */}
      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.32, 0.06, 0]}>
        <mesh position={[0, -0.16, 0]} castShadow>
          <capsuleGeometry args={[0.075, 0.22, 12, 16]} />
          <meshStandardMaterial color="#18181B" roughness={0.65} />
        </mesh>
        {/* Left Sleeve Stripe */}
        <mesh position={[0, -0.12, 0]}>
          <cylinderGeometry args={[0.077, 0.077, 0.03, 16]} />
          <meshStandardMaterial
            color="#22C55E"
            emissive="#22C55E"
            emissiveIntensity={0.6}
          />
        </mesh>
        {/* Glove / Hand */}
        <mesh position={[0, -0.29, 0]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} metalness={0.1} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.32, 0.06, 0]}>
        <mesh position={[0, -0.16, 0]} castShadow>
          <capsuleGeometry args={[0.075, 0.22, 12, 16]} />
          <meshStandardMaterial color="#18181B" roughness={0.65} />
        </mesh>
        {/* Right Sleeve Stripe */}
        <mesh position={[0, -0.12, 0]}>
          <cylinderGeometry args={[0.077, 0.077, 0.03, 16]} />
          <meshStandardMaterial
            color="#22C55E"
            emissive="#22C55E"
            emissiveIntensity={0.6}
          />
        </mesh>
        {/* Glove / Hand */}
        <mesh position={[0, -0.29, 0]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} metalness={0.1} />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 4. LEGS & SNEAKERS: White Sneakers with Lime-Green Accents */}
      {/* ============================================================ */}
      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.13, -0.32, 0]}>
        {/* Tracksuit Leg */}
        <mesh position={[0, -0.1, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.075, 0.22, 16]} />
          <meshStandardMaterial color="#18181B" roughness={0.65} />
        </mesh>

        {/* White Sneaker Body */}
        <mesh position={[0, -0.25, 0.04]} castShadow>
          <boxGeometry args={[0.13, 0.1, 0.22]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.2} metalness={0.05} />
        </mesh>

        {/* Sneaker Lime-Green Accent Sole */}
        <mesh position={[0, -0.3, 0.04]}>
          <boxGeometry args={[0.135, 0.025, 0.225]} />
          <meshStandardMaterial
            color="#22C55E"
            emissive="#22C55E"
            emissiveIntensity={0.8}
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.13, -0.32, 0]}>
        {/* Tracksuit Leg */}
        <mesh position={[0, -0.1, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.075, 0.22, 16]} />
          <meshStandardMaterial color="#18181B" roughness={0.65} />
        </mesh>

        {/* White Sneaker Body */}
        <mesh position={[0, -0.25, 0.04]} castShadow>
          <boxGeometry args={[0.13, 0.1, 0.22]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.2} metalness={0.05} />
        </mesh>

        {/* Sneaker Lime-Green Accent Sole */}
        <mesh position={[0, -0.3, 0.04]}>
          <boxGeometry args={[0.135, 0.025, 0.225]} />
          <meshStandardMaterial
            color="#22C55E"
            emissive="#22C55E"
            emissiveIntensity={0.8}
            roughness={0.3}
          />
        </mesh>
      </group>
    </group>
  );
}


