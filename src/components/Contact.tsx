import { Icon, type IconName } from "./Icon";
import { Reveal } from "./Reveal";
import { links, mailHref, profile, telHref } from "@/lib/content";

const channels: {
  icon: IconName;
  label: string;
  value: string;
  href: string;
  external?: boolean;
}[] = [
  {
    icon: "mail",
    label: "Email",
    value: profile.email,
    href: mailHref,
  },
  {
    icon: "phone",
    label: "Phone",
    value: profile.phone,
    href: telHref,
  },
  {
    icon: "github",
    label: "GitHub",
    value: "github.com/SinaKafi",
    href: links.github,
    external: true,
  },
  {
    icon: "linkedin",
    label: "LinkedIn",
    value: "linkedin.com/in/sina-kafi",
    href: links.linkedin,
    external: true,
  },
];

export function Contact() {
  return (
    <section id="contact" className="py-16 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="glass glass-sheen relative overflow-hidden rounded-[2rem] p-7 sm:p-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-iris-500/25 blur-[100px]"
            />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-iris-300">
                <span className="h-1.5 w-1.5 rounded-full bg-aqua-400" />
                Contact
              </span>

              <h2 className="mt-5 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Let&rsquo;s build something that scales.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/60">
                Available for senior front-end and front-end architecture work.
                The fastest way to reach me is email — I usually reply within a
                day.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={mailHref}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-void transition-transform hover:-translate-y-0.5"
                >
                  <Icon name="mail" className="h-4 w-4" />
                  Send an email
                </a>
                {/* <a
                  href={links.website}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="glass inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  <Icon name="globe" className="h-4 w-4 text-iris-300" />
                  sinakafi.com
                </a> */}
              </div>

              <dl className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {channels.map((channel) => (
                  <div key={channel.label}>
                    <dt className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-white/40">
                      <Icon name={channel.icon} className="h-3.5 w-3.5" />
                      {channel.label}
                    </dt>
                    <dd className="mt-2">
                      <a
                        href={channel.href}
                        {...(channel.external
                          ? { target: "_blank", rel: "noreferrer noopener" }
                          : {})}
                        className="text-sm text-white/75 underline-offset-4 transition-colors hover:text-white hover:underline"
                      >
                        {channel.value}
                      </a>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/8 py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-5 text-xs text-white/40 sm:flex-row sm:px-8">
        <p>
          © {new Date().getFullYear()} {profile.name}. Built with Next.js,
          Tailwind CSS and a lot of backdrop blur.
        </p>
        <a
          href="#top"
          className="inline-flex items-center gap-1.5 transition-colors hover:text-white/80"
        >
          Back to top
          <Icon name="arrow-up-right" className="h-3.5 w-3.5 -rotate-45" />
        </a>
      </div>
    </footer>
  );
}
