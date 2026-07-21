
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { SoundEngine } from '@/utils/SoundEngine';
import { GlassCard } from './GlassCard';
import { TrueFocus } from './TrueFocus';

type ProjectType = 'exiles' | 'leaderboard' | null;

interface TransformBase {
  x: number;
  y: number;
  z: number;
  rotateY: number;
  scale: number;
  opacity: number;
}

const EXILES_BASE: TransformBase = { x: -180, y: 0, z: -100, rotateY: 15, scale: 0.9, opacity: 0.7 };
const LEADERBOARD_BASE: TransformBase = { x: 180, y: 0, z: -100, rotateY: -15, scale: 0.9, opacity: 0.7 };

interface ProjectPaneProps {
  type: 'exiles' | 'leaderboard';
  isActive: boolean;
  onActivate: () => void;
  onClose: () => void;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  baseTransform: TransformBase;
  mouseRotX: number;
  mouseRotY: number;
  hasActiveProject: boolean;
}

const ProjectPane = ({ type, isActive, onActivate, onClose, onHover, onLeave, hasActiveProject }: ProjectPaneProps) => {
  const isExiles = type === 'exiles';
  const paneRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Unfurl Animation
  useEffect(() => {
    if (!surfaceRef.current || !contentRef.current || !textRef.current) return;

    if (isActive) {
      // Hide the default text
      gsap.to(textRef.current, { opacity: 0, duration: 0.4, ease: 'power2.out' });

      // Unfurl the glass surface - First widen, then heighten
      gsap.to(surfaceRef.current, {
        width: 440,
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
        height: 460, // Return to base card height
        duration: 0.5,
        ease: 'power3.in',
        delay: 0.2
      });
      gsap.to(surfaceRef.current, {
        width: 340, // Return to base card width
        duration: 0.5,
        ease: 'power3.inOut',
        delay: 0.6
      });

      // Restore text
      gsap.to(textRef.current, { opacity: 1, duration: 0.8, delay: 1, ease: 'power2.out' });
    }
  }, [isActive]);

  return (
    <div
      ref={paneRef}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={(e) => { e.stopPropagation(); if(!isActive) { SoundEngine.playClick(); onActivate(); } }}
      className={`absolute cursor-pointer flex items-center justify-center ${isActive ? 'pointer-events-auto cursor-default' : 'pointer-events-auto'} ${hasActiveProject && !isActive ? 'pointer-events-none' : ''}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div
        ref={surfaceRef}
        className="overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-700"
        style={{ width: 340, height: 460 }}
      >
        <GlassCard className="w-full h-full bg-[#050505]/70 border-white/10 backdrop-blur-3xl rounded-2xl relative">

          {/* Node Marker Text (Base State) */}
          <div
            ref={textRef}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          >
              <TrueFocus text={isExiles ? 'EXILES' : 'LEADERBOARD'} className="text-3xl font-light tracking-[0.25em] text-white/80 uppercase" splitBy="letter" animationSpeed={1.5} />
          </div>

          {/* Detailed Content (Active State) */}
          <div ref={contentRef} className="absolute inset-0 p-10 flex flex-col pointer-events-auto opacity-0" style={{ pointerEvents: isActive ? 'auto' : 'none' }}>
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
}

export const EtherealNetwork = ({ isActive }: { isActive: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeProject, setActiveProject] = useState<ProjectType>(null);
  const [hoveredProject, setHoveredProject] = useState<ProjectType>(null);

  const [mouseRotX, setMouseRotX] = useState(0);
  const [mouseRotY, setMouseRotY] = useState(0);

  const exilesRef = useRef<HTMLDivElement>(null);
  const leaderboardRef = useRef<HTMLDivElement>(null);

  // Mount/Unmount
  useEffect(() => {
    if (!containerRef.current || !exilesRef.current || !leaderboardRef.current) return;
    
    if (isActive) {
      gsap.to(containerRef.current, { opacity: 1, duration: 1.5, ease: 'power2.out', display: 'flex' });

      gsap.fromTo(exilesRef.current,
        { ...EXILES_BASE, y: 100, opacity: 0 },
        { ...EXILES_BASE, duration: 1.5, ease: 'power3.out', delay: 0.2 }
      );
      
      gsap.fromTo(leaderboardRef.current,
        { ...LEADERBOARD_BASE, y: 100, opacity: 0 },
        { ...LEADERBOARD_BASE, duration: 1.5, ease: 'power3.out', delay: 0.3 }
      );
    } else {
      gsap.to(containerRef.current, {
        opacity: 0, duration: 0.8, ease: 'power2.inOut',
        onComplete: () => {
          if (containerRef.current) containerRef.current.style.display = 'none';
          setActiveProject(null);
          setHoveredProject(null);
        }
      });
    }
  }, [isActive]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isActive || activeProject) return;
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    setMouseRotX(y * -15);
    setMouseRotY(x * 15);
  };

  // Parallax & Hover orchestrator
  useEffect(() => {
     if (activeProject || !exilesRef.current || !leaderboardRef.current) return;

     if (hoveredProject === 'exiles') {
        gsap.to(exilesRef.current, { rotateX: mouseRotX, rotateY: EXILES_BASE.rotateY + mouseRotY, z: 50, scale: 1, opacity: 1, duration: 0.6, ease: 'power3.out' });
        gsap.to(leaderboardRef.current, { rotateX: mouseRotX, rotateY: LEADERBOARD_BASE.rotateY + mouseRotY, z: -200, scale: 0.8, opacity: 0.3, filter: 'blur(8px)', duration: 0.6, ease: 'power3.out' });
     } else if (hoveredProject === 'leaderboard') {
        gsap.to(leaderboardRef.current, { rotateX: mouseRotX, rotateY: LEADERBOARD_BASE.rotateY + mouseRotY, z: 50, scale: 1, opacity: 1, duration: 0.6, ease: 'power3.out' });
        gsap.to(exilesRef.current, { rotateX: mouseRotX, rotateY: EXILES_BASE.rotateY + mouseRotY, z: -200, scale: 0.8, opacity: 0.3, filter: 'blur(8px)', duration: 0.6, ease: 'power3.out' });
     } else {
        gsap.to(exilesRef.current, { rotateX: mouseRotX, rotateY: EXILES_BASE.rotateY + mouseRotY, x: EXILES_BASE.x, y: EXILES_BASE.y, z: EXILES_BASE.z, scale: EXILES_BASE.scale, opacity: EXILES_BASE.opacity, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out' });
        gsap.to(leaderboardRef.current, { rotateX: mouseRotX, rotateY: LEADERBOARD_BASE.rotateY + mouseRotY, x: LEADERBOARD_BASE.x, y: LEADERBOARD_BASE.y, z: LEADERBOARD_BASE.z, scale: LEADERBOARD_BASE.scale, opacity: LEADERBOARD_BASE.opacity, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out' });
     }
  }, [mouseRotX, mouseRotY, hoveredProject, activeProject]);

  // Click orchestrator
  useEffect(() => {
    if (!exilesRef.current || !leaderboardRef.current) return;

    if (activeProject === 'exiles') {
      gsap.to(exilesRef.current, { x: 0, y: 0, z: 200, rotateX: 0, rotateY: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'expo.inOut' });
      gsap.to(leaderboardRef.current, { x: 300, z: -500, opacity: 0, filter: 'blur(20px)', duration: 1, ease: 'expo.inOut' });
    } else if (activeProject === 'leaderboard') {
      gsap.to(leaderboardRef.current, { x: 0, y: 0, z: 200, rotateX: 0, rotateY: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'expo.inOut' });
      gsap.to(exilesRef.current, { x: -300, z: -500, opacity: 0, filter: 'blur(20px)', duration: 1, ease: 'expo.inOut' });
    } else if (isActive) {
      // return to base
      gsap.to(exilesRef.current, { ...EXILES_BASE, filter: 'blur(0px)', duration: 1, ease: 'expo.inOut' });
      gsap.to(leaderboardRef.current, { ...LEADERBOARD_BASE, filter: 'blur(0px)', duration: 1, ease: 'expo.inOut' });
    }
  }, [activeProject, isActive]);


  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onClick={() => activeProject && setActiveProject(null)}
      style={{ display: 'none', perspective: '1200px' }}
      className={`absolute inset-0 w-full h-full z-20 items-center justify-center overflow-hidden ${isActive ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      <div className={`absolute inset-0 bg-[#020202] transition-opacity duration-1000 pointer-events-none ${activeProject ? 'opacity-90' : 'opacity-0'}`} />

      <div className="relative w-full max-w-5xl h-[600px] flex items-center justify-center transform-style-3d">

        {/* EXILES PANE */}
        <div ref={exilesRef} className="absolute" style={{ transformStyle: 'preserve-3d' }}>
           <ProjectPane
             type="exiles"
             isActive={activeProject === 'exiles'}
             hasActiveProject={activeProject !== null}
             onActivate={() => setActiveProject('exiles')}
             onClose={() => setActiveProject(null)}
             isHovered={hoveredProject === 'exiles'}
             onHover={() => { SoundEngine.playHover(); setHoveredProject('exiles'); }}
             onLeave={() => setHoveredProject(null)}
             baseTransform={EXILES_BASE}
             mouseRotX={mouseRotX}
             mouseRotY={mouseRotY}
           />
        </div>

        {/* LEADERBOARD PANE */}
        <div ref={leaderboardRef} className="absolute" style={{ transformStyle: 'preserve-3d' }}>
           <ProjectPane
             type="leaderboard"
             isActive={activeProject === 'leaderboard'}
             hasActiveProject={activeProject !== null}
             onActivate={() => setActiveProject('leaderboard')}
             onClose={() => setActiveProject(null)}
             isHovered={hoveredProject === 'leaderboard'}
             onHover={() => { SoundEngine.playHover(); setHoveredProject('leaderboard'); }}
             onLeave={() => setHoveredProject(null)}
             baseTransform={LEADERBOARD_BASE}
             mouseRotX={mouseRotX}
             mouseRotY={mouseRotY}
           />
        </div>

      </div>
    </div>
  );
};
