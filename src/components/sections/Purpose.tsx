"use client";

import React from "react";

export default function Purpose() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center px-4 md:px-20 py-32 bg-transparent text-center relative z-10">
      <div className="max-w-4xl mx-auto space-y-16">
        <h2 className="text-4xl md:text-5xl lg:text-7xl font-light tracking-tight text-white/90">
          I love solving problems.
        </h2>

        <div className="grid md:grid-cols-2 gap-12 text-left mt-24">
          <div className="space-y-6">
            <h3 className="text-xl text-white/80">Curiosity</h3>
            <p className="text-lg text-white/50 leading-relaxed">
              Why do I build? It starts with an insatiable need to understand how things work, and more importantly, how they can work better. Programming is just a tool to translate that understanding into reality.
            </p>
          </div>
          <div className="space-y-6">
            <h3 className="text-xl text-white/80">Systems</h3>
            <p className="text-lg text-white/50 leading-relaxed">
              From crafting seamless user experiences to architecting robust backend infrastructures, I approach every challenge holistically. It&apos;s not just about code; it&apos;s about the product, the business, and the people using it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
