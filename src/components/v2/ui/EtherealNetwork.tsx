
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { SoundEngine } from '@/utils/SoundEngine';
import { useStore } from '@/stores/useStore';
import { GlassCard } from './GlassCard';
import { TrueFocus } from './TrueFocus';
import { GlassCardOrbitalCore } from './GlassCardOrbitalCore';

type ProjectType = 'exiles' | 'leaderboard' | null;

interface TransformBase {
  x: number;
  y: number;
  z: number;
  rotateX?: number;
  rotateY: number;
  scale: number;
  opacity: number;
}

const EXILES_BASE: TransformBase = { x: 0, y: 0, z: 0, rotateX: 4, rotateY: -6, scale: 0.82, opacity: 0.95 };
const LEADERBOARD_BASE: TransformBase = { x: 0, y: 0, z: 0, rotateX: 4, rotateY: -6, scale: 0.82, opacity: 0.95 };

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

const PROJECT_PROOF = {
  exiles: {
    outcome: 'Realtime room presence, ordered delivery, and resilient reconnects for distributed chat surfaces.',
    role: 'Realtime architecture, idempotent message flow, delivery guarantees',
    stack: ['WebSockets', 'Redis Pub/Sub', 'Node.js'],
    signal: 'Built for low-latency conversations without duplicate or out-of-order events.',
  },
  leaderboard: {
    outcome: 'High-throughput score ingestion with reconstructable ranking history.',
    role: 'Ranking engine design, event stream modeling, data contracts',
    stack: ['PostgreSQL', 'GraphQL', 'Prisma'],
    signal: 'Optimized for clear ranking state under concurrent score mutations.',
  },
};

