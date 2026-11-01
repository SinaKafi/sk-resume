import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger in milliseconds, applied as a transition delay. */
  delay?: number;
};

/**
 * Marks a block for the scroll-reveal animation.
 *
 * This is a *server* component on purpose: the element renders fully visible,
 * so the page is complete without JavaScript. `RevealObserver` arms the hidden
 * start state (via `html.js`) and reveals each block as it enters the viewport.
 */
export function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  return (
    <div
      data-reveal=""
      className={className}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
