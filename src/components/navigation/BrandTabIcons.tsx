import React from 'react';

export interface BrandTabIconProps {
  isActive: boolean;
  className?: string;
}

/**
 * 1. HOME — Bold Kinetic Core Monolith (`HomeCoreIcon`)
 * Heavy octagonal shield housing a high-contrast central diamond core and two structural brackets.
 */
export function HomeCoreIcon({ isActive, className = '' }: BrandTabIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={`w-[26px] h-[26px] sm:w-[28px] sm:h-[28px] shrink-0 overflow-visible ${className}`}
    >
      {/* Heavy Octagonal Shield Frame */}
      <polygon
        points="8,2.5 16,2.5 21.5,8 21.5,16 16,21.5 8,21.5 2.5,16 2.5,8"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
        className="transition-transform duration-300 origin-center"
      />
      {/* Structural Left & Right Brackets expanding outward on hover */}
      <path
        d="M7.5 8.2L5.2 12L7.5 15.8"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="hh-icon-bracket-left"
      />
      <path
        d="M16.5 8.2L18.8 12L16.5 15.8"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="hh-icon-bracket-right"
      />
      {/* Solid Central Diamond Core */}
      <polygon
        points="12,7.2 16.4,12 12,16.8 7.6,12"
        fill="currentColor"
        className={`hh-icon-core-diamond ${isActive ? 'hh-icon-core-active' : ''}`}
      />
    </svg>
  );
}

/**
 * 2. HANDFILM — Bold Mechanical Cinema Aperture & Frame (`HandfilmCinemaIcon`)
 * Thick cinema-camera housing with a bold 6-blade mechanical shutter iris & focal prism.
 */
export function HandfilmCinemaIcon({ isActive, className = '' }: BrandTabIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={`w-[26px] h-[26px] sm:w-[28px] sm:h-[28px] shrink-0 overflow-visible ${className}`}
    >
      {/* Thick Cinema Frame Housing */}
      <rect
        x="2.2"
        y="3.2"
        width="19.6"
        height="17.6"
        rx="4"
        stroke="currentColor"
        strokeWidth="2.4"
      />
      {/* Bold Sprocket Corner Notches */}
      <circle cx="5.2" cy="6.2" r="1.05" fill="currentColor" />
      <circle cx="18.8" cy="6.2" r="1.05" fill="currentColor" />

      {/* 6-Blade Mechanical Shutter Iris */}
      <g className={`hh-icon-iris ${isActive ? 'hh-icon-iris-active' : ''}`}>
        <circle cx="12" cy="12" r="5.6" stroke="currentColor" strokeWidth="2.1" />
        <line x1="12" y1="6.6" x2="14.4" y2="10.2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
        <line x1="16.7" y1="9.3" x2="14.2" y2="12.9" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
        <line x1="16.7" y1="14.7" x2="12.2" y2="14.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
        <line x1="12" y1="17.4" x2="9.6" y2="13.8" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
        <line x1="7.3" y1="14.7" x2="9.8" y2="11.1" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
        <line x1="7.3" y1="9.3" x2="11.8" y2="9.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      </g>

      {/* Solid Center Focal Prism */}
      <polygon
        points="11,9.9 14.3,12 11,14.1"
        fill="currentColor"
        className={`hh-icon-prism ${isActive ? 'hh-icon-prism-active' : ''}`}
      />
    </svg>
  );
}

/**
 * 3. RAWx — Bold Brutalist Forged "X" Crest (`RawxForgedIcon`)
 * Heavy chiseled intersecting blades with razor architectural cuts, center steel rivet & diagonal sheen.
 */
export function RawxForgedIcon({ isActive, className = '' }: BrandTabIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={`w-[26px] h-[26px] sm:w-[28px] sm:h-[28px] shrink-0 overflow-visible hh-icon-rawx-wrap ${
        isActive ? 'hh-icon-rawx-active' : ''
      } ${className}`}
    >
      {/* Heavy Chiseled Intersecting Blades */}
      <polygon
        points="3.2,4.4 7.4,3 20.8,19.6 16.6,21"
        fill="currentColor"
      />
      <polygon
        points="16.6,3 20.8,4.4 7.4,21 3.2,19.6"
        fill="currentColor"
      />
      {/* Razor Industrial Frame Brackets */}
      <path
        d="M2.5 8.5V3.5H7.5M21.5 15.5V20.5H16.5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="square"
      />
      {/* Solid Steel Center Rivet */}
      <circle
        cx="12"
        cy="12"
        r="2.4"
        fill="currentColor"
        stroke="var(--hh-bg, #09090b)"
        strokeWidth="1.3"
      />
      {/* Diagonal Metallic Sheen Line */}
      <line
        x1="-4"
        y1="20"
        x2="8"
        y2="2"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeOpacity="0.65"
        className="hh-icon-rawx-sheen"
      />
    </svg>
  );
}

/**
 * 4. APPS — Bold Modular 2x2 Matrix Grid (`AppsMatrixIcon`)
 * 4 heavy solid rounded-square blocks with staggered domino pop and a rotating central telemetry cross-node.
 */
export function AppsMatrixIcon({ isActive, className = '' }: BrandTabIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={`w-[26px] h-[26px] sm:w-[28px] sm:h-[28px] shrink-0 overflow-visible ${className}`}
    >
      <rect
        x="2.6"
        y="2.6"
        width="7.6"
        height="7.6"
        rx="2.3"
        fill="currentColor"
        className={`hh-icon-block hh-icon-block-1 ${isActive ? 'hh-icon-block-active-1' : ''}`}
      />
      <rect
        x="13.8"
        y="2.6"
        width="7.6"
        height="7.6"
        rx="2.3"
        fill="currentColor"
        className={`hh-icon-block hh-icon-block-2 ${isActive ? 'hh-icon-block-active-2' : ''}`}
      />
      <rect
        x="2.6"
        y="13.8"
        width="7.6"
        height="7.6"
        rx="2.3"
        fill="currentColor"
        className={`hh-icon-block hh-icon-block-3 ${isActive ? 'hh-icon-block-active-3' : ''}`}
      />
      <rect
        x="13.8"
        y="13.8"
        width="7.6"
        height="7.6"
        rx="2.3"
        fill="currentColor"
        className={`hh-icon-block hh-icon-block-4 ${isActive ? 'hh-icon-block-active-4' : ''}`}
      />
      {/* Central Telemetry Cross-Node */}
      <g className="hh-icon-crossnode">
        <path
          d="M12 9.4V14.6M9.4 12H14.6"
          stroke="var(--hh-bg, #09090b)"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <circle cx="12" cy="12" r="1.4" fill="currentColor" />
      </g>
    </svg>
  );
}
// END OF FILE: src/components/navigation/BrandTabIcons.tsx