const ProjectPane = ({ type, isActive, onActivate, onClose, isHovered, onHover, onLeave, hasActiveProject }: ProjectPaneProps) => {
  const isExiles = type === 'exiles';
  const proof = PROJECT_PROOF[type];
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
        width: typeof window !== 'undefined' && window.innerWidth < 768 ? window.innerWidth * 0.95 : 800,
        duration: 0.6,
        ease: 'power3.out',
      });
      gsap.to(surfaceRef.current, {
        height: typeof window !== 'undefined' && window.innerHeight < 700 ? window.innerHeight * 0.85 : 600,
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
      onClick={(e) => { 
        e.stopPropagation(); 
        if (!isActive && !hasActiveProject) { 
          SoundEngine.playClick(); 
          onActivate(); 
        } 
      }}
      className={`group absolute cursor-pointer flex items-center justify-center ${isActive ? 'pointer-events-auto cursor-default' : 'pointer-events-auto'} ${hasActiveProject && !isActive ? 'pointer-events-none' : ''}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div
        ref={surfaceRef}
        className="overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-700"
        style={{ width: 340, height: 460 }}
      >
        <GlassCard className={`w-full h-full border-white/10 rounded-2xl relative transition-all duration-1000 ${isActive ? 'bg-[#050505]/95 backdrop-blur-[64px] shadow-[0_30px_100px_rgba(0,0,0,0.8)]' : 'bg-[#050505]/70 backdrop-blur-3xl'}`}>

          {/* 3D Orbital Core Engine Animation */}
          <GlassCardOrbitalCore type={type} isHovered={isHovered} isActive={isActive} />

          {/* Node Marker Text (Base State) */}
          <div
            ref={textRef}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          >
              <TrueFocus text={isExiles ? 'EXILES' : 'LEADERBOARD'} className="text-3xl font-light tracking-[0.25em] text-white/80 uppercase" splitBy="word" animationSpeed={1.5} />
          
          </div>

          {/* Detailed Content (Active State) */}
          <div ref={contentRef} className={`absolute inset-0 p-10 flex flex-col overflow-y-auto custom-scrollbar ${isActive ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`} style={{ transition: 'opacity 0.5s ease', transitionDelay: isActive ? '0.3s' : '0s' }}>
            {/* Header & Close */}
            <div className={`flex justify-between items-start mb-8 w-full transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
              <div>
                <span className="text-[10px] uppercase tracking-[0.5em] text-white/40 font-mono">
                  Module {isExiles ? '03' : '04'} // {isExiles ? 'Realtime' : 'Ranking'}
                </span>
                <h2 className="text-4xl font-light mt-3 text-white/95 tracking-widest uppercase">
                  {isExiles ? 'Exiles' : 'Leaderboard'}
                </h2>
              </div>
              <button
                type="button"
                onMouseEnter={() => SoundEngine.playHover()}
                onClick={(e) => { 
                  e.stopPropagation(); 
                  e.preventDefault();
                  SoundEngine.playClick(); 
                  onClose(); 
                  useStore.getState().setModalOpen(false);
                }}
                className="relative z-50 w-11 h-11 flex items-center justify-center border border-white/20 hover:border-white/50 hover:bg-white/10 rounded-full transition-all duration-300 cursor-pointer group/btn"
              >
                <div className="w-5 h-[1px] bg-white rotate-45 absolute group-hover/btn:rotate-135 transition-transform duration-500" />
                <div className="w-5 h-[1px] bg-white -rotate-45 absolute group-hover/btn:-rotate-135 transition-transform duration-500" />
              </button>
            </div>

            <div className="w-full h-[1px] bg-gradient-to-r from-white/20 via-white/5 to-transparent mb-8 opacity-0" />

            {/* Synopsis */}
            <h3 className="text-[10px] tracking-[0.3em] text-white/30 uppercase font-mono mb-4 opacity-0">
              Architectural Synopsis
            </h3>
            <p className="text-[15px] text-white/60 leading-relaxed font-light mb-10 opacity-0 tracking-wide">
              {isExiles
                ? 'Exiles is a highly-available, realtime messaging fabric built for strict idempotency and guaranteed delivery. It eliminates race conditions across distributed nodes by establishing a single source of chronological truth. The architecture ensures that no matter the latency or distance, the signal remains persistent and properly ordered.'
                : 'The Leaderboard module is a high-throughput ranking engine engineered to ingest and sort thousands of concurrent score mutations per second. Built on event-sourcing principles, it treats every change as an immutable record, providing near-instantaneous global rankings while maintaining perfect chronological reconstruction capabilities.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8 opacity-0">
              <div className="border border-white/[0.06] bg-white/[0.025] p-4 rounded-xl">
                <span className="block text-[9px] uppercase tracking-[0.35em] text-white/35 font-mono mb-2">Outcome</span>
                <p className="text-xs text-white/70 leading-relaxed">{proof.outcome}</p>
              </div>
              <div className="border border-white/[0.06] bg-white/[0.025] p-4 rounded-xl">
                <span className="block text-[9px] uppercase tracking-[0.35em] text-white/35 font-mono mb-2">My Role</span>
                <p className="text-xs text-white/70 leading-relaxed">{proof.role}</p>
              </div>
              <div className="border border-white/[0.06] bg-white/[0.025] p-4 rounded-xl">
                <span className="block text-[9px] uppercase tracking-[0.35em] text-white/35 font-mono mb-2">Signal</span>
                <p className="text-xs text-white/70 leading-relaxed">{proof.signal}</p>
              </div>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-1 gap-4 w-full mt-auto opacity-0">
              <div className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-xl transition-colors hover:bg-white/[0.04]">
                <div className="flex items-center gap-4 mb-3">
                    <div className="w-1 h-1 bg-white/40 rounded-full" />
                    <span className="text-[10px] uppercase tracking-[0.4em] text-white/50 font-mono">Stack Environment</span>
                </div>
                <div className="flex gap-4">
                    {proof.stack.map((item) => (
                      <span key={item} className="text-xs text-white/70 font-light tracking-wide py-1 px-3 bg-white/5 rounded-full">{item}</span>
                    ))}
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
  const setModalOpen = useStore((state) => state.setModalOpen);
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeProject, setActiveProject] = useState<ProjectType>(null);
  const [hoveredProject, setHoveredProject] = useState<ProjectType>(null);

  const [mouseRotX, setMouseRotX] = useState(0);
  const [mouseRotY, setMouseRotY] = useState(0);

  const exilesRef = useRef<HTMLDivElement>(null);
  const leaderboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setModalOpen(activeProject !== null);
  }, [activeProject, setModalOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveProject(null);
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

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
          setModalOpen(false);
        }
      });
    }
  }, [isActive, setModalOpen]);

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
      gsap.to(exilesRef.current, { x: 220, y: 110, z: 200, rotateX: 0, rotateY: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'expo.inOut' });
      gsap.to(leaderboardRef.current, { x: 400, z: -500, opacity: 0, filter: 'blur(20px)', duration: 1, ease: 'expo.inOut' });
    } else if (activeProject === 'leaderboard') {
      gsap.to(leaderboardRef.current, { x: -160, y: 110, z: 200, rotateX: 0, rotateY: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'expo.inOut' });
      gsap.to(exilesRef.current, { x: -400, z: -500, opacity: 0, filter: 'blur(20px)', duration: 1, ease: 'expo.inOut' });
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
      className={`absolute inset-0 w-full h-full z-20 items-start justify-start overflow-hidden ${isActive ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      <div className={`absolute inset-0 bg-[#020202] transition-opacity duration-1000 pointer-events-none ${activeProject ? 'opacity-90' : 'opacity-0'}`} />

      <div className="relative w-full h-full flex items-start justify-start p-6 md:p-12 transform-style-3d">
        <div className="absolute top-6 left-6 md:left-12 text-left pointer-events-none z-10">
          <div className="text-[10px] uppercase tracking-[0.45em] text-[#aa9e6d] font-lato">Mini Projects</div>
        </div>

        {/* EXILES PANE - TOP LEFT */}
        <div ref={exilesRef} className="absolute left-6 md:left-12 top-20 md:top-24" style={{ transformStyle: 'preserve-3d' }}>
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

        {/* LEADERBOARD PANE - SIDE BY SIDE */}
        <div ref={leaderboardRef} className="absolute left-[360px] md:left-[410px] top-20 md:top-24" style={{ transformStyle: 'preserve-3d' }}>
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
