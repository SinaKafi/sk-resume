import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { links, profile } from "@/lib/content";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const title = `${profile.name} — ${profile.role}`;
const description = `${profile.role} based in ${profile.location}. ${profile.intro} React, Next.js, TypeScript, design systems and front-end architecture.`;

export const metadata: Metadata = {
  metadataBase: new URL(links.website),
  title: {
    default: title,
    template: `%s — ${profile.name}`,
  },
  description,
  keywords: [
    "Sina Kafi",
    "Senior Front-End Developer",
    "React",
    "Next.js",
    "TypeScript",
    "Front-End Architecture",
    "Design Systems",
    "Monorepo",
    "Tehran",
  ],
  authors: [{ name: profile.name, url: links.website }],
  creator: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: links.website,
    title,
    description,
    siteName: profile.name,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#04050c",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // The inline script below adds a class to <html> before React hydrates.
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/*
          Arms the scroll-reveal start state before first paint. Content is
          rendered visible by default, so a browser with JavaScript disabled
          (or a script that fails to load) still gets the full page.

          The timeout is a safety net: `RevealObserver` cancels it as soon as
          the app boots, but if the bundle never runs, every block is revealed
          after 3s rather than leaving the page blank.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){document.documentElement.classList.add('js');" +
              "window.__revealFallback=setTimeout(function(){" +
              "var els=document.querySelectorAll('[data-reveal]:not([data-revealed])');" +
              "for(var i=0;i<els.length;i++){els[i].setAttribute('data-revealed','')}},3000)})()",
          }}
        />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
