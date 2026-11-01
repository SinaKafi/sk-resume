import { Icon } from "./Icon";
import { Reveal } from "./Reveal";
import { Section } from "./Section";
import { projects } from "@/lib/content";

export function Projects() {
  return (
    <Section
      id="projects"
      eyebrow="Selected projects"
      title="Products I've shipped"
      description="A snapshot of platforms built end to end — dashboards, admin tooling and customer-facing interfaces."
    >
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => {
          const external = Boolean(project.href);

          const card = (
            <article className="glass glass-sheen flex h-full flex-col rounded-3xl p-6 transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-white/9">
              <div className="flex items-start justify-between gap-3">
                <span className="glass grid h-11 w-11 place-items-center rounded-2xl font-mono text-xs font-semibold tracking-tight text-white/80">
                  {project.monogram}
                </span>
                <Icon
                  name={external ? "arrow-up-right" : "layers"}
                  className={`h-4 w-4 ${
                    external
                      ? "text-white/30 transition-colors group-hover:text-iris-300"
                      : "text-white/15"
                  }`}
                />
              </div>

              <h3 className="mt-5 text-lg font-semibold tracking-tight text-white">
                {project.name}
              </h3>
              <p className="mt-2 flex-1 text-[0.85rem] leading-relaxed text-white/55">
                {project.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-1.5 border-t border-white/8 pt-4">
                {project.stack.map((item) => (
                  <span
                    key={item}
                    className="rounded-md border border-white/8 bg-white/4 px-2 py-1 font-mono text-[0.7rem] text-white/50"
                  >
                    {item}
                  </span>
                ))}
              </div>

              {!external ? (
                <p className="mt-4 text-[0.7rem] uppercase tracking-[0.14em] text-white/30">
                  Internal platform
                </p>
              ) : null}
            </article>
          );

          return (
            <Reveal
              key={project.name}
              delay={index * 80}
              className="group h-full"
            >
              {project.href ? (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="block h-full rounded-3xl"
                  aria-label={`${project.name} — opens in a new tab`}
                >
                  {card}
                </a>
              ) : (
                card
              )}
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
