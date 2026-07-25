import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { SoundEngine } from '@/utils/SoundEngine';
import { LayoutSlabs } from './LayoutSlabs';
import { LayoutGallery } from './LayoutGallery';
import { LayoutBlueprint } from './LayoutBlueprint';
import { LayoutGlassLens } from './LayoutGlassLens';
import { LayoutDepthChamber } from './LayoutDepthChamber';
import { LayoutDynamicGrid } from './LayoutDynamicGrid';

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConnectModal: React.FC<ConnectModalProps> = ({ isOpen, onClose }) => {
  const [activeLayoutIndex, setActiveLayoutIndex] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const layouts = [
    LayoutSlabs,
    LayoutGallery,
    LayoutBlueprint,
    LayoutGlassLens,
    LayoutDepthChamber,
    LayoutDynamicGrid
  ];

  const handleNextLayout = () => {
    SoundEngine.playClick();

    // Animate out current layout
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        opacity: 0,
        scale: 0.95,
        filter: 'blur(10px)',
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          setActiveLayoutIndex((prev) => (prev + 1) % layouts.length);
          // Animate in new layout
          gsap.fromTo(contentRef.current,
            { opacity: 0, scale: 1.05, filter: 'blur(10px)' },
            { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.8, ease: 'expo.out' }
          );
        }
      });
    } else {
      setActiveLayoutIndex((prev) => (prev + 1) % layouts.length);
    }
  };

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(modalRef.current,
        { opacity: 0, scale: 0.95, filter: 'blur(10px)' },
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.2, ease: "expo.out", display: 'flex' }
      );
    } else {
      gsap.to(modalRef.current, {
        opacity: 0, scale: 0.95, filter: 'blur(10px)', duration: 0.6, ease: "power3.inOut",
        onComplete: () => {
          if (modalRef.current) modalRef.current.style.display = 'none';
        }
      });
    }
  }, [isOpen]);

  const ActiveLayout = layouts[activeLayoutIndex];

  return (
    <div
      ref={modalRef}
      style={{ display: 'none' }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-auto"
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => { SoundEngine.playClick(); onClose(); }} />

      {/* Modal Container */}
      <div className="relative w-full h-full max-w-7xl bg-[#0a0a0a]/90 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col">

        {/* Global Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
             <div className="w-2.5 h-2.5 rounded-full bg-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.4)] animate-pulse" />
             <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-white/60 font-mono">
               CONNECT // VANSHJEET
             </span>
          </div>
          <button
            onMouseEnter={() => SoundEngine.playHover()}
            onClick={() => { SoundEngine.playClick(); onClose(); }}
            className="group relative w-10 h-10 flex items-center justify-center rounded-full border border-white/10 hover:border-[#d4af37]/50 hover:bg-[#d4af37]/10 transition-all duration-300"
          >
            <div className="w-4 h-[1px] bg-white rotate-45 absolute group-hover:rotate-135 transition-transform duration-500" />
            <div className="w-4 h-[1px] bg-white -rotate-45 absolute group-hover:-rotate-135 transition-transform duration-500" />
          </button>
        </div>

        {/* Dynamic Content Area */}
        <div ref={contentRef} className="flex-1 relative overflow-hidden">
          <ActiveLayout onSwitchLayout={handleNextLayout} />
        </div>

      </div>
    </div>
  );
};
