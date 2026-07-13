"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function ExilesChat() {
  const radarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (radarRef.current) {
      gsap.to(radarRef.current, {
        rotation: 360,
        duration: 4,
        repeat: -1,
        ease: "linear"
      });
    }
  }, []);

  return (
    <section className="relative min-h-screen w-full border-t border-white/10 flex flex-col py-24 px-8 overflow-hidden">
      <div className="absolute inset-0 technical-grid opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl w-full mx-auto flex-1 flex flex-col md:flex-row gap-12 relative z-10">

        <div className="flex-1 flex flex-col border border-white/10 bg-[#111111]/80 backdrop-blur-md p-8 relative rounded-md shadow-2xl">
           <h3 className="font-mono text-sm text-white/50 tracking-widest border-b border-white/10 pb-5 mb-8 font-semibold">SECURE_COMM_UPLINK</h3>

           <div className="flex-1 font-mono text-sm md:text-base space-y-8 overflow-hidden">
              <div className="flex gap-6 opacity-90">
                 <div className="text-white/40 font-medium">14:02:41</div>
                 <div className="flex-1">
                    <div className="text-[#8B864E] mb-2 font-semibold tracking-wide">OP_082 <span className="text-white/30 text-xs ml-3 font-normal">[0x9F...3A]</span></div>
                    <div className="text-white/90 leading-relaxed">Infiltration successful. Awaiting next command sequence.</div>
                 </div>
              </div>

              <div className="flex gap-6">
                 <div className="text-white/40 font-medium">14:03:12</div>
                 <div className="flex-1">
                    <div className="text-white/60 mb-2 font-semibold tracking-wide">SYS_CMD <span className="text-white/30 text-xs ml-3 font-normal">[AUTO]</span></div>
                    <div className="text-[#8B864E] p-3 border-l-2 border-[#8B864E] bg-[#8B864E]/5 mt-2 tracking-wide font-medium">&gt; INITIATING PROTOCOL THETA</div>
                 </div>
              </div>

              <div className="flex gap-6">
                 <div className="text-white/40 font-medium">14:05:01</div>
                 <div className="flex-1">
                    <div className="text-[#8B864E] mb-2 flex items-center gap-3 font-semibold tracking-wide">
                      <div className="w-2 h-2 bg-[#8B864E] rounded-full animate-pulse"></div>
                      OP_104 <span className="text-white/30 text-xs ml-3 font-normal">[0x2B...9C]</span>
                    </div>
                    <div className="text-white/90 leading-relaxed">Copy that. Holding position at node 4.</div>
                 </div>
              </div>
           </div>

           <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-4 text-sm font-mono">
              <div className="text-[#8B864E] font-bold">&gt;</div>
              <div className="text-white/30 flex-1 tracking-widest">COMMAND_INPUT...</div>
              <div className="w-2.5 h-5 bg-[#8B864E] animate-pulse"></div>
           </div>
        </div>

        <div className="w-full md:w-96 border border-white/10 bg-[#111111]/80 backdrop-blur-md p-8 flex flex-col items-center rounded-md shadow-2xl">
           <h3 className="w-full font-mono text-sm text-white/50 tracking-widest border-b border-white/10 pb-5 mb-10 font-semibold">NETWORK_TOPOLOGY</h3>

           <div className="relative w-64 h-64 rounded-full border border-[#8B864E]/30 flex items-center justify-center mb-12">
              <div className="absolute inset-0 rounded-full border border-[#8B864E]/10 scale-50"></div>

              <div ref={radarRef} className="absolute inset-0 rounded-full origin-center">
                 <div className="absolute top-0 right-1/2 w-1/2 h-1/2 bg-gradient-to-br from-[#8B864E]/20 to-transparent origin-bottom-right" style={{ clipPath: 'polygon(100% 100%, 100% 0, 0 0)'}}></div>
              </div>

              <div className="w-3 h-3 bg-[#8B864E] rounded-full shadow-[0_0_15px_#8B864E] z-10"></div>

              <div className="absolute top-[20%] right-[30%] w-2 h-2 bg-white rounded-full z-10">
                 <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-xs font-mono text-white/60 tracking-wider">OP_082</div>
              </div>
              <div className="absolute bottom-[30%] left-[20%] w-2 h-2 bg-[#8B864E] rounded-full z-10">
                 <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-xs font-mono text-[#8B864E] tracking-wider">OP_104</div>
              </div>
           </div>

           <div className="w-full font-mono text-xs md:text-sm text-white/60 space-y-4 tracking-wide">
             <div className="flex justify-between border-b border-white/5 pb-2"><span>PEERS_ACTIVE:</span> <span className="text-white font-medium">03</span></div>
             <div className="flex justify-between border-b border-white/5 pb-2"><span>ENCRYPTION:</span> <span className="text-[#8B864E] font-medium">AES-256</span></div>
             <div className="flex justify-between"><span>STATUS:</span> <span className="text-white font-medium">UPLINK_STABLE</span></div>
           </div>
        </div>

      </div>
    </section>
  );
}
