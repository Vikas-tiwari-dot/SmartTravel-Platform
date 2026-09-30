import { twMerge } from "tailwind-merge";

/**
 * Combines conditional classNames AND resolves conflicting Tailwind
 * utilities (e.g. a base `bg-paper` overridden by a passed-in `bg-ink`)
 * by keeping the last one — order in the stylesheet doesn't get to decide.
 * Usage: cn('base', condition && 'extra', anotherCondition ? 'a' : 'b')
 */
export function cn(...parts) {
  return twMerge(parts.filter(Boolean).join(" "));
}
