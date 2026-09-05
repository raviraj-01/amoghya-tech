/**
 * Memory-safe Three.js calculation vectors
 * Reference: TRD_3D_PERFORMANCE.md Section 6
 *
 * Pre-allocated vectors and Euler angles to guarantee 0 per-frame heap allocations.
 */

import { useMemo, useRef } from "react";
import * as THREE from "three";

export function usePreAllocatedVectors() {
  const v1 = useRef(new THREE.Vector3());
  const v2 = useRef(new THREE.Vector3());
  const v3 = useRef(new THREE.Vector3());
  const euler = useRef(new THREE.Euler());
  const quat = useRef(new THREE.Quaternion());
  const matrix = useRef(new THREE.Matrix4());
  const color = useRef(new THREE.Color());
  const mouse2d = useRef(new THREE.Vector2());

  return useMemo(
    () => ({
      v1: v1.current,
      v2: v2.current,
      v3: v3.current,
      euler: euler.current,
      quat: quat.current,
      matrix: matrix.current,
      color: color.current,
      mouse2d: mouse2d.current,
    }),
    []
  );
}

