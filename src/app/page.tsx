import { Backdrop } from "@/components/Backdrop";
import { About } from "@/components/About";
import { Contact, Footer } from "@/components/Contact";
import { CursorGlow } from "@/components/CursorGlow";
import { Experience } from "@/components/Experience";
import { Hero } from "@/components/Hero";
import { MotionScene } from "@/components/MotionScene";
import { Projects } from "@/components/Projects";
import { RevealObserver } from "@/components/RevealObserver";
import { SiteHeader } from "@/components/SiteHeader";
import { Skills } from "@/components/Skills";

export default function Home() {
  return (
    <>
      <Backdrop />
      {/* Rendered after the backdrop and at the same depth, so the particle
          field paints over the aurora and still sits under every glass pane. */}
      <MotionScene />
      <CursorGlow />
      <SiteHeader />
      <RevealObserver />
      <main className="flex-1">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
