"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Loader from "@/components/Loader";
import Nav from "@/components/Nav";
import CustomCursor from "@/components/CustomCursor";
import SectionTracker from "@/components/SectionTracker";
import SmoothScroll from "@/components/SmoothScroll";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Certifications from "@/components/Certifications";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

// The 3D scene touches window/WebGL — load client-side only.
const Scene = dynamic(() => import("@/components/canvas/Scene"), { ssr: false });

export default function Page() {
  const [ready, setReady] = useState(false);

  return (
    <SmoothScroll>
      <Loader onDone={() => setReady(true)} />
      <Scene />
      <div className="grain" />
      <CustomCursor />
      <SectionTracker />
      <Nav ready={ready} />

      {/* All sections are transparent — the fixed 3D canvas shows through the entire site */}
      <main id="main" className="relative z-[2]">
        <Hero ready={ready} />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Certifications />
        <Education />
        <Contact />
        <Footer />
      </main>
    </SmoothScroll>
  );
}
