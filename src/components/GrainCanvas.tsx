import { useEffect, useRef } from 'react';

export default function GrainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const generateGrain = () => {
      const w = canvas.width;
      const h = canvas.height;
      if (w === 0 || h === 0) return;

      const img = ctx.createImageData(w, h);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        d[i] = v;
        d[i + 1] = v;
        d[i + 2] = v;
        d[i + 3] = 22; // subtle opacity
      }
      ctx.putImageData(img, 0, 0);
      animId = window.setTimeout(() => {
        requestAnimationFrame(generateGrain);
      }, 70);
    };

    resize();
    window.addEventListener('resize', resize);
    generateGrain();

    return () => {
      window.removeEventListener('resize', resize);
      clearTimeout(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="rawx-grain"
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.045] mix-blend-overlay"
    />
  );
}
