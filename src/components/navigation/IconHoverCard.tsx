import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export type HoverCardAlign = 'left' | 'center' | 'right';
export type HoverCardPosition = 'top' | 'bottom';
export type HoverCardBadgeTone = 'accent' | 'emerald' | 'amber' | 'neutral';

export interface IconHoverCardProps {
  title: string;
  description: string;
  badge?: string;
  badgeTone?: HoverCardBadgeTone;
  urlLabel?: string;
  hint?: string;
  align?: HoverCardAlign;
  position?: HoverCardPosition;
  ariaLabel: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  href?: string;
  isActive?: boolean;
  activeStyle?: React.CSSProperties;
  buttonSize?: 'sm' | 'md' | 'lg' | 'xl';
  buttonShape?: 'rounded-xl' | 'rounded-2xl' | 'rounded-full';
  buttonClassName?: string;
  buttonStyle?: React.CSSProperties;
  ariaCurrent?: 'page' | undefined;
  ariaExpanded?: boolean;
  ariaHaspopup?: 'listbox' | 'menu' | 'dialog' | boolean;
  suppressCard?: boolean;
  cornerBadge?: React.ReactNode;
  footerAction?: React.ReactNode;
  icon: React.ReactNode;
  isBangla?: boolean;
  accentColor?: string;
}

const BANGLA_UNICODE_RE = /[\u0980-\u09FF]/;

function hasBanglaText(value: string): boolean {
  return BANGLA_UNICODE_RE.test(value);
}

