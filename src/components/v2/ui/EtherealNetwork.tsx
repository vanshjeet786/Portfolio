
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { SoundEngine } from '@/utils/SoundEngine';
import { TrueFocus } from './TrueFocus';
import { GlassCard } from './GlassCard';

type ProjectType = 'exiles' | 'leaderboard' | null;

interface ProjectNodeProps {
  type: 'exiles' | 'leaderboard';
  isActive: boolean;
  onActivate: () => void;
  onClose: () => void;
}

const ProjectNode = ({ type, isActive, onActivate, onClose }: ProjectNodeProps) => {
  const isExiles = type === 'exiles';
  const nodeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Unfurl Animation
  useEffect(() => {
    if (!surfaceRef.current || !contentRef.current || !textRef.current || !glowRef.current) return;

    if (isActive) {
      // Hide the default text and glow
      gsap.to(textRef.current, { opacity: 0, duration: 0.4, ease: 'power2.out' });
      gsap.to(glowRef.current, { opacity: 0, scale: 0.5, duration: 0.4 });

      // Unfurl the glass surface - First widen, then heighten
      gsap.to(surfaceRef.current, {
        width: 440,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out',
      });
      gsap.to(surfaceRef.current, {
        height: 520,
        duration: 0.8,
        ease: 'expo.out',
        delay: 0.3
      });

      // Stagger content in
      gsap.fromTo(Array.from(contentRef.current.children),
        { y: 30, opacity: 0, filter: 'blur(10px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, stagger: 0.08, ease: 'power3.out', delay: 0.7 }
      );
    } else {
      // Fade content out fast
      gsap.to(Array.from(contentRef.current.children), { y: -20, opacity: 0, filter: 'blur(5px)', duration: 0.3, ease: 'power2.in' });

      // Roll up the surface - Height then width
      gsap.to(surfaceRef.current, {
        height: 2,
        duration: 0.5,
        ease: 'power3.in',
        delay: 0.2
      });
      gsap.to(surfaceRef.current, {
        width: 140,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.inOut',
        delay: 0.6
      });

      // Restore text and glow
      gsap.to(textRef.current, { opacity: 1, duration: 0.8, delay: 1, ease: 'power2.out' });
      gsap.to(glowRef.current, { clearProps: 'all', duration: 1, delay: 1 });
    }
  }, [isActive]);

  return (
    <div className="relative flex flex-col items-center justify-center group" ref={nodeRef}>

      {/* Node Ambient Glow (Blueprint Style) */}
      <div
        ref={glowRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full blur-[100px] pointer-events-none opacity-0 transition-opacity duration-1000 group-hover:opacity-[0.15]"
      />

      {/* Node Marker Text (Blueprint Style) */}
      <div
        ref={textRef}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ${isActive ? 'pointer-events-none scale-90' : 'cursor-pointer scale-100 group-hover:scale-105'}`}
        onClick={(e) => { e.stopPropagation(); SoundEngine.playClick(); onActivate(); }}
        onMouseEnter={() => { SoundEngine.playHover(); }}
      >
        <div className="flex flex-col items-center">
            {/* Minimalist marker dot */}
            <div className="w-1.5 h-1.5 bg-white/40 rounded-full mb-6 group-hover:bg-white/80 transition-colors duration-500 shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
            <span className="text-[10px] uppercase tracking-[0.5em] text-white/30 font-mono block mb-3 group-hover:text-white/60 transition-colors duration-500">Module {isExiles ? '03' : '04'}</span>
            <TrueFocus text={isExiles ? 'EXILES' : 'LEADERBOARD'} className="text-3xl font-light tracking-[0.25em] text-white/80" splitBy="letter" animationSpeed={1.5} />
        </div>
      </div>

      {/* The Unfurling Glass Surface */}
      <div
        ref={surfaceRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden pointer-events-auto shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        style={{ width: 140, height: 2, opacity: 0 }}
      >
        <GlassCard className="w-full h-full bg-[#050505]/70 border-white/5 backdrop-blur-3xl rounded-2xl">
          <div ref={contentRef} className="absolute inset-0 p-10 flex flex-col pointer-events-auto">
            {/* Header & Close */}
            <div className="flex justify-between items-start mb-8 w-full opacity-0">
              <div>
                <span className="text-[10px] uppercase tracking-[0.5em] text-white/40 font-mono">
                  Module {isExiles ? '03' : '04'} // {isExiles ? 'Realtime' : 'Ranking'}
                </span>
                <h2 className="text-4xl font-light mt-3 text-white/95 tracking-widest uppercase">
                  {isExiles ? 'Exiles' : 'Leaderboard'}
                </h2>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="w-12 h-12 flex items-center justify-center group/btn hover:bg-white/10 rounded-full transition-colors duration-500 border border-transparent hover:border-white/10"
              >
                <div className="w-5 h-[1px] bg-white/80 rotate-45 absolute group-hover/btn:rotate-135 transition-transform duration-500" />
                <div className="w-5 h-[1px] bg-white/80 -rotate-45 absolute group-hover/btn:-rotate-135 transition-transform duration-500" />
              </button>
            </div>

            <div className="w-full h-[1px] bg-gradient-to-r from-white/20 via-white/5 to-transparent mb-8 opacity-0" />

            {/* Synopsis */}
            <h3 className="text-[10px] tracking-[0.3em] text-white/30 uppercase font-mono mb-4 opacity-0">
              Architectural Synopsis
            </h3>
            <p className="text-[15px] text-white/60 leading-relaxed font-light mb-10 opacity-0 tracking-wide">
              {isExiles
                ? 'A purely chronological, highly-available messaging fabric. Built to ensure absolute idempotency across distributed nodes. Distance is eliminated. Before words, there is only the persistent signal.'
                : 'A high-throughput ranking engine capable of sorting thousands of dynamic mutations per second. It treats every score change as an immutable event, allowing perfect chronological reconstruction of the arena.'}
            </p>

            {/* Specs Grid */}
            <div className="grid grid-cols-1 gap-4 w-full mt-auto opacity-0">
              <div className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-xl transition-colors hover:bg-white/[0.04]">
                <div className="flex items-center gap-4 mb-3">
                    <div className="w-1 h-1 bg-white/40 rounded-full" />
                    <span className="text-[10px] uppercase tracking-[0.4em] text-white/50 font-mono">Stack Environment</span>
                </div>
                <div className="flex gap-4">
                    <span className="text-xs text-white/70 font-light tracking-wide py-1 px-3 bg-white/5 rounded-full">{isExiles ? 'WebSockets' : 'PostgreSQL'}</span>
                    <span className="text-xs text-white/70 font-light tracking-wide py-1 px-3 bg-white/5 rounded-full">{isExiles ? 'Redis Pub/Sub' : 'GraphQL'}</span>
                    <span className="text-xs text-white/70 font-light tracking-wide py-1 px-3 bg-white/5 rounded-full">{isExiles ? 'Node.js' : 'Prisma'}</span>
                </div>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-xl transition-colors hover:bg-white/[0.04]">
                <div className="flex items-center gap-4 mb-3">
                    <div className="w-1 h-1 bg-white/40 rounded-full" />
                    <span className="text-[10px] uppercase tracking-[0.4em] text-white/50 font-mono">Core Feature</span>
                </div>
                <span className="text-sm text-white/90 font-light tracking-wide block mb-1">{isExiles ? 'Strict Idempotency' : 'Event Sourcing'}</span>
                <p className="text-[11px] text-white/40 leading-relaxed">
                  {isExiles
                    ? 'Guaranteed message delivery order and deduplication across all nodes.'
                    : 'State is never mutated directly. Every change is an appended event.'}
                </p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export const EtherealNetwork = ({ isActive }: { isActive: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState<ProjectType>(null);

  // Mount/Unmount base structure
  useEffect(() => {
    if (!containerRef.current || !lineRef.current) return;
    
    if (isActive) {
      gsap.to(containerRef.current, { opacity: 1, duration: 2, ease: 'power2.out', display: 'flex' });
      
      // Draw the blueprint connecting line
      gsap.fromTo(lineRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 2, ease: 'expo.inOut', delay: 0.5 }
      );
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

  return (
    <div 
      ref={containerRef}
      style={{ display: 'none' }}
      className={`absolute inset-0 w-full h-full z-20 items-center justify-center overflow-hidden ${isActive ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      {/* Dimmer overlay when a project is open */}
      <div 
        className={`absolute inset-0 bg-[#020202] transition-opacity duration-1000 pointer-events-none ${activeProject ? 'opacity-90' : 'opacity-0'}`}
      />

      {/* Center Layout Container */}
      <div className="relative w-full max-w-6xl h-full flex items-center justify-between px-24">

        {/* The Delicate Slate Connecting Line */}
        <div className="absolute left-[20%] right-[20%] h-[1px] top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
            <div ref={lineRef} className="w-full h-full bg-white/10 origin-center" />
            {/* Subtle center geometric marker */}
            <div className={`absolute w-1.5 h-1.5 border border-white/30 rotate-45 transition-opacity duration-1000 ${activeProject ? 'opacity-0' : 'opacity-100'}`} />
        </div>

        {/* Nodes */}
        <div className={`relative z-20 w-1/3 transition-all duration-1000 ease-in-out ${activeProject === 'leaderboard' ? '-translate-x-20 opacity-0 blur-md pointer-events-none' : activeProject === 'exiles' ? 'translate-x-[50%] scale-110' : 'translate-x-0 opacity-100 scale-100'}`}>
            <ProjectNode
                type="exiles"
                isActive={activeProject === 'exiles'}
                onActivate={() => setActiveProject('exiles')}
                onClose={() => setActiveProject(null)}
            />
        </div>

        <div className={`relative z-20 w-1/3 transition-all duration-1000 ease-in-out ${activeProject === 'exiles' ? 'translate-x-20 opacity-0 blur-md pointer-events-none' : activeProject === 'leaderboard' ? '-translate-x-[50%] scale-110' : 'translate-x-0 opacity-100 scale-100'}`}>
            <ProjectNode
                type="leaderboard"
                isActive={activeProject === 'leaderboard'}
                onActivate={() => setActiveProject('leaderboard')}
                onClose={() => setActiveProject(null)}
            />
        </div>

      </div>
    </div>
  );
};
