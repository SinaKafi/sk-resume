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

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return null;
}
