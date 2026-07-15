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

export default function LeaderboardAPI() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current || !textRef.current) return;

    gsap.from(textRef.current.children, {
      scale: 0.95,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
      }
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="min-h-screen relative flex items-center px-4 md:px-20 py-32 bg-[var(--color-charcoal)]/30"
    >
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">

        <div className="relative h-[50vh] rounded-2xl overflow-hidden interactive border border-white/5 shadow-2xl">
          <Image
            src="/Leaderboard.png"
            alt="Leaderboard API Documentation"
            fill
            className="object-cover object-left-top"
          />
        </div>

        <div ref={textRef} className="space-y-8 z-10">
          <h2 className="text-5xl lg:text-7xl font-light text-[var(--color-ash)]">Leaderboard API</h2>
          <p className="text-xl text-[var(--color-ash)]/70 font-mono">Speed. Competition. Momentum.</p>

          <GlassSurface className="space-y-4">
            <p className="text-lg text-white/80">
              Focusing on strict engineering, not just UI. Handling real-time score packets at scale.
            </p>
          </GlassSurface>

          <div className="grid grid-cols-2 gap-4 text-sm font-mono text-white/50">
             <div className="border-l-2 border-[var(--color-accent)] pl-4 py-2">Edge Functions</div>
             <div className="border-l-2 border-[var(--color-accent)] pl-4 py-2">Idempotency</div>
             <div className="border-l-2 border-[var(--color-accent)] pl-4 py-2">Realtime Validation</div>
             <div className="border-l-2 border-[var(--color-accent)] pl-4 py-2">Distributed DB</div>
          </div>
        </div>

      </div>
    </section>
  );
}
