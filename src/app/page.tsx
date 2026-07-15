"use client";

import React, { Suspense, lazy } from "react";
import Scene from "@/components/Scene";
import TrueFocus from "@/components/TrueFocus";

const Purpose = lazy(() => import("@/components/sections/Purpose"));
const CareerCompass = lazy(() => import("@/components/sections/CareerCompass"));
const Skillometer = lazy(() => import("@/components/sections/Skillometer"));
const StanceHealth = lazy(() => import("@/components/sections/StanceHealth"));
const LeaderboardAPI = lazy(() => import("@/components/sections/LeaderboardAPI"));
const ExilesChat = lazy(() => import("@/components/sections/ExilesChat"));
const Footer = lazy(() => import("@/components/sections/Footer"));

const SectionFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin opacity-50"></div>
  </div>
);

export default function Home() {
  return (
    <main className="relative w-full text-foreground overflow-hidden">
      <Scene />

      {/* Landing / Hero Space */}
      <section className="h-screen w-full flex flex-col items-center justify-center relative z-10">
        <div className="text-center space-y-4 pt-32">
           <TrueFocus
            sentence="Vanshjeet Singh"
            manualMode={false}
            blurAmount={3}
            borderColor="var(--color-accent)"
            glowColor="rgba(139, 134, 78, 0.2)"
            animationDuration={1.5}
            pauseBetweenAnimations={1}
          />
          <div className="opacity-0 translate-y-4 animate-[fadeIn_3s_ease-out_2s_forwards] pointer-events-none">
            <h1 className="text-lg md:text-xl text-[var(--color-stone)] tracking-[0.3em] font-light uppercase">
              Product Engineer
            </h1>
          </div>
        </div>
      </section>

      <Suspense fallback={<SectionFallback />}>
        <Purpose />
        <CareerCompass />
        <Skillometer />
        <StanceHealth />
        <LeaderboardAPI />
        <ExilesChat />
        <Footer />
      </Suspense>
    </main>
  );
}
