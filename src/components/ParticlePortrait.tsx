'use client';

import { useEffect, useRef } from 'react';

type PerformanceTier = 'high' | 'balanced' | 'saver';

interface ParticlePortraitProps {
  motion: boolean;
  tier: PerformanceTier;
  onProgress: (progress: number) => void;
  onReady: () => void;
}

interface Particle {
  nx: number;
  ny: number;
  x: number;
  y: number;
  phase: number;
  depth: number;
  strength: number;
  feature: number;
  accent: number;
  twinkle: number;
}

const MAP_URL = '/portrait/tayab-particle-map-v2.webp';

function deterministicNoise(x: number, y: number) {
  const value = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function ellipticalBoost(x: number, y: number, centerX: number, centerY: number, radiusX: number, radiusY: number) {
  const distance = Math.hypot((x - centerX) / radiusX, (y - centerY) / radiusY);
  return Math.max(0, 1 - distance);
}

function samplePortrait(image: HTMLImageElement, tier: PerformanceTier) {
  const sampleWidth = tier === 'high' ? 330 : tier === 'balanced' ? 280 : 210;
  const sampleHeight = Math.round(sampleWidth * (image.naturalHeight / image.naturalWidth));
  const buffer = document.createElement('canvas');
  buffer.width = sampleWidth;
  buffer.height = sampleHeight;
  const context = buffer.getContext('2d', { willReadFrequently: true });
  if (!context) return [];

  context.drawImage(image, 0, 0, sampleWidth, sampleHeight);
  const pixels = context.getImageData(0, 0, sampleWidth, sampleHeight).data;
  const step = tier === 'high' ? 2 : tier === 'balanced' ? 3 : 4;
  const particles: Particle[] = [];

  for (let y = 1; y < sampleHeight - 1; y += step) {
    for (let x = 1; x < sampleWidth - 1; x += step) {
      const index = (y * sampleWidth + x) * 4;
      const luminance = pixels[index] * 0.2126 + pixels[index + 1] * 0.7152 + pixels[index + 2] * 0.0722;
      const subjectStrength = Math.max(0, Math.min(1, (218 - luminance) / 164));
      if (subjectStrength <= 0.06) continue;

      const normalizedX = x / sampleWidth;
      const normalizedY = y / sampleHeight;
      const featureBoost = Math.max(
        ellipticalBoost(normalizedX, normalizedY, 0.385, 0.405, 0.125, 0.06),
        ellipticalBoost(normalizedX, normalizedY, 0.615, 0.405, 0.125, 0.06),
        ellipticalBoost(normalizedX, normalizedY, 0.385, 0.355, 0.14, 0.045) * 0.85,
        ellipticalBoost(normalizedX, normalizedY, 0.615, 0.355, 0.14, 0.045) * 0.85,
        ellipticalBoost(normalizedX, normalizedY, 0.5, 0.505, 0.1, 0.15) * 0.78,
        ellipticalBoost(normalizedX, normalizedY, 0.5, 0.615, 0.19, 0.065),
        ellipticalBoost(normalizedX, normalizedY, 0.5, 0.68, 0.25, 0.15) * 0.58,
      );

      const leftIndex = (y * sampleWidth + Math.max(0, x - step)) * 4;
      const leftLuminance = pixels[leftIndex] * 0.2126 + pixels[leftIndex + 1] * 0.7152 + pixels[leftIndex + 2] * 0.0722;
      const edgeStrength = Math.min(1, Math.abs(luminance - leftLuminance) / 42);
      const chance = 0.08 + subjectStrength * 0.6 + edgeStrength * 0.3 + featureBoost * 0.42;
      if (deterministicNoise(x, y) > chance) continue;

      const depth = deterministicNoise(y, x);
      particles.push({
        nx: x / sampleWidth - 0.5,
        ny: y / sampleHeight - 0.5,
        x: 0,
        y: 0,
        phase: deterministicNoise(x + 7, y + 11) * Math.PI * 2,
        depth,
        strength: Math.max(subjectStrength, edgeStrength * 0.9, featureBoost * 0.82),
        feature: featureBoost,
        accent: deterministicNoise(x + 31, y + 17),
        twinkle: deterministicNoise(x + 53, y + 37),
      });
    }
  }

  return particles;
}

export function ParticlePortrait({ motion, tier, onProgress, onReady }: ParticlePortraitProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const onProgressRef = useRef(onProgress);
  const onReadyRef = useRef(onReady);

  useEffect(() => { onProgressRef.current = onProgress; }, [onProgress]);
  useEffect(() => { onReadyRef.current = onReady; }, [onReady]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    const context = canvas.getContext('2d');
    if (!context) {
      onProgressRef.current(100);
      onReadyRef.current();
      return;
    }

    host.replaceChildren(canvas);
    let disposed = false;
    let frame = 0;
    let particles: Particle[] = [];
    let width = 1;
    let height = 1;
    let pixelRatio = 1;
    let pointerX = 0;
    let pointerY = 0;
    let pointerInside = false;
    let hoverAmount = 0;

    const image = new Image();
    image.decoding = 'async';
    onProgressRef.current(18);

    const resize = () => {
      const rect = host.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      pixelRatio = Math.min(window.devicePixelRatio, tier === 'high' ? 1.6 : tier === 'balanced' ? 1.3 : 1);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      pointerX = event.clientX - rect.left;
      pointerY = event.clientY - rect.top;
      pointerInside = pointerX >= 0 && pointerX <= rect.width && pointerY >= 0 && pointerY <= rect.height;
    };

    const handlePointerLeave = () => { pointerInside = false; };

    const render = (time: number) => {
      if (disposed) return;
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = 'lighter';

      hoverAmount += ((pointerInside && motion ? 1 : 0) - hoverAmount) * 0.065;
      const portraitHeight = Math.min(height * 0.92, width * 1.18);
      const portraitWidth = portraitHeight * 0.858;
      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const pointerNX = pointerInside ? (pointerX / width - 0.5) * 2 : 0;
      const pointerNY = pointerInside ? (pointerY / height - 0.5) * 2 : 0;
      const zoom = 1 + hoverAmount * 0.075;
      const repelRadius = Math.min(width, height) * 0.16;

      const aura = context.createRadialGradient(centerX, centerY * 0.96, 0, centerX, centerY, portraitWidth * 0.62);
      aura.addColorStop(0, `rgba(255, 255, 255, ${0.018 + hoverAmount * 0.018})`);
      aura.addColorStop(0.48, `rgba(255, 255, 255, ${0.008 + hoverAmount * 0.008})`);
      aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
      context.fillStyle = aura;
      context.fillRect(centerX - portraitWidth, centerY - portraitHeight * 0.55, portraitWidth * 2, portraitHeight * 1.1);

      if (motion && tier !== 'saver') {
        context.save();
        context.translate(centerX, centerY);
        context.rotate(time * 0.000025);
        context.strokeStyle = `rgba(255, 255, 255, ${0.025 + hoverAmount * 0.035})`;
        context.lineWidth = 0.6;
        context.setLineDash([2, 13]);
        context.beginPath();
        context.ellipse(0, 0, portraitWidth * 0.49, portraitHeight * 0.43, -0.1, 0, Math.PI * 2);
        context.stroke();
        context.restore();
      }

      for (const particle of particles) {
        const idleX = motion ? Math.sin(time * 0.00045 + particle.phase) * (0.45 + particle.depth) : 0;
        const idleY = motion ? Math.cos(time * 0.00038 + particle.phase) * (0.35 + particle.depth * 0.7) : 0;
        let targetX = centerX + particle.nx * portraitWidth * zoom + idleX + pointerNX * particle.depth * 10 * hoverAmount;
        let targetY = centerY + particle.ny * portraitHeight * zoom + idleY + pointerNY * particle.depth * 7 * hoverAmount;

        if (pointerInside && motion) {
          const dx = targetX - pointerX;
          const dy = targetY - pointerY;
          const distance = Math.hypot(dx, dy);
          if (distance < repelRadius && distance > 0.1) {
            const force = (1 - distance / repelRadius) * (10 + particle.depth * 18) * hoverAmount;
            targetX += (dx / distance) * force;
            targetY += (dy / distance) * force;
          }
        }

        if (particle.x === 0 && particle.y === 0) {
          particle.x = targetX + (particle.depth - 0.5) * 30;
          particle.y = targetY + (particle.depth - 0.5) * 30;
        }
        particle.x += (targetX - particle.x) * (0.07 + particle.depth * 0.025);
        particle.y += (targetY - particle.y) * (0.07 + particle.depth * 0.025);

        const baseSize = tier === 'saver' ? 0.8 : 0.58 + particle.strength * 0.68 + particle.feature * 0.24;
        const size = baseSize * (1 + hoverAmount * particle.depth * 0.8);
        const shimmer = motion ? Math.max(0, Math.sin(time * 0.0013 + particle.twinkle * 18)) * particle.twinkle * 0.1 : 0;
        const alpha = Math.min(1, 0.24 + particle.strength * 0.62 + particle.feature * 0.2 + shimmer);
        const brightAccent = particle.accent > 0.972 && (particle.feature > 0.22 || particle.strength > 0.72);
        context.fillStyle = brightAccent
          ? `rgba(255, 255, 255, ${Math.min(1, alpha * (0.64 + hoverAmount * 0.32))})`
          : `rgba(244, 244, 244, ${alpha})`;
        context.fillRect(particle.x, particle.y, size, size);

        if (particle.strength + particle.feature * 0.32 > 0.8 && particle.depth > 0.74) {
          context.fillStyle = `rgba(255, 255, 255, ${0.08 + hoverAmount * 0.08})`;
          context.beginPath();
          context.arc(particle.x, particle.y, size * 2.8, 0, Math.PI * 2);
          context.fill();
        }
      }

      if (pointerInside && motion && tier !== 'saver') {
        const cursorGlow = context.createRadialGradient(pointerX, pointerY, 0, pointerX, pointerY, repelRadius * 0.72);
        cursorGlow.addColorStop(0, `rgba(255, 255, 255, ${0.045 * hoverAmount})`);
        cursorGlow.addColorStop(0.25, `rgba(255, 255, 255, ${0.012 * hoverAmount})`);
        cursorGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        context.fillStyle = cursorGlow;
        context.beginPath();
        context.arc(pointerX, pointerY, repelRadius * 0.72, 0, Math.PI * 2);
        context.fill();
      }

      context.globalCompositeOperation = 'source-over';
      frame = window.requestAnimationFrame(render);
    };

    image.onload = async () => {
      if (disposed) return;
      onProgressRef.current(70);
      try { await image.decode(); } catch { /* already available from onload */ }
      particles = samplePortrait(image, tier);
      onProgressRef.current(100);
      onReadyRef.current();
    };
    image.onerror = () => {
      onProgressRef.current(100);
      onReadyRef.current();
    };
    image.src = MAP_URL;

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);
    frame = window.requestAnimationFrame(render);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      canvas.remove();
    };
  }, [motion, tier]);

  return <div ref={hostRef} className="face-scene particle-portrait" aria-label="Interactive particle portrait of Tayab Malik" role="img" />;
}
