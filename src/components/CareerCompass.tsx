"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CareerCompass() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.to(".node-pulse", {
      opacity: 0.2,
      scale: 1.2,
      duration: 1.5,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut"
    });
  }, []);

  return (
    <section className="relative min-h-screen w-full flex flex-col md:flex-row py-24 px-8 border-t border-white/10" ref={containerRef}>
      <div className="absolute top-8 left-8 font-mono text-xs text-white/40 tracking-wider">LOC_X: 42.12 / LOC_Y: 88.04</div>

      <div className="flex-1 relative flex items-center justify-center border-r border-white/10 pr-8">
        <div className="relative w-full max-w-2xl aspect-square">
           <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: "drop-shadow(0 0 4px rgba(139,134,78,0.3))" }}>
              <line x1="50%" y1="50%" x2="20%" y2="20%" stroke="#8B864E" strokeWidth="2" strokeDasharray="4 4" className="opacity-50" />
              <line x1="50%" y1="50%" x2="80%" y2="30%" stroke="#8B864E" strokeWidth="2" className="opacity-80" />
              <line x1="50%" y1="50%" x2="30%" y2="80%" stroke="#8B864E" strokeWidth="2" className="opacity-30" />
              <line x1="50%" y1="50%" x2="70%" y2="70%" stroke="#8B864E" strokeWidth="2" strokeDasharray="2 2" className="opacity-60" />
           </svg>

           <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full z-10 shadow-[0_0_20px_#fff]"></div>

           <div className="absolute top-[20%] left-[20%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#8B864E] rounded-full z-10 node-pulse"></div>
           <div className="absolute top-[20%] left-[20%] -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-[#8B864E]/30 rounded-full z-0 node-pulse"></div>

           <div className="absolute top-[30%] left-[80%] -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white/60 rounded-full z-10"></div>
           <div className="absolute top-[80%] left-[30%] -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white/40 rounded-full z-10"></div>
           <div className="absolute top-[70%] left-[70%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#8B864E] rounded-full z-10 node-pulse" style={{animationDelay: '0.5s'}}></div>
        </div>
      </div>

      <div className="w-full md:w-96 pl-8 flex flex-col justify-between">
        <div>
          <h3 className="font-mono text-sm text-white/60 mb-6 tracking-widest border-b border-white/10 pb-4">SYSTEM_LEADERBOARD</h3>
          <ul className="font-mono text-base md:text-lg space-y-6">
            <li className="flex justify-between items-center text-[#8B864E]">
              <span>[01] OP_DELTA</span>
              <span>99.4%</span>
            </li>
            <li className="flex justify-between items-center text-white/80">
              <span>[02] OP_SIGMA</span>
              <span>98.1%</span>
            </li>
            <li className="flex justify-between items-center text-white/60">
              <span>[03] OP_NULL</span>
              <span>94.2%</span>
            </li>
          </ul>
        </div>

        <div className="mt-12 glass-panel p-6 text-sm font-mono text-white/50 leading-relaxed">
          <div className="text-white mb-4 text-base font-semibold">ASSESSMENT_ENGINE</div>
          <div>&gt; INIT EVALUATION SEQUENCE</div>
          <div>&gt; LOADING DATA_MODEL... OK</div>
          <div className="text-[#8B864E]">&gt; READY</div>
        </div>
      </div>
    </section>
  );
}
