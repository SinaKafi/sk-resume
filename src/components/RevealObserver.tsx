"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    /** Safety net scheduled by the inline script in the layout. */
    __revealFallback?: ReturnType<typeof setTimeout>;
  }
}

/**
 * Single observer for every `[data-reveal]` block on the page — cheaper than
 * one IntersectionObserver per element. Mounted once from the page.
 *
 * Elements are visible by default; the inline script in the layout adds `js`
 * to `<html>`, which is what actually arms the hidden start state. So if this
 * component never runs, the content is still on screen.
 */
export function RevealObserver() {
  useEffect(() => {
    // The app booted, so the no-bundle fallback is no longer needed.
    if (window.__revealFallback !== undefined) {
      clearTimeout(window.__revealFallback);
      window.__revealFallback = undefined;
    }

    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])"),
    );

    if (!elements.length) return;

    if (typeof IntersectionObserver === "undefined") {
      elements.forEach((element) => {
        element.setAttribute("data-revealed", "");
      });
      return;
    }

    const reveal = (element: HTMLElement) => {
      element.setAttribute("data-revealed", "");
      observer.unobserve(element);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target as HTMLElement);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );

    elements.forEach((element) => observer.observe(element));

    /*
     * Belt and braces: the observer only reports threshold crossings, and an
     * element taller than ten times the (shrunk) root can never reach its
     * `threshold`. Anything already on screen at mount is revealed directly so
     * it cannot be stranded at `opacity: 0`. Same boundary the observer uses,
     * so this is a no-op wherever the observer already fires.
     */
    requestAnimationFrame(() => {
      const limit = window.innerHeight * 0.9;
      for (const element of elements) {
        if (element.hasAttribute("data-revealed")) continue;
        const rect = element.getBoundingClientRect();
        if (rect.top < limit && rect.bottom > 0) reveal(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
