'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

type PerformanceTier = 'high' | 'balanced' | 'saver';

interface FaceSceneProps {
  motion: boolean;
  tier: PerformanceTier;
  onProgress: (progress: number) => void;
  onReady: () => void;
}

function addScanMaterial(group: THREE.Group, geometry: THREE.BufferGeometry, tier: PerformanceTier) {
  const wire = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({
      color: 0xf4f4f4,
      wireframe: true,
      transparent: true,
      opacity: tier === 'saver' ? 0.1 : 0.18,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );

  const points = new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      color: 0xffffff,
      size: tier === 'high' ? 0.012 : 0.016,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.72,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );

  group.add(wire, points);
}

function addProceduralHair(group: THREE.Group, tier: PerformanceTier) {
  const silhouette = new THREE.Shape();
  silhouette.moveTo(-1.24, 1.45);
  silhouette.bezierCurveTo(-1.34, 1.84, -0.98, 2.12, -0.54, 2.22);
  silhouette.bezierCurveTo(-0.17, 2.31, 0.05, 2.5, 0.28, 2.44);
  silhouette.bezierCurveTo(0.7, 2.34, 1.15, 2.08, 1.24, 1.66);
  silhouette.bezierCurveTo(0.76, 1.77, 0.18, 1.65, -0.28, 1.62);
  silhouette.bezierCurveTo(-0.7, 1.59, -1.02, 1.52, -1.24, 1.45);

  const geometry = new THREE.ExtrudeGeometry(silhouette, {
    depth: 0.54,
    bevelEnabled: true,
    bevelSegments: tier === 'high' ? 4 : 2,
    bevelSize: 0.08,
    bevelThickness: 0.08,
    curveSegments: tier === 'high' ? 16 : 8,
  });
  geometry.translate(0, 0, -0.34);
  addScanMaterial(group, geometry, tier);
}

function makeFallbackHead(tier: PerformanceTier) {
  const group = new THREE.Group();
  const head = new THREE.SphereGeometry(1.52, tier === 'high' ? 48 : 30, tier === 'high' ? 54 : 34);
  head.scale(0.82, 1.16, 0.82);
  addScanMaterial(group, head, tier);
  addProceduralHair(group, tier);
  return group;
}

export function FaceScene({ motion, tier, onProgress, onReady }: FaceSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const onProgressRef = useRef(onProgress);
  const onReadyRef = useRef(onReady);

  useEffect(() => { onProgressRef.current = onProgress; }, [onProgress]);
  useEffect(() => { onReadyRef.current = onReady; }, [onReady]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let animationFrame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let currentX = 0;
    let currentY = 0;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(29, 1, 0.1, 100);
    camera.position.set(0, 0.08, 9.2);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: tier !== 'saver',
        powerPreference: tier === 'saver' ? 'low-power' : 'high-performance',
      });
    } catch {
      const fallback = makeFallbackHead(tier);
      scene.add(fallback);
      onProgressRef.current(100);
      onReadyRef.current();
      return;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, tier === 'high' ? 1.75 : tier === 'balanced' ? 1.35 : 1));
    renderer.domElement.setAttribute('aria-hidden', 'true');
    host.replaceChildren(renderer.domElement);

    const faceRoot = new THREE.Group();
    faceRoot.position.y = -0.1;
    faceRoot.scale.setScalar(0.7);
    scene.add(faceRoot);

    const haloGeometry = new THREE.TorusGeometry(2.46, 0.006, 4, 160);
    const halo = new THREE.Mesh(
      haloGeometry,
      new THREE.MeshBasicMaterial({ color: 0xe10600, transparent: true, opacity: 0.035, blending: THREE.AdditiveBlending }),
    );
    halo.rotation.x = Math.PI / 2.8;
    halo.rotation.z = -0.22;
    faceRoot.add(halo);

    const loader = new GLTFLoader();
    loader.load(
      '/models/lee-perry-smith.glb',
      (gltf) => {
        if (disposed) return;
        let source: THREE.BufferGeometry | null = null;
        gltf.scene.traverse((node) => {
          if (!source && node instanceof THREE.Mesh && node.geometry) source = node.geometry;
        });

        if (source) {
          const geometry = (source as THREE.BufferGeometry).clone();
          geometry.computeBoundingBox();
          const box = geometry.boundingBox;
          if (box) {
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            geometry.translate(-center.x, -center.y, -center.z);
            const scale = 4.35 / Math.max(size.y, 0.001);
            geometry.scale(scale, scale, scale);
          }
          addScanMaterial(faceRoot, geometry, tier);
        } else {
          faceRoot.add(makeFallbackHead(tier));
        }
        onProgressRef.current(100);
        onReadyRef.current();
      },
      (event) => {
        const progress = event.total > 0 ? (event.loaded / event.total) * 100 : Math.min(92, event.loaded / 4096);
        onProgressRef.current(Math.min(99, progress));
      },
      () => {
        if (disposed) return;
        faceRoot.add(makeFallbackHead(tier));
        onProgressRef.current(100);
        onReadyRef.current();
      },
    );

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      renderer.setSize(Math.max(1, width), Math.max(1, height), false);
      camera.aspect = Math.max(1, width) / Math.max(1, height);
      camera.updateProjectionMatrix();
    };

    const handlePointer = (event: PointerEvent) => {
      pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
      pointerY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const animate = (time: number) => {
      if (disposed) return;
      const targetX = motion ? pointerX * 0.18 : 0;
      const targetY = motion ? pointerY * 0.42 : 0;
      currentX += (targetX - currentX) * 0.055;
      currentY += (targetY - currentY) * 0.055;
      faceRoot.rotation.x = -currentX + (motion ? Math.sin(time * 0.00032) * 0.018 : 0);
      faceRoot.rotation.y = currentY + (motion ? Math.sin(time * 0.00023) * 0.07 : 0);
      halo.rotation.z += motion ? 0.0006 : 0;
      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', handlePointer, { passive: true });
    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointer);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [motion, tier]);

  return <div ref={hostRef} className="face-scene" aria-label="Interactive three-dimensional point-cloud face" role="img" />;
}
