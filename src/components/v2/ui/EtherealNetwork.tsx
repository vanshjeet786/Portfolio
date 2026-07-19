import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { SoundEngine } from '@/utils/SoundEngine';

// ============================================================================
// COMPONENT: EXILES DISCOVER BOX (LEFT)
// ============================================================================
const ExilesDiscoverBox = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!boxRef.current || !contentRef.current) return;
    const contentElements = contentRef.current.children;

    if (isOpen) {
      // 1. Morph the box in (ClipPath shockwave)
      gsap.fromTo(boxRef.current, 
        { display: 'flex', clipPath: 'circle(0% at 30% 50%)', opacity: 0, filter: 'blur(20px)' },
        { clipPath: 'circle(150% at 30% 50%)', opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: 'expo.out' }
      );
      // 2. Stagger content in
      gsap.fromTo(contentElements,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'expo.out', delay: 0.3 }
      );
    } else {
      // 1. Stagger content out
      gsap.to(contentElements, { y: -20, opacity: 0, duration: 0.4, ease: 'power2.in' });
      // 2. Morph the box out
      gsap.to(boxRef.current, {
        clipPath: 'circle(0% at 30% 50%)', opacity: 0, filter: 'blur(20px)', duration: 0.8, ease: 'power3.inOut', delay: 0.2,
        onComplete: () => {
          if (boxRef.current) boxRef.current.style.display = 'none';
        }
      });
    }
  }, [isOpen]);

  return (
    <div 
      ref={boxRef} 
      style={{ display: 'none' }}
      className="absolute left-16 top-1/2 -translate-y-1/2 w-[45vw] max-w-2xl bg-[#050505]/70 backdrop-blur-3xl border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),_0_30px_100px_rgba(225,29,72,0.15)] p-16 rounded-3xl flex-col z-40"
    >
      <div ref={contentRef} className="flex flex-col h-full w-full relative">
        {/* Header & Close */}
        <div className="flex justify-between items-start mb-12 w-full">
          <div>
            <span className="text-[9px] uppercase tracking-[0.4em] text-[#e11d48] font-mono">
              Module 03 // Realtime
            </span>
            <h2 className="text-5xl md:text-6xl font-light mt-4 text-white tracking-tight">
              Exiles
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="w-12 h-12 flex items-center justify-center group cursor-none hover:bg-white/[0.03] rounded-full transition-colors duration-500"
          >
            <div className="w-5 h-[1px] bg-white rotate-45 absolute group-hover:rotate-135 transition-transform duration-500" />
            <div className="w-5 h-[1px] bg-white -rotate-45 absolute group-hover:-rotate-135 transition-transform duration-500" />
          </button>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-gradient-to-r from-white/10 to-transparent mb-12" />

        {/* Synopsis */}
        <h3 className="text-[10px] tracking-[0.25em] text-white/50 uppercase font-mono mb-6">
          Architectural Synopsis
        </h3>
        <p className="text-sm md:text-base text-gray-400 leading-relaxed font-light mb-12 max-w-xl">
          A purely chronological, highly-available messaging fabric. Built to ensure absolute idempotency across distributed nodes. Distance is eliminated. Before words, there is only the persistent signal.
        </p>
        
        {/* Specs Grid (Skipper UI Bento style) */}
        <div className="grid grid-cols-2 gap-6 w-full">
          <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl hover:bg-white/[0.04] transition-colors duration-500">
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#e11d48] font-mono block mb-3">Stack Environment</span>
            <span className="text-xs text-white/90 font-light tracking-wide block">WebSockets (Socket.io)</span>
            <span className="text-xs text-white/90 font-light tracking-wide block mt-1">Redis Pub/Sub</span>
            <span className="text-xs text-white/90 font-light tracking-wide block mt-1">Node.js Engine</span>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl hover:bg-white/[0.04] transition-colors duration-500">
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#e11d48] font-mono block mb-3">Core Feature</span>
            <span className="text-sm text-white font-light tracking-wide block">Strict Idempotency</span>
            <p className="text-[10px] text-white/40 mt-3 leading-relaxed">Guaranteed message delivery order and deduplication across all active client sockets.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT: LEADERBOARD DISCOVER BOX (RIGHT)
// ============================================================================
const LeaderboardDiscoverBox = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!boxRef.current || !contentRef.current) return;
    const contentElements = contentRef.current.children;

    if (isOpen) {
      gsap.fromTo(boxRef.current, 
        { display: 'flex', clipPath: 'circle(0% at 70% 50%)', opacity: 0, filter: 'blur(20px)' },
        { clipPath: 'circle(150% at 70% 50%)', opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: 'expo.out' }
      );
      gsap.fromTo(contentElements,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'expo.out', delay: 0.3 }
      );
    } else {
      gsap.to(contentElements, { y: -20, opacity: 0, duration: 0.4, ease: 'power2.in' });
      gsap.to(boxRef.current, {
        clipPath: 'circle(0% at 70% 50%)', opacity: 0, filter: 'blur(20px)', duration: 0.8, ease: 'power3.inOut', delay: 0.2,
        onComplete: () => {
          if (boxRef.current) boxRef.current.style.display = 'none';
        }
      });
    }
  }, [isOpen]);

  return (
    <div 
      ref={boxRef} 
      style={{ display: 'none' }}
      className="absolute right-16 top-1/2 -translate-y-1/2 w-[45vw] max-w-2xl bg-[#050505]/70 backdrop-blur-3xl border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),_0_30px_100px_rgba(56,189,248,0.15)] p-16 rounded-3xl flex-col z-40"
    >
      <div ref={contentRef} className="flex flex-col h-full w-full relative">
        {/* Header & Close */}
        <div className="flex justify-between items-start mb-12 w-full">
          <div>
            <span className="text-[9px] uppercase tracking-[0.4em] text-[#38bdf8] font-mono">
              Module 04 // Ranking
            </span>
            <h2 className="text-5xl md:text-6xl font-light mt-4 text-white tracking-tight">
              Leaderboard
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="w-12 h-12 flex items-center justify-center group cursor-none hover:bg-white/[0.03] rounded-full transition-colors duration-500"
          >
            <div className="w-5 h-[1px] bg-white rotate-45 absolute group-hover:rotate-135 transition-transform duration-500" />
            <div className="w-5 h-[1px] bg-white -rotate-45 absolute group-hover:-rotate-135 transition-transform duration-500" />
          </button>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-gradient-to-l from-white/10 to-transparent mb-12" />

        {/* Synopsis */}
        <h3 className="text-[10px] tracking-[0.25em] text-white/50 uppercase font-mono mb-6">
          Architectural Synopsis
        </h3>
        <p className="text-sm md:text-base text-gray-400 leading-relaxed font-light mb-12 max-w-xl">
          A high-throughput ranking engine capable of sorting thousands of dynamic mutations per second. It treats every score change as an immutable event, allowing perfect chronological reconstruction of the arena.
        </p>
        
        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-6 w-full">
          <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl hover:bg-white/[0.04] transition-colors duration-500">
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#38bdf8] font-mono block mb-3">Stack Environment</span>
            <span className="text-xs text-white/90 font-light tracking-wide block">PostgreSQL</span>
            <span className="text-xs text-white/90 font-light tracking-wide block mt-1">GraphQL Subscriptions</span>
            <span className="text-xs text-white/90 font-light tracking-wide block mt-1">Prisma ORM</span>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl hover:bg-white/[0.04] transition-colors duration-500">
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#38bdf8] font-mono block mb-3">Core Feature</span>
            <span className="text-sm text-white font-light tracking-wide block">Event Sourcing</span>
            <p className="text-[10px] text-white/40 mt-3 leading-relaxed">State is never mutated directly. Every change is an appended event, allowing infinite time-travel and strict audits.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT: THE ETHEREAL NETWORK
// ============================================================================
export const EtherealNetwork = ({ isActive }: { isActive: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgLineRef = useRef<SVGPathElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const rippleContainerRef = useRef<HTMLDivElement>(null);
  
  const [activeProject, setActiveProject] = useState<'exiles' | 'leaderboard' | null>(null);

  // 1. Scene Mount/Unmount (The Boot Sequence)
  useEffect(() => {
    if (!containerRef.current) return;
    
    if (isActive) {
      // Reveal the void
      gsap.fromTo(containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 2, ease: 'power2.out', display: 'flex' }
      );
      
      // Draw SVG
      if (svgLineRef.current) {
        const length = svgLineRef.current.getTotalLength();
        gsap.set(svgLineRef.current, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(svgLineRef.current, { strokeDashoffset: 0, duration: 3, ease: 'power3.inOut', delay: 1 });
      }
      
    } else {
      gsap.to(containerRef.current, {
        opacity: 0, duration: 1, ease: 'power2.inOut',
        onComplete: () => {
          if (containerRef.current) containerRef.current.style.display = 'none';
          setActiveProject(null);
        }
      });
    }
  }, [isActive]);

  // 2. Spotlight & Click Ripple Logic
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!spotlightRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    let color = 'rgba(255,255,255,0.06)';
    if (activeProject === 'exiles') color = 'rgba(225,29,72,0.12)';
    if (activeProject === 'leaderboard') color = 'rgba(56,189,248,0.12)';

    spotlightRef.current.style.background = `radial-gradient(1000px circle at ${x}px ${y}px, ${color}, transparent 50%)`;
  };

  const handleGlobalClick = (e: React.MouseEvent) => {
    if (!rippleContainerRef.current) return;
    
    // Create ripple element
    const ripple = document.createElement('div');
    ripple.className = 'absolute rounded-full border border-white/20 pointer-events-none';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    ripple.style.transform = 'translate(-50%, -50%) scale(0)';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    rippleContainerRef.current.appendChild(ripple);

    gsap.to(ripple, {
      scale: 5,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      onComplete: () => {
        ripple.remove();
      }
    });
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onClick={handleGlobalClick}
      style={{ display: 'none' }}
      // ADDED pointer-events-auto so it intercepts clicks
      className="absolute inset-0 w-full h-full z-20 items-center justify-center overflow-hidden pointer-events-auto"
    >
      {/* Click Ripple Container */}
      <div ref={rippleContainerRef} className="absolute inset-0 pointer-events-none z-50 overflow-hidden" />

      {/* The Spotlight Overlay */}
      <div 
        ref={spotlightRef}
        className="absolute inset-0 pointer-events-none transition-all duration-1000 mix-blend-screen"
        style={{ background: 'radial-gradient(1000px circle at 50% 50%, rgba(255,255,255,0.03), transparent 50%)' }}
      />

      {/* THE FIBER-OPTIC BACKBONE (Base State) */}
      <div 
        className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none transition-all duration-1000"
        style={{ 
          opacity: activeProject ? 0.15 : 1, // Dims when a box is open
          transform: activeProject === 'exiles' ? 'translateX(5%)' : activeProject === 'leaderboard' ? 'translateX(-5%)' : 'translateX(0)' 
        }}
      >
        {/* The SVG Line */}
        <div className="absolute w-[50%] max-w-3xl h-[2px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center">
          <svg className="w-full h-[100px] overflow-visible pointer-events-none" viewBox="0 0 1000 100" preserveAspectRatio="none">
            <path 
              ref={svgLineRef}
              d="M 50 50 L 950 50"
              fill="none" 
              stroke="rgba(255,255,255,0.15)" 
              strokeWidth="1.5"
            />
            {/* Ambient Line Glow */}
            <path 
              d="M 50 50 L 950 50"
              fill="none" 
              stroke="rgba(255,255,255,0.05)" 
              strokeWidth="10"
              style={{ filter: 'blur(4px)' }}
            />
          </svg>
        </div>

        {/* Central Core (The Router) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center">
          <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse" />
          <div className="absolute inset-0 border border-white/10 rounded-full animate-[spin_6s_linear_infinite]" />
          <div className="absolute inset-[-10px] border border-white/5 rounded-full animate-[spin_8s_linear_infinite_reverse]" />
        </div>
      </div>

      {/* THE INTERACTIVE NODES */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
        <div className="relative w-[50%] max-w-3xl h-full pointer-events-none">
          
          {/* LEFT NODE: EXILES */}
          <button 
            onMouseEnter={() => SoundEngine.playHover()}
            onClick={(e) => { e.stopPropagation(); SoundEngine.playClick(); setActiveProject('exiles'); }}
            // Shifted towards center: using left-[5%] instead of left-0
            className="absolute left-[5%] top-1/2 -translate-y-1/2 group cursor-none pointer-events-auto transition-all duration-700"
            style={{ opacity: activeProject === 'leaderboard' ? 0 : 1 }} 
          >
            {/* Magnetic Hover Zone */}
            <div className="relative w-32 h-32 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 ease-out">
              <div className="absolute inset-4 border border-[#e11d48]/30 rounded-full scale-100 group-hover:scale-150 group-hover:opacity-0 transition-all duration-1000 ease-out" />
              <div className="absolute inset-8 border border-white/10 rounded-full group-hover:border-[#e11d48]/50 transition-colors duration-500" />
              <div className="w-3 h-3 bg-[#e11d48]/80 rounded-full shadow-[0_0_20px_rgba(225,29,72,0.8)] group-hover:shadow-[0_0_40px_rgba(225,29,72,1)] transition-all duration-500" />
            </div>
            
            <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span className="w-[1px] h-8 bg-gradient-to-b from-[#e11d48]/50 to-transparent mb-3" />
              <span className="text-[9px] uppercase tracking-[0.4em] font-mono text-[#e11d48] whitespace-nowrap">Access Node // 03</span>
            </div>
          </button>

          {/* RIGHT NODE: LEADERBOARD */}
          <button 
            onMouseEnter={() => SoundEngine.playHover()}
            onClick={(e) => { e.stopPropagation(); SoundEngine.playClick(); setActiveProject('leaderboard'); }}
            // Shifted towards center: using right-[5%] instead of right-0 translate-x-1/2
            className="absolute right-[5%] top-1/2 -translate-y-1/2 group cursor-none pointer-events-auto transition-all duration-700"
            style={{ opacity: activeProject === 'exiles' ? 0 : 1 }}
          >
            {/* Magnetic Hover Zone */}
            <div className="relative w-32 h-32 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 ease-out">
              <div className="absolute inset-4 border border-[#38bdf8]/30 rotate-45 scale-100 group-hover:scale-150 group-hover:opacity-0 transition-all duration-1000 ease-out" />
              <div className="absolute inset-8 border border-white/10 rotate-45 group-hover:border-[#38bdf8]/50 group-hover:rotate-90 transition-all duration-700" />
              <div className="w-3 h-3 bg-[#38bdf8]/80 rotate-45 shadow-[0_0_20px_rgba(56,189,248,0.8)] group-hover:shadow-[0_0_40px_rgba(56,189,248,1)] transition-all duration-500" />
            </div>
            
            <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span className="w-[1px] h-8 bg-gradient-to-b from-[#38bdf8]/50 to-transparent mb-3" />
              <span className="text-[9px] uppercase tracking-[0.4em] font-mono text-[#38bdf8] whitespace-nowrap">Access Node // 04</span>
            </div>
          </button>

        </div>
      </div>

      {/* THE DISCOVER BOXES (Morphed State) */}
      <ExilesDiscoverBox isOpen={activeProject === 'exiles'} onClose={() => setActiveProject(null)} />
      <LeaderboardDiscoverBox isOpen={activeProject === 'leaderboard'} onClose={() => setActiveProject(null)} />
      
    </div>
  );
};
