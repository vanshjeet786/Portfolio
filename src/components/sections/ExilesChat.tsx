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

export default function ExilesChat() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current || !contentRef.current) return;

    gsap.from(contentRef.current.children, {
      y: -30,
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
      className="min-h-screen relative flex items-center px-4 md:px-20 py-32 bg-[var(--color-ink)]"
    >
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">

        <div ref={contentRef} className="space-y-8 z-10">
          <h2 className="text-5xl lg:text-7xl font-light text-[var(--color-copper)]">Exiles Chat</h2>
          <p className="text-xl text-[var(--color-copper)]/70">Communication. Strategy. Presence.</p>

          <GlassSurface className="space-y-4 bg-white/5">
            <h3 className="text-sm uppercase tracking-widest text-white/40">The Challenge</h3>
            <p className="text-lg text-white/80">
              Building a real-time communication network that feels instantaneous and reliable.
            </p>
          </GlassSurface>

          <div className="space-y-4 text-white/60">
             <p>Engineered a scalable messaging architecture handling concurrent node signals.</p>
             <p>Optimized database queries for instant relationship visualisations and message delivery.</p>
          </div>
        </div>

        <div className="relative h-[60vh] rounded-2xl overflow-hidden interactive group shadow-2xl shadow-[var(--color-copper)]/10">
          <Image
            src="/Exiles-chat.png"
            alt="Exiles Chat Interface"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

      </div>
    </section>
  );
}
