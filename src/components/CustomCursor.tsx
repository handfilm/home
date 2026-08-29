import { useEffect, useState } from 'react';

interface CustomCursorProps {
  label: string;
}

export default function CustomCursor({ label }: CustomCursorProps) {
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only enable on non-touch devices
    const isTouch = window.matchMedia('(max-width: 780px)').matches || 'ontouchstart' in window;
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      id="cursor"
      aria-hidden="true"
      className="fixed pointer-events-none z-[80] w-16 h-16 -ml-8 -mt-8 flex items-center justify-center transition-opacity duration-200"
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        opacity: visible ? 1 : 0,
      }}
    >
      <svg viewBox="0 0 64 64" className="w-full h-full text-[#f3efe6]/70">
        <line x1="32" y1="4" x2="32" y2="18" stroke="currentColor" strokeWidth="1" />
        <line x1="32" y1="46" x2="32" y2="60" stroke="currentColor" strokeWidth="1" />
        <line x1="4" y1="32" x2="18" y2="32" stroke="currentColor" strokeWidth="1" />
        <line x1="46" y1="32" x2="60" y2="32" stroke="currentColor" strokeWidth="1" />
        <circle cx="32" cy="32" r="2" fill="currentColor" />
      </svg>
      {label && (
        <div className="absolute top-[68px] left-1/2 -translate-x-1/2 text-[9px] tracking-[0.18em] uppercase whitespace-nowrap text-[#f3efe6] bg-[#0e0d0b]/90 px-2 py-0.5 border border-[#f3efe6]/20 font-mono shadow-lg backdrop-blur-sm">
          {label}
        </div>
      )}
    </div>
  );
}
