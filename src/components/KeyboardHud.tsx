import { useEffect, useState } from 'react';

export default function KeyboardHud() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timeout: any = null;

    const handleKeyDown = () => {
      setVisible(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setVisible(false);
      }, 2600);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timeout);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      id="rx-hud"
      aria-hidden="true"
      className="fixed z-[99] bottom-20 left-1/2 -translate-x-1/2 bg-[#050505]/90 border border-[#f3efe6]/15 px-5 py-3 rounded-lg flex items-center gap-6 font-mono text-[10px] shadow-2xl backdrop-blur-md transition-opacity pointer-events-none"
    >
      <div className="flex flex-col items-center gap-1">
        <kbd className="px-2 py-0.5 bg-[#161512] border border-[#f3efe6]/20 rounded text-[#c8b89a] font-bold">
          ← →
        </kbd>
        <span className="text-[#f3efe6]/40 uppercase tracking-widest text-[8px]">Navigate</span>
      </div>

      <div className="flex flex-col items-center gap-1">
        <kbd className="px-2 py-0.5 bg-[#161512] border border-[#f3efe6]/20 rounded text-[#c8b89a] font-bold">
          ENTER
        </kbd>
        <span className="text-[#f3efe6]/40 uppercase tracking-widest text-[8px]">Open Link</span>
      </div>

      <div className="flex flex-col items-center gap-1">
        <kbd className="px-2 py-0.5 bg-[#161512] border border-[#f3efe6]/20 rounded text-[#c8b89a] font-bold">
          G
        </kbd>
        <span className="text-[#f3efe6]/40 uppercase tracking-widest text-[8px]">Grade LUT</span>
      </div>

      <div className="flex flex-col items-center gap-1">
        <kbd className="px-2 py-0.5 bg-[#161512] border border-[#f3efe6]/20 rounded text-[#c8b89a] font-bold">
          ESC
        </kbd>
        <span className="text-[#f3efe6]/40 uppercase tracking-widest text-[8px]">Close Modal</span>
      </div>
    </div>
  );
}
