import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

type SectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

/** Shared section shell: consistent rhythm, heading treatment and scroll anchor. */
export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className = "",
}: SectionProps) {
  return (
    <section id={id} className={`py-16 sm:py-24 ${className}`}>
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <Reveal>
          <header className="mb-10 sm:mb-14">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-iris-300 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-aqua-400" />
              {eyebrow}
            </span>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {title}
            </h2>
            {description ? (
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/60">
                {description}
              </p>
            ) : null}
          </header>
        </Reveal>

        {children}
      </div>
    </section>
  );
}
