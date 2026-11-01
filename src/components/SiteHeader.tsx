"use client";

import { useEffect, useState } from "react";
import { navItems, profile } from "@/lib/content";
import { Icon } from "./Icon";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>(navItems[0].href);

  // Shrink the bar into a floating glass pill once the page moves.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight whichever section currently owns the middle of the viewport.
  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);

    if (!sections.length || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (top) setActive(`#${top.target.id}`);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.2, 0.5, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Keep the page from scrolling behind the open mobile sheet.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/*
        Tap-to-dismiss scrim. It sits last in paint order within the header's
        own stacking context (`-z-10`), so it covers the page but stays under
        the bar and the sheet — tapping anywhere else closes the menu instead of
        leaking through to whatever button happens to be behind it.
      */}
      {open ? (
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          className="fixed inset-0 -z-10 md:hidden"
        />
      ) : null}

      <div className="mx-auto w-full max-w-6xl px-3 pt-3 sm:px-5 sm:pt-5">
        <nav
          aria-label="Primary"
          className={`glass-nav flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5 transition-all duration-500 sm:rounded-full sm:px-4 ${
            scrolled ? "sm:py-2" : "sm:py-3"
          }`}
        >
          <a
            href="#top"
            className="group flex items-center gap-3 rounded-full pr-2"
            aria-label={`${profile.name} — back to top`}
          >
            <span className="glass grid h-9 w-9 place-items-center rounded-xl text-[0.8rem] font-semibold tracking-tight text-white">
              SK
            </span>
            <span className="hidden text-sm font-medium text-white/85 transition-colors group-hover:text-white sm:block">
              {profile.name}
            </span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const isActive = active === item.href;
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative rounded-full px-3.5 py-2 text-sm transition-colors ${
                      isActive
                        ? "text-white"
                        : "text-white/60 hover:text-white/90"
                    }`}
                  >
                    {isActive ? (
                      <span className="absolute inset-0 rounded-full border border-white/12 bg-white/8" />
                    ) : null}
                    <span className="relative">{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href="#contact"
              className="hidden rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/14 sm:inline-flex"
            >
              Get in touch
            </a>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid h-10 w-10 place-items-center rounded-xl border border-white/12 bg-white/6 text-white/85 transition-colors hover:bg-white/12 md:hidden"
            >
              <Icon name={open ? "close" : "menu"} className="h-5 w-5" />
            </button>
          </div>
        </nav>

        {open ? (
          <div
            id="mobile-nav"
            /*
             * `glass-nav`, not `glass`: this sheet floats over prose, and the
             * base pane is deliberately near-transparent — the hero headline
             * showed straight through it. It is also a sibling of the bar
             * rather than nested inside it, so the no-glass-on-glass rule holds.
             */
            className="glass-nav mt-2 overflow-hidden rounded-2xl p-2 md:hidden"
          >
            <ul className="flex flex-col">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-sm text-white/75 transition-colors hover:bg-white/8 hover:text-white"
                  >
                    {item.label}
                    <Icon
                      name="arrow-up-right"
                      className="h-4 w-4 text-white/35"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </header>
  );
}
