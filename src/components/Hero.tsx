import { Icon } from "./Icon";
import { Reveal } from "./Reveal";
import { links, mailHref, profile, stats, telHref } from "@/lib/content";

const contactChips = [
  { icon: "pin" as const, label: profile.location, href: undefined },
  { icon: "phone" as const, label: profile.phone, href: telHref },
  { icon: "mail" as const, label: profile.email, href: mailHref },
];

const socials = [
  { icon: "github" as const, label: "GitHub", href: links.github },
  { icon: "linkedin" as const, label: "LinkedIn", href: links.linkedin },
  { icon: "globe" as const, label: "sinakafi.com", href: links.website },
];

export function Hero() {
  return (
    <section id="top" className="relative pt-32 pb-10 sm:pt-40 sm:pb-16">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <Reveal>
          <span className="glass inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 text-xs text-white/70">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint-400/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-mint-400" />
            </span>
            {profile.availability}
            <span className="h-3 w-px bg-white/15" />
            Open to senior front-end roles
          </span>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="mt-7 text-[2.6rem] font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            <span className="block text-white/55">Hi, I&rsquo;m</span>
            <span className="text-gradient block">{profile.name}</span>
          </h1>
        </Reveal>

        <Reveal delay={140}>
          <p className="mt-6 text-lg font-medium text-white/85 sm:text-xl">
            {profile.role}
          </p>
          <p className="mt-2 font-mono text-[0.8rem] tracking-tight text-iris-300 sm:text-sm">
            {profile.tagline}
          </p>
        </Reveal>

        <Reveal delay={200}>
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
            I design and build scalable front-end architecture for fintech and
            business platforms — design systems, monorepos, multi-app
            ecosystems, and interfaces that stay fast as they grow.
          </p>
        </Reveal>

        <Reveal delay={260}>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#experience"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-void transition-transform hover:-translate-y-0.5"
            >
              View experience
              <Icon
                name="arrow-down"
                className="h-4 w-4 transition-transform group-hover:translate-y-0.5"
              />
            </a>
            <a
              href={mailHref}
              className="glass glass-sheen inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              <Icon name="mail" className="h-4 w-4 text-iris-300" />
              {profile.email}
            </a>
          </div>
        </Reveal>

        <Reveal delay={320}>
          <div className="mt-9 flex flex-wrap items-center gap-x-3 gap-y-2">
            {contactChips.map((chip) => {
              const content = (
                <>
                  <Icon name={chip.icon} className="h-4 w-4 text-white/40" />
                  {chip.label}
                </>
              );

              return chip.href ? (
                <a
                  key={chip.label}
                  href={chip.href}
                  className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
                >
                  {content}
                </a>
              ) : (
                <span
                  key={chip.label}
                  className="inline-flex items-center gap-2 text-sm text-white/60"
                >
                  {content}
                </span>
              );
            })}

            <span className="hidden h-4 w-px bg-white/12 sm:block" />

            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 text-sm text-white/60 transition-colors hover:text-white"
              >
                <Icon name={social.icon} className="h-4 w-4" />
                {social.label}
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={380}>
          <dl className="mt-14 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="glass glass-sheen rounded-2xl px-5 py-4"
              >
                <dt className="text-xs uppercase tracking-[0.14em] text-white/45">
                  {stat.label}
                </dt>
                <dd className="mt-1.5 text-3xl font-semibold tracking-tight text-white">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
