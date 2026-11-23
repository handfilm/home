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
  hint?: string;
  align?: HoverCardAlign;
  position?: HoverCardPosition;
  ariaLabel: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  href?: string;
  isActive?: boolean;
  activeStyle?: React.CSSProperties;
  buttonSize?: 'md' | 'lg';
  buttonShape?: 'rounded-xl' | 'rounded-full';
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
  hint = 'Click to open →',
  align = 'center',
  position = 'bottom',
  ariaLabel,
  onClick,
  href,
  isActive = false,
  activeStyle,
  buttonSize = 'md',
  buttonShape = 'rounded-xl',
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

  const sizeClasses =
    buttonSize === 'lg'
      ? 'w-[42px] h-[42px] sm:w-[46px] sm:h-[46px]'
      : 'w-[38px] h-[38px] sm:w-[42px] sm:h-[42px]';

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

  const sharedTriggerClasses = `group relative inline-flex items-center justify-center ${sizeClasses} ${buttonShape} border transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer shrink-0 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
    isActive ? 'scale-[1.03]' : 'hover:scale-105 active:scale-95'
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
          className={`absolute ${positionWrapperClasses} ${alignClasses[align]} z-50 w-[260px] max-w-[calc(100vw-1.5rem)] pointer-events-none group-hover/hovercard:pointer-events-auto group-has-[:focus-visible]/hovercard:pointer-events-auto`}
        >
          <div
            className="w-full rounded-2xl border p-3.5 backdrop-blur-2xl shadow-2xl opacity-0 translate-y-2 scale-95 group-hover/hovercard:opacity-100 group-hover/hovercard:translate-y-0 group-hover/hovercard:scale-100 group-has-[:focus-visible]/hovercard:opacity-100 group-has-[:focus-visible]/hovercard:translate-y-0 group-has-[:focus-visible]/hovercard:scale-100 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:transform-none text-left"
            style={{
              backgroundColor: 'var(--hh-glass-bg)',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(15, 23, 42, 0.12)',
              color: 'var(--hh-text)',
              boxShadow: isDark
                ? '0 22px 48px rgba(0, 0, 0, 0.62), inset 0 1px 0 rgba(255, 255, 255, 0.06)'
                : '0 20px 44px rgba(15, 23, 42, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
            }}
          >
            {/* Subtle Top Accent Hairline */}
            <div
              aria-hidden="true"
              className="h-[2px] w-10 rounded-full mb-2.5"
              style={{ backgroundColor: resolvedAccent }}
            />

            {/* Header Row: Bold Title + Status/Shortcut Pill */}
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span
                className={`text-xs font-bold tracking-wide truncate ${
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
                  className={`px-2 py-0.5 rounded-md border font-mono text-[9.5px] font-bold uppercase tracking-wider shrink-0 tabular-nums ${
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

            {/* 1-2 Line Concise Description */}
            <p
              className={`text-[11.5px] leading-relaxed line-clamp-2 ${
                descUsesBangla ? 'bangla-text' : ''
              }`}
              style={{
                color: 'var(--hh-muted)',
                ...(descUsesBangla ? { letterSpacing: 0 } : undefined),
              }}
            >
              {description}
            </p>

            {/* Optional Interactive Footer Action (e.g., inline Play/Pause toggle) */}
            {footerAction && (
              <div
                className="mt-2.5 pt-2 border-t flex items-center justify-between gap-2"
                style={{ borderColor: 'var(--hh-border)' }}
              >
                {footerAction}
              </div>
            )}

            {/* Subtle Bottom Action Hint */}
            {hint && !footerAction && (
              <div
                className={`mt-2.5 pt-2 border-t flex items-center justify-between font-mono text-[10px] tracking-wider ${
                  hintUsesBangla ? 'bangla-text' : ''
                }`}
                style={{
                  borderColor: 'var(--hh-border)',
                  color: resolvedAccent,
                  ...(hintUsesBangla ? { letterSpacing: 0 } : undefined),
                }}
              >
                <span className="font-semibold">{hint}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
// END OF FILE: src/components/navigation/IconHoverCard.tsx
