import { Icon } from "./Icon";
import { Reveal } from "./Reveal";
import { Section } from "./Section";
import { additional, profile } from "@/lib/content";

const focusAreas = [
  {
    title: "Front-End Architecture",
    body: "Monorepos, shared packages and multi-application ecosystems that stay consistent as they scale.",
  },
  {
    title: "Design Systems",
    body: "Versioned component libraries with strong type safety, theming, design tokens and RTL support.",
  },
  {
    title: "Performance",
    body: "Code splitting, virtualization and request-level optimisations measured against real workloads.",
  },
  {
    title: "Developer Experience",
    body: "Modern build tooling, standardised conventions and CI/CD that make delivery predictable.",
  },
];

export function About() {
  return (
    <Section
      id="about"
      eyebrow="About"
      title="Front-end architecture for products that grow"
      description="Technical ownership, maintainable architecture and type safety — applied end to end, from technical analysis through delivery and maintenance."
    >
      <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <Reveal className="h-full">
          <div className="glass glass-sheen h-full rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="glass grid h-11 w-11 place-items-center rounded-2xl text-white/80">
                <Icon name="layers" className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-medium text-white">Profile</p>
                <p className="text-xs text-white/45">
                  {profile.intro}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4 text-[0.95rem] leading-relaxed text-white/65">
              {profile.summary.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-2 border-t border-white/8 pt-6">
              {additional.languages.map((language) => (
                <span
                  key={language.name}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-3 py-1.5 text-xs text-white/65"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-iris-400" />
                  {language.name}
                  <span className="text-white/35">{language.level}</span>
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {focusAreas.map((area, index) => (
            <Reveal key={area.title} delay={index * 70} className="h-full">
              <div className="glass glass-sheen group h-full rounded-3xl p-5 transition-colors hover:bg-white/8">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-white">
                    {area.title}
                  </p>
                  <Icon
                    name="arrow-up-right"
                    className="h-4 w-4 shrink-0 text-white/25 transition-colors group-hover:text-iris-300"
                  />
                </div>
                <p className="mt-2 text-[0.85rem] leading-relaxed text-white/55">
                  {area.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
