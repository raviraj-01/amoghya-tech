/**
 * Three.js GPU Memory Disposal Utility
 * Reference: TRD_3D_PERFORMANCE.md Section 4.4
 *
 * Three.js does not garbage collect GPU textures and geometries automatically.
 * When scenes are scrolled past or components unmount, we must recursively dispose resources.
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function disposeHierarchy(root: THREE.Object3D | null) {
  if (!root) return;

  root.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (mesh.geometry) {
      mesh.geometry.dispose();
    }

    if (mesh.material) {
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((mat) => disposeMaterial(mat));
      } else {
        disposeMaterial(mesh.material);
      }
    }
  });
}

function disposeMaterial(material: THREE.Material) {
  const mat = material as unknown as Record<string, unknown>;
  const textureKeys = [
    "map",
    "normalMap",
    "roughnessMap",
    "metalnessMap",
    "emissiveMap",
    "aoMap",
    "alphaMap",
    "envMap",
    "displacementMap",
    "bumpMap",
    "lightMap",
    "specularMap",
    "gradientMap",
    "clearcoatMap",
    "clearcoatNormalMap",
    "sheenColorMap",
    "transmissionMap",
    "thicknessMap",
  ];

  textureKeys.forEach((key) => {
    const texture = mat[key];
    if (texture && typeof (texture as THREE.Texture).dispose === "function") {
      (texture as THREE.Texture).dispose();
    }
  });

  material.dispose();
}

/**
 * Hook to automatically dispose 3D group or mesh hierarchy on component unmount.
 */
export function useDisposal<T extends THREE.Object3D>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const target = ref.current;
    return () => {
      if (target) {
        disposeHierarchy(target);
      }
    };
  }, []);

  return ref;
}

