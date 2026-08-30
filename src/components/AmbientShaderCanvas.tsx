import React, { useEffect, useRef } from 'react';

interface AmbientShaderCanvasProps {
  accentColor: string;
  portalId: string;
}

export default function AmbientShaderCanvas({ accentColor, portalId }: AmbientShaderCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Respect reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Convert hex accent color to RGB
    const hexToRgb = (hex: string) => {
      const clean = hex.replace('#', '');
      if (clean.length === 3) {
        return {
          r: parseInt(clean[0] + clean[0], 16),
          g: parseInt(clean[1] + clean[1], 16),
          b: parseInt(clean[2] + clean[2], 16),
        };
      }
      return {
        r: parseInt(clean.substring(0, 2), 16) || 177,
        g: parseInt(clean.substring(2, 4), 16) || 74,
        b: parseInt(clean.substring(4, 6), 16) || 38,
      };
    };

    let targetRgb = hexToRgb(accentColor);
    let currentRgb = { ...targetRgb };

    // Atmospheric flow particles
    const particleCount = 28;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 120 + 80,
      baseAlpha: Math.random() * 0.04 + 0.015,
      phase: Math.random() * Math.PI * 2,
    }));

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    let time = 0;
    const render = () => {
      time += 0.008;

      // Smooth color transition
      targetRgb = hexToRgb(accentColor);
      currentRgb.r += (targetRgb.r - currentRgb.r) * 0.05;
      currentRgb.g += (targetRgb.g - currentRgb.g) * 0.05;
      currentRgb.b += (targetRgb.b - currentRgb.b) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Draw subtle atmospheric radial glowing nebulas
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -p.radius) p.x = width + p.radius;
        if (p.x > width + p.radius) p.x = -p.radius;
        if (p.y < -p.radius) p.y = height + p.radius;
        if (p.y > height + p.radius) p.y = -p.radius;

        const currentAlpha = p.baseAlpha + Math.sin(time + p.phase) * 0.01;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        grad.addColorStop(
          0,
          `rgba(${Math.round(currentRgb.r)}, ${Math.round(currentRgb.g)}, ${Math.round(
            currentRgb.b
          )}, ${Math.max(0, currentAlpha)})`
        );
        grad.addColorStop(1, 'rgba(14, 13, 11, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [accentColor, portalId]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[2] opacity-80 mix-blend-screen transition-opacity duration-1000"
      aria-hidden="true"
    />
  );
}
