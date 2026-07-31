import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { SoundEngine } from '@/utils/SoundEngine';
import { LayoutDynamicGrid } from './LayoutDynamicGrid';

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConnectModal: React.FC<ConnectModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(modalRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", display: 'flex' }
      );
    } else {
      gsap.to(modalRef.current, {
        opacity: 0, y: 20, duration: 0.6, ease: "power3.inOut",
        onComplete: () => {
          if (modalRef.current) modalRef.current.style.display = 'none';
        }
      });
    }
  }, [isOpen]);

  return (
    <div
      ref={modalRef}
      style={{ display: 'none' }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-auto"
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => { SoundEngine.playClick(); onClose(); }} />

      {/* Modal Container */}
      <div className="relative w-full h-full max-w-[1600px] bg-transparent rounded-sm overflow-hidden flex flex-col shadow-2xl">

        {/* Global Minimal Close Button */}
        <button
          onMouseEnter={() => SoundEngine.playHover()}
          onClick={() => { SoundEngine.playClick(); onClose(); }}
          className="absolute top-8 right-8 z-[100] group w-12 h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 transition-all duration-300 mix-blend-difference cursor-pointer"
          aria-label="Close"
        >
          <div className="relative w-4 h-4">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white rotate-45 group-hover:rotate-90 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white -rotate-45 group-hover:rotate-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
          </div>
        </button>

        {/* Dynamic Content Area */}
        <div className="flex-1 relative overflow-hidden w-full h-full rounded-sm">
          <LayoutDynamicGrid />
        </div>

      </div>
    </div>
  );
};
