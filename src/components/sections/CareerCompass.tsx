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

export default function CareerCompass() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current || !contentRef.current) return;

    gsap.from(contentRef.current.children, {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
      }
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="min-h-screen relative flex items-center px-4 md:px-20 py-32"
      style={{
        background: "linear-gradient(to bottom, transparent, rgba(25, 25, 112, 0.2))", // Midnight blue hint
      }}
    >
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
        <div ref={contentRef} className="space-y-8 z-10">
          <h2 className="text-5xl lg:text-7xl font-light text-[var(--color-cream)]">Career Compass</h2>
          <p className="text-xl text-[var(--color-brass)]/80 italic">Quiet intelligence. Exploration. Direction.</p>

          <GlassSurface className="space-y-4">
            <h3 className="text-sm uppercase tracking-widest text-[var(--color-cream)]/50">The Problem</h3>
            <p className="text-lg text-white/80">
              How can career guidance become more accurate instead of becoming more generic?
            </p>
          </GlassSurface>

          <div className="space-y-4 text-white/60">
            <p><strong>Architecture:</strong> Scalable evaluation pipeline.</p>
            <p><strong>AI Workflow:</strong> Advanced context processing and role recommendation.</p>
          </div>
        </div>

        <div className="relative h-[60vh] rounded-2xl overflow-hidden interactive group">
          <Image
            src="/careercompass.png"
            alt="Career Compass Interface"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-[var(--color-brass)]/10 mix-blend-overlay"></div>
        </div>
      </div>
    </section>
  );
}
