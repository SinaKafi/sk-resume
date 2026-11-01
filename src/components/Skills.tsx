import { Reveal } from "./Reveal";
import { Section } from "./Section";
import { skillGroups } from "@/lib/content";

export function Skills() {
  return (
    <Section
      id="skills"
      eyebrow="Skills"
      title="The toolkit behind the architecture"
      description="Grouped by how I use them day to day — not a flat keyword list."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {skillGroups.map((group, index) => (
          <Reveal
            key={group.label}
            delay={Math.min(index * 50, 200)}
            className="h-full"
          >
            <div className="glass glass-sheen h-full rounded-3xl p-5 transition-colors hover:bg-white/8">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-aqua-400" />
                <h3 className="text-sm font-semibold tracking-tight text-white">
                  {group.label}
                </h3>
              </div>

              <ul className="mt-4 flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-lg border border-white/8 bg-white/4 px-2.5 py-1 text-[0.75rem] text-white/60 transition-colors hover:border-white/15 hover:text-white/85"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
