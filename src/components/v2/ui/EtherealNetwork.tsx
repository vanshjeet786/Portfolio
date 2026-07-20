
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { SoundEngine } from '@/utils/SoundEngine';
import { GlassCard } from './GlassCard';

type ProjectType = 'exiles' | 'leaderboard' | null;

interface ProjectContentProps {
  type: 'exiles' | 'leaderboard';
  isActive: boolean;
}

const ProjectContent = ({ type, isActive }: ProjectContentProps) => {
  const isExiles = type === 'exiles';

  return (
    <div className={`flex flex-col h-full w-full relative transition-opacity duration-700 ${isActive ? 'opacity-100 delay-300' : 'opacity-0'}`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-8 w-full">
        <div>
          <span className="text-[9px] uppercase tracking-[0.4em] text-white/50 font-mono">
            {isExiles ? 'Module 03 // Realtime' : 'Module 04 // Ranking'}
          </span>
          <h2 className="text-4xl md:text-5xl font-light mt-4 text-white/90 tracking-tight">
            {isExiles ? 'Exiles' : 'Leaderboard'}
          </h2>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-[1px] bg-gradient-to-r from-white/20 via-white/5 to-transparent mb-8" />

      {/* Synopsis */}
      <h3 className="text-[10px] tracking-[0.25em] text-white/40 uppercase font-mono mb-4">
        Architectural Synopsis
      </h3>
      <p className="text-sm text-white/60 leading-relaxed font-light mb-8 max-w-xl">
        {isExiles
          ? 'A purely chronological, highly-available messaging fabric. Built to ensure absolute idempotency across distributed nodes. Distance is eliminated. Before words, there is only the persistent signal.'
          : 'A high-throughput ranking engine capable of sorting thousands of dynamic mutations per second. It treats every score change as an immutable event, allowing perfect chronological reconstruction of the arena.'}
      </p>

      {/* Specs Grid */}
      <div className="grid grid-cols-2 gap-4 w-full mt-auto">
        <div className="bg-black/20 border border-white/5 p-5 rounded-xl">
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/50 font-mono block mb-3">Stack Environment</span>
          <span className="text-xs text-white/80 font-light tracking-wide block">{isExiles ? 'WebSockets (Socket.io)' : 'PostgreSQL'}</span>
          <span className="text-xs text-white/80 font-light tracking-wide block mt-1">{isExiles ? 'Redis Pub/Sub' : 'GraphQL Subscriptions'}</span>
          <span className="text-xs text-white/80 font-light tracking-wide block mt-1">{isExiles ? 'Node.js Engine' : 'Prisma ORM'}</span>
        </div>
        <div className="bg-black/20 border border-white/5 p-5 rounded-xl">
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/50 font-mono block mb-3">Core Feature</span>
          <span className="text-sm text-white/90 font-light tracking-wide block">{isExiles ? 'Strict Idempotency' : 'Event Sourcing'}</span>
          <p className="text-[10px] text-white/40 mt-2 leading-relaxed">
            {isExiles
              ? 'Guaranteed message delivery order and deduplication across all active client sockets.'
              : 'State is never mutated directly. Every change is an appended event, allowing infinite time-travel.'}
          </p>
        </div>
      </div>
    </div>
  );
};

const PERSPECTIVE = 1000;
const EXILES_BASE = { x: -150, y: 0, z: -100, rotateY: 15, scale: 0.9, opacity: 0.7 };
const LEADERBOARD_BASE = { x: 150, y: 0, z: -100, rotateY: -15, scale: 0.9, opacity: 0.7 };

export const EtherealNetwork = ({ isActive }: { isActive: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const exilesPaneRef = useRef<HTMLDivElement>(null);
  const leaderboardPaneRef = useRef<HTMLDivElement>(null);
  
  const [activeProject, setActiveProject] = useState<ProjectType>(null);
  const [hoveredProject, setHoveredProject] = useState<ProjectType>(null);

  // Constants for 3D positioning

  // Base states (Isometric view)

  // Mount / Unmount animation
  useEffect(() => {
    if (!containerRef.current || !exilesPaneRef.current || !leaderboardPaneRef.current) return;
    
    if (isActive) {
      gsap.to(containerRef.current, { opacity: 1, duration: 1.5, ease: 'power2.out', display: 'flex' });
      
      // Animate panes in
      gsap.fromTo(exilesPaneRef.current,
        { ...EXILES_BASE, y: 100, opacity: 0 },
        { ...EXILES_BASE, duration: 1.5, ease: 'power3.out', delay: 0.2 }
      );
      
      gsap.fromTo(leaderboardPaneRef.current,
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

  // Handle Parallax & Interactions
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isActive || activeProject) return; // Disable parallax when a project is open
    if (!containerRef.current || !exilesPaneRef.current || !leaderboardPaneRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // Apply subtle rotation based on mouse position
    const rotX = y * -10;
    const rotY = x * 10;

    gsap.to(exilesPaneRef.current, {
      rotateX: rotX,
      rotateY: EXILES_BASE.rotateY + rotY,
      duration: 1,
      ease: 'power2.out'
    });

    gsap.to(leaderboardPaneRef.current, {
      rotateX: rotX,
      rotateY: LEADERBOARD_BASE.rotateY + rotY,
      duration: 1,
      ease: 'power2.out'
    });
  };

  // Handle Hover Effects
  useEffect(() => {
    if (activeProject || !exilesPaneRef.current || !leaderboardPaneRef.current) return;

    if (hoveredProject === 'exiles') {
      gsap.to(exilesPaneRef.current, { z: 50, scale: 1, opacity: 1, duration: 0.6, ease: 'power3.out' });
      gsap.to(leaderboardPaneRef.current, { z: -200, scale: 0.8, opacity: 0.3, filter: 'blur(4px)', duration: 0.6, ease: 'power3.out' });
    } else if (hoveredProject === 'leaderboard') {
      gsap.to(leaderboardPaneRef.current, { z: 50, scale: 1, opacity: 1, duration: 0.6, ease: 'power3.out' });
      gsap.to(exilesPaneRef.current, { z: -200, scale: 0.8, opacity: 0.3, filter: 'blur(4px)', duration: 0.6, ease: 'power3.out' });
    } else {
      // Reset to base
      gsap.to(exilesPaneRef.current, { ...EXILES_BASE, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out' });
      gsap.to(leaderboardPaneRef.current, { ...LEADERBOARD_BASE, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out' });
    }
  }, [hoveredProject, activeProject]);

  // Handle Click / Active State
  useEffect(() => {
    if (!exilesPaneRef.current || !leaderboardPaneRef.current) return;

    if (activeProject === 'exiles') {
      gsap.to(exilesPaneRef.current, {
        x: 0, y: 0, z: 200, rotateX: 0, rotateY: 0, scale: 1.1, opacity: 1, filter: 'blur(0px)',
        duration: 1, ease: 'expo.inOut'
      });
      gsap.to(leaderboardPaneRef.current, {
        x: 200, z: -400, opacity: 0, filter: 'blur(20px)',
        duration: 1, ease: 'expo.inOut'
      });
    } else if (activeProject === 'leaderboard') {
      gsap.to(leaderboardPaneRef.current, {
        x: 0, y: 0, z: 200, rotateX: 0, rotateY: 0, scale: 1.1, opacity: 1, filter: 'blur(0px)',
        duration: 1, ease: 'expo.inOut'
      });
      gsap.to(exilesPaneRef.current, {
        x: -200, z: -400, opacity: 0, filter: 'blur(20px)',
        duration: 1, ease: 'expo.inOut'
      });
    } else {
      // Return to isometric view
      if (isActive) {
         gsap.to(exilesPaneRef.current, { ...EXILES_BASE, filter: 'blur(0px)', duration: 1, ease: 'expo.inOut' });
         gsap.to(leaderboardPaneRef.current, { ...LEADERBOARD_BASE, filter: 'blur(0px)', duration: 1, ease: 'expo.inOut' });
      }
    }
  }, [activeProject, isActive]);

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onClick={() => activeProject && setActiveProject(null)} // Click outside to close
      style={{ display: 'none', perspective: `${PERSPECTIVE}px` }}
      className={`absolute inset-0 w-full h-full z-20 items-center justify-center overflow-hidden ${isActive ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      {/* Background Dimmer when active */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-1000 pointer-events-none ${activeProject ? 'opacity-60' : 'opacity-0'}`}
      />

      {/* Container for 3D Transforms */}
      <div className="relative w-full max-w-5xl h-[600px] flex items-center justify-center transform-style-3d">

        {/* EXILES PANE */}
        <div
          ref={exilesPaneRef}
          onMouseEnter={() => { SoundEngine.playHover(); setHoveredProject('exiles'); }}
          onMouseLeave={() => setHoveredProject(null)}
          onClick={(e) => {
            e.stopPropagation();
            if (activeProject !== 'exiles') {
              SoundEngine.playClick();
              setActiveProject('exiles');
            }
          }}
          className={`absolute w-[400px] h-[500px] transition-all duration-300 ${activeProject === 'exiles' ? 'cursor-default' : 'cursor-pointer hover:shadow-2xl'} ${activeProject === 'leaderboard' ? 'pointer-events-none' : ''}`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <GlassCard className="w-full h-full p-10 flex flex-col items-center justify-center bg-[#0a0a0a]/40 border-white/10 group">
            {/* Minimalist Title (Visible when inactive) */}
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${activeProject === 'exiles' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
               <h2 className="text-4xl font-light tracking-widest text-white/50 group-hover:text-white/80 transition-colors duration-500 uppercase">Exiles</h2>
            </div>
            
            {/* Detailed Content (Visible when active) */}
            <ProjectContent type="exiles" isActive={activeProject === 'exiles'} />

            {/* Close Button */}
            {activeProject === 'exiles' && (
              <button
                onClick={(e) => { e.stopPropagation(); setActiveProject(null); }}
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center group/btn hover:bg-white/5 rounded-full transition-colors"
              >
                <div className="w-4 h-[1px] bg-white/70 rotate-45 absolute group-hover/btn:rotate-135 transition-transform duration-500" />
                <div className="w-4 h-[1px] bg-white/70 -rotate-45 absolute group-hover/btn:-rotate-135 transition-transform duration-500" />
              </button>
            )}
          </GlassCard>
        </div>

        {/* LEADERBOARD PANE */}
        <div
          ref={leaderboardPaneRef}
          onMouseEnter={() => { SoundEngine.playHover(); setHoveredProject('leaderboard'); }}
          onMouseLeave={() => setHoveredProject(null)}
          onClick={(e) => {
            e.stopPropagation();
            if (activeProject !== 'leaderboard') {
              SoundEngine.playClick();
              setActiveProject('leaderboard');
            }
          }}
          className={`absolute w-[400px] h-[500px] transition-all duration-300 ${activeProject === 'leaderboard' ? 'cursor-default' : 'cursor-pointer hover:shadow-2xl'} ${activeProject === 'exiles' ? 'pointer-events-none' : ''}`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <GlassCard className="w-full h-full p-10 flex flex-col items-center justify-center bg-[#0a0a0a]/40 border-white/10 group">
            {/* Minimalist Title (Visible when inactive) */}
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${activeProject === 'leaderboard' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
               <h2 className="text-4xl font-light tracking-widest text-white/50 group-hover:text-white/80 transition-colors duration-500 uppercase">Leaderboard</h2>
            </div>
            
            {/* Detailed Content (Visible when active) */}
            <ProjectContent type="leaderboard" isActive={activeProject === 'leaderboard'} />

            {/* Close Button */}
            {activeProject === 'leaderboard' && (
               <button
                 onClick={(e) => { e.stopPropagation(); setActiveProject(null); }}
                 className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center group/btn hover:bg-white/5 rounded-full transition-colors"
               >
                 <div className="w-4 h-[1px] bg-white/70 rotate-45 absolute group-hover/btn:rotate-135 transition-transform duration-500" />
                 <div className="w-4 h-[1px] bg-white/70 -rotate-45 absolute group-hover/btn:-rotate-135 transition-transform duration-500" />
               </button>
            )}
          </GlassCard>
        </div>

      </div>
    </div>
  );
};
