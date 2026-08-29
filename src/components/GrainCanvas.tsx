import { useEffect, useRef } from 'react';

export default function GrainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let isRunning = true;

    // Use a fixed optimized buffer size (256x256) scaled up via CSS to avoid allocating tens of MB on 4K/Retina displays
    const BUFFER_WIDTH = 256;
    const BUFFER_HEIGHT = 256;
    canvas.width = BUFFER_WIDTH;
    canvas.height = BUFFER_HEIGHT;

    const img = ctx.createImageData(BUFFER_WIDTH, BUFFER_HEIGHT);
    const d = img.data;

    const generateGrain = () => {
      if (!isRunning) return;

      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        d[i] = v;
        d[i + 1] = v;
        d[i + 2] = v;
        d[i + 3] = 26; // subtle grain opacity
      }
      ctx.putImageData(img, 0, 0);

      animId = window.setTimeout(() => {
        requestAnimationFrame(generateGrain);
      }, 70);
    };

    generateGrain();

    return () => {
      isRunning = false;
      clearTimeout(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="rawx-grain"
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none z-[9999] opacity-[0.045] mix-blend-overlay object-cover"
    />
  );
}