export default function IconHoverCard({
  title,
  description,
  badge,
  badgeTone = 'accent',
  urlLabel,
  hint = 'Click to open →',
  align = 'center',
  position = 'bottom',
  ariaLabel,
  onClick,
  href,
  isActive = false,
  activeStyle,
  buttonSize = 'md',
  buttonShape = 'rounded-2xl',
  buttonClassName = '',
  buttonStyle,
  ariaCurrent,
  ariaExpanded,
  ariaHaspopup,
  suppressCard = false,
  cornerBadge,
  footerAction,
  icon,
  isBangla = false,
  accentColor,
}: IconHoverCardProps) {
  const { palette, isDark } = useTheme();
  const resolvedAccent = accentColor || palette.accent;

  const sizeMap: Record<'sm' | 'md' | 'lg' | 'xl', string> = {
    sm: 'w-9 h-9',
    md: 'w-[42px] h-[42px] sm:w-[44px] sm:h-[44px]',
    lg: 'w-[46px] h-[46px] sm:w-[48px] sm:h-[48px]',
    xl: 'w-[50px] h-[50px] sm:w-[56px] sm:h-[56px]',
  };

  const alignClasses: Record<HoverCardAlign, string> = {
    left: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    right: 'right-0',
  };

  const positionWrapperClasses =
    position === 'bottom' ? 'top-full pt-3' : 'bottom-full pb-3';

  const getBadgeStyle = (): React.CSSProperties => {
    if (badgeTone === 'emerald') {
      return {
        backgroundColor: isDark ? 'rgba(16, 185, 129, 0.16)' : 'rgba(5, 150, 105, 0.12)',
        color: isDark ? '#34d399' : '#047857',
        borderColor: isDark ? 'rgba(52, 211, 153, 0.35)' : 'rgba(5, 150, 105, 0.28)',
      };
    }
    if (badgeTone === 'amber') {
      return {
        backgroundColor: isDark ? 'rgba(245, 158, 11, 0.16)' : 'rgba(180, 83, 9, 0.12)',
        color: isDark ? '#fbbf24' : '#b45309',
        borderColor: isDark ? 'rgba(251, 191, 36, 0.35)' : 'rgba(180, 83, 9, 0.28)',
      };
    }
    if (badgeTone === 'neutral') {
      return {
        backgroundColor: 'var(--hh-surface-2)',
        color: 'var(--hh-text)',
        borderColor: 'var(--hh-border)',
      };
    }
    return {
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.06)',
      color: resolvedAccent,
      borderColor: 'var(--hh-border)',
    };
  };

  const titleUsesBangla = isBangla || hasBanglaText(title);
  const descUsesBangla = isBangla || hasBanglaText(description);
  const hintUsesBangla = isBangla || hasBanglaText(hint);

  const sharedTriggerClasses = `group relative inline-flex items-center justify-center ${sizeMap[buttonSize]} ${buttonShape} border transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer shrink-0 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
    isActive ? 'scale-[1.04]' : 'hover:scale-105 hover:-translate-y-0.5 active:scale-95'
  } ${buttonClassName}`;

  const mergedTriggerStyle: React.CSSProperties = {
    backgroundColor: 'var(--hh-surface)',
    borderColor: isActive ? resolvedAccent : 'var(--hh-border)',
    color: 'var(--hh-text)',
    ...buttonStyle,
    ...(isActive ? activeStyle : undefined),
  };

  const triggerElement = href ? (
    <a
      href={href}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-current={ariaCurrent}
      className={sharedTriggerClasses}
      style={mergedTriggerStyle}
    >
      {icon}
      {cornerBadge}
    </a>
  ) : (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-current={ariaCurrent}
      aria-expanded={ariaExpanded}
      aria-haspopup={ariaHaspopup}
      className={sharedTriggerClasses}
      style={mergedTriggerStyle}
    >
      {icon}
      {cornerBadge}
    </button>
  );

  return (
    <div className="relative group/hovercard shrink-0">
      {triggerElement}

      {!suppressCard && (
        <div
          role="tooltip"
          className={`absolute ${positionWrapperClasses} ${alignClasses[align]} z-50 w-[290px] sm:w-[310px] max-w-[calc(100vw-1.5rem)] pointer-events-none group-hover/hovercard:pointer-events-auto group-has-[:focus-visible]/hovercard:pointer-events-auto`}
        >
          <div
            className="w-full rounded-2xl border p-4 backdrop-blur-2xl shadow-2xl opacity-0 translate-y-3 scale-[0.92] group-hover/hovercard:opacity-100 group-hover/hovercard:translate-y-0 group-hover/hovercard:scale-100 group-has-[:focus-visible]/hovercard:opacity-100 group-has-[:focus-visible]/hovercard:translate-y-0 group-has-[:focus-visible]/hovercard:scale-100 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:transform-none text-left overflow-hidden"
            style={{
              backgroundColor: 'var(--hh-glass-bg)',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(15, 23, 42, 0.14)',
              color: 'var(--hh-text)',
              boxShadow: isDark
                ? '0 26px 56px rgba(0, 0, 0, 0.68), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
                : '0 24px 50px rgba(15, 23, 42, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
            }}
          >
            {/* Animated Accent Sweep Bar */}
            <div
              aria-hidden="true"
              className="h-[3px] w-10 group-hover/hovercard:w-20 transition-all duration-300 ease-out rounded-full mb-3"
              style={{ backgroundColor: resolvedAccent }}
            />

            {/* Header Row: Bigger Bold Title + Status/Shortcut Pill */}
            <div className="flex items-center justify-between gap-2.5 mb-2">
              <span
                className={`text-[15px] font-extrabold tracking-tight truncate ${
                  titleUsesBangla ? 'bangla-text' : ''
                }`}
                style={{
                  color: 'var(--hh-text)',
                  ...(titleUsesBangla ? { letterSpacing: 0 } : undefined),
                }}
              >
                {title}
              </span>

              {badge && (
                <span
                  className={`px-2 py-0.5 rounded-md border font-mono text-[10px] font-bold uppercase tracking-wider shrink-0 tabular-nums ${
                    isBangla || hasBanglaText(badge) ? 'bangla-text' : ''
                  }`}
                  style={{
                    ...getBadgeStyle(),
                    ...(isBangla || hasBanglaText(badge) ? { letterSpacing: 0 } : undefined),
                  }}
                >
                  {badge}
                </span>
              )}
            </div>

            {/* Bigger, Crisp 1-2 Line Description */}
            <p
              className={`text-[13px] leading-snug font-medium line-clamp-2 ${
                descUsesBangla ? 'bangla-text' : ''
              }`}
              style={{
                color: 'var(--hh-muted)',
                ...(descUsesBangla ? { letterSpacing: 0 } : undefined),
              }}
            >
              {description}
            </p>

            {/* Optional Interactive Footer Action */}
            {footerAction && (
              <div
                className="mt-3 pt-2.5 border-t flex items-center justify-between gap-2"
                style={{ borderColor: 'var(--hh-border)' }}
              >
                {footerAction}
              </div>
            )}

            {/* Subtle Bottom Action Hint & Minimal Right URL */}
            {(hint || urlLabel) && !footerAction && (
              <div
                className={`mt-3 pt-2.5 border-t flex items-center justify-between gap-2 font-mono text-[10.5px] tracking-wider ${
                  hintUsesBangla ? 'bangla-text' : ''
                }`}
                style={{
                  borderColor: 'var(--hh-border)',
                  color: resolvedAccent,
                  ...(hintUsesBangla ? { letterSpacing: 0 } : undefined),
                }}
              >
                <span className="font-bold">{hint}</span>
                {urlLabel && (
                  <span
                    className="truncate text-[10px] font-normal opacity-75"
                    style={{ color: 'var(--hh-muted)' }}
                  >
                    {urlLabel}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
// END OF FILE: src/components/navigation/IconHoverCard.tsx
