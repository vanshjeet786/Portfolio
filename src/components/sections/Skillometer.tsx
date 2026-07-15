"use client";

import React, { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import GlassSurface from "../GlassSurface";
import GooeyEffect from "../GooeyEffect";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function Skillometer() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current || !textRef.current) return;

    gsap.from(textRef.current.children, {
      x: -50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 60%",
      }
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="min-h-screen relative flex items-center px-4 md:px-20 py-32 bg-[var(--color-forest)]/5 overflow-hidden"
    >
      <GooeyEffect />
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-12 items-center relative z-10">
        <div className="lg:col-span-7 grid gap-8">
          <div className="relative h-[40vh] md:h-[50vh] rounded-2xl overflow-hidden interactive">
            <Image
              src="/skillometer..png"
              alt="Skillometer Dashboard"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative h-[30vh] md:h-[40vh] rounded-2xl overflow-hidden interactive md:ml-12">
            <Image
              src="/skillometer.skitre.ai daf09edb8776.png"
              alt="Skillometer Analytics"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div ref={textRef} className="lg:col-span-5 space-y-8 z-10">
          <h2 className="text-5xl lg:text-7xl font-light text-[var(--color-sage)]">Skillometer</h2>
          <p className="text-xl text-[var(--color-sage)]/70">Human intelligence. Evaluation. Adaptive systems.</p>

          <GlassSurface className="space-y-4">
            <h3 className="text-sm uppercase tracking-widest text-white/40">The Problem</h3>
            <p className="text-lg text-white/80">
              How can organisations evaluate people more accurately than traditional assessments?
            </p>
          </GlassSurface>

          <div className="space-y-4 text-white/60">
             <p>Developed an advanced assessment engine mapping complex role structures.</p>
             <p>Integrated AI for nuanced, context-aware evaluations, creating a highly organic, non-linear testing experience.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
