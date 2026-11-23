import { useEffect, useState } from 'react';

export default function KeyboardHud() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const handleKeyDown = () => {
      setVisible(true);
      if (timeout !== null) clearTimeout(timeout);
      timeout = setTimeout(() => {
        setVisible(false);
      }, 2600);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeout !== null) clearTimeout(timeout);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      id="rx-hud"
      aria-hidden="true"
      className="fixed z-[99] bottom-24 left-1/2 -translate-x-1/2 border px-5 py-3 rounded-lg flex items-center gap-6 font-mono text-[10px] shadow-2xl backdrop-blur-md transition-opacity pointer-events-none hh-theme-transition"
      style={{
        backgroundColor: 'var(--hh-glass-bg)',
        borderColor: 'var(--hh-border)',
        color: 'var(--hh-text)',
      }}
    >
      <div className="flex flex-col items-center gap-1">
        <kbd
          className="px-2 py-0.5 border rounded font-bold"
          style={{
            backgroundColor: 'var(--hh-surface)',
            borderColor: 'var(--hh-border)',
            color: 'var(--hh-accent)',
          }}
        >
          ← →
        </kbd>
        <span className="uppercase tracking-widest text-[8px]" style={{ color: 'var(--hh-muted)' }}>
          Navigate
        </span>
      </div>

      <div className="flex flex-col items-center gap-1">
        <kbd
          className="px-2 py-0.5 border rounded font-bold"
          style={{
            backgroundColor: 'var(--hh-surface)',
            borderColor: 'var(--hh-border)',
            color: 'var(--hh-accent)',
          }}
        >
          ENTER
        </kbd>
        <span className="uppercase tracking-widest text-[8px]" style={{ color: 'var(--hh-muted)' }}>
          Open Link
        </span>
      </div>

      <div className="flex flex-col items-center gap-1">
        <kbd
          className="px-2 py-0.5 border rounded font-bold"
          style={{
            backgroundColor: 'var(--hh-surface)',
            borderColor: 'var(--hh-border)',
            color: 'var(--hh-accent)',
          }}
        >
          G
        </kbd>
        <span className="uppercase tracking-widest text-[8px]" style={{ color: 'var(--hh-muted)' }}>
          Grade LUT
        </span>
      </div>

      <div className="flex flex-col items-center gap-1">
        <kbd
          className="px-2 py-0.5 border rounded font-bold"
          style={{
            backgroundColor: 'var(--hh-surface)',
            borderColor: 'var(--hh-border)',
            color: 'var(--hh-accent)',
          }}
        >
          ESC
        </kbd>
        <span className="uppercase tracking-widest text-[8px]" style={{ color: 'var(--hh-muted)' }}>
          Close Modal
        </span>
      </div>
    </div>
  );
}
