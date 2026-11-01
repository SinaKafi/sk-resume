import { Backdrop } from "@/components/Backdrop";
import { About } from "@/components/About";
import { Contact, Footer } from "@/components/Contact";
import { Experience } from "@/components/Experience";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { RevealObserver } from "@/components/RevealObserver";
import { SiteHeader } from "@/components/SiteHeader";
import { Skills } from "@/components/Skills";

export default function Home() {
  return (
    <>
      <Backdrop />
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
