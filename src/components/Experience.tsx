import { Icon } from "./Icon";
import { Reveal } from "./Reveal";
import { Section } from "./Section";
import { experience } from "@/lib/content";

export function Experience() {
  return (
    <Section
      id="experience"
      eyebrow="Experience"
      title="Eight years across fintech, commerce and government platforms"
      description="From senior individual contributor to front-end tech lead — owning delivery end to end across multi-application ecosystems."
    >
      <ol className="relative space-y-5">
        {/* Timeline rail, hidden on small screens where cards go full width. */}
        <span
          aria-hidden="true"
          className="absolute left-[7px] top-3 bottom-3 hidden w-px bg-gradient-to-b from-iris-400/40 via-white/12 to-transparent sm:block"
        />

        {experience.map((role, index) => (
          <li key={`${role.company}-${role.period}`} className="sm:pl-10">
            <span
              aria-hidden="true"
              className="glass absolute left-0 mt-7 hidden h-4 w-4 rounded-full ring-4 ring-void sm:block"
            >
              <span className="absolute inset-[3px] rounded-full bg-iris-400" />
            </span>

            <Reveal delay={Math.min(index * 60, 180)}>
              <article className="glass glass-sheen rounded-3xl p-6 transition-colors hover:bg-white/8 sm:p-7">
                <header className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight text-white">
                      {role.company}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-iris-300">
                      {role.role}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-white/50">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/4 px-3 py-1.5">
                      <Icon name="briefcase" className="h-3.5 w-3.5" />
                      {role.period}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/4 px-3 py-1.5">
                      <Icon name="pin" className="h-3.5 w-3.5" />
                      {role.location}
                    </span>
                  </div>
                </header>

                {role.summary ? (
                  <p className="mt-5 max-w-3xl text-sm leading-relaxed text-white/60">
                    {role.summary}
                  </p>
                ) : null}

                <ul className="mt-6 grid gap-x-7 gap-y-3.5 md:grid-cols-2">
                  {role.highlights.map((highlight) => (
                    <li key={highlight.title} className="flex gap-3">
                      <Icon
                        name="check"
                        className="mt-[3px] h-4 w-4 shrink-0 text-mint-400/80"
                      />
                      <p className="text-[0.85rem] leading-relaxed text-white/60">
                        <span className="font-medium text-white/85">
                          {highlight.title}:
                        </span>{" "}
                        {highlight.body}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap gap-1.5 border-t border-white/8 pt-5">
                  {role.stack.map((item) => (
                    <span
                      key={item}
                      className="rounded-md border border-white/8 bg-white/4 px-2 py-1 font-mono text-[0.7rem] text-white/50"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
