"use client";

import React, { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import GlassSurface from "../GlassSurface";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function StanceHealth() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current || !textRef.current) return;

    gsap.from(textRef.current.children, {
      y: 50,
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
      id="stance-health"
      ref={sectionRef}
      className="min-h-screen relative flex items-center px-4 md:px-20 py-32 bg-[var(--color-stone)]/10"
    >
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">

        <div ref={textRef} className="space-y-8 z-10 order-2 lg:order-1 pointer-events-auto">
          <h2 className="text-5xl lg:text-7xl font-light text-[var(--color-stone)]">Stance Health</h2>
          <p className="text-xl text-[var(--color-stone)]/80">Calm. Clinical. Beautiful.</p>

          <GlassSurface className="space-y-4 bg-white/5 border-white/10">
            <h3 className="text-sm uppercase tracking-widest text-white/40">The Challenge</h3>
            <p className="text-lg text-white/80">
              Transforming clinical anatomy into an accessible, high-performance web experience while managing complex SEO challenges.
            </p>
          </GlassSurface>

          <div className="space-y-4 text-white/60">
             <p><strong>Architecture:</strong> Next.js App Router with heavy React Three Fiber integration.</p>
             <p><strong>Performance:</strong> Optimized WebGL rendering, handling large procedural 3D models while maintaining 60fps and perfect Lighthouse scores.</p>
          </div>
        </div>

        <div className="order-1 lg:order-2 h-full min-h-[60vh] w-full flex items-center justify-center relative pointer-events-none">
          {/* The SpineModel is rendered globally in the Scene component, but it tracks scroll progress of this section */}
        </div>

      </div>
    </section>
  );
}
