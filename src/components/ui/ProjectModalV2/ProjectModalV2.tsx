import React, { useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import gsap from 'gsap';
import { SoundEngine } from '@/utils/SoundEngine';
import { ProjectDetailsContent, type ProjectDetailsData } from './ProjectDetailsContent';

export interface ProjectModalV2Props extends ProjectDetailsData {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectModalV2: React.FC<ProjectModalV2Props> = ({
  isOpen,
  onClose,
  title,
  tagline,
  meta,
  sections,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && containerRef.current && contentRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: 'power2.out', display: 'flex' }
      );
      
      const reveals = contentRef.current.querySelectorAll('.reveal');
      gsap.fromTo(
        reveals,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.2 }
      );
    } else if (!isOpen && containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.inOut',
        onComplete: () => {
          if (containerRef.current) {
            containerRef.current.style.display = 'none';
          }
        },
      });
    }
  }, [isOpen]);

  const handleClose = () => {
    SoundEngine.playClose();
    onClose();
  };

  return (
    <div
      ref={containerRef}
      style={{ display: 'none' }}
      className="fixed inset-0 z-[100] items-center justify-center pointer-events-auto"
    >
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md" 
        onClick={handleClose}
      />
      
      <div className="relative w-full max-w-8xl h-[85vh] bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden flex flex-col shadow-2xl mx-4">
        
        {/* Header */}
        <header className="flex justify-between items-center px-6 py-4 border-b border-white/10 bg-[#0a0a0a]/50 sticky top-0 z-50">
           <div>
             <span className="text-[#c8a68a] text-[13px] tracking-widest uppercase opacity-80 font-lexend">Project Details</span>
           </div>
           <button 
            onClick={handleClose}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group"
           >
             <X className="w-5 h-5 text-white/60 group-hover:text-[#c8a68a] transition-colors" />
           </button>
        </header>

        {/* Scrolling Content */}
        <div ref={contentRef} className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12 space-y-16 md:space-y-24">
          <ProjectDetailsContent
            title={title}
            tagline={tagline}
            meta={meta}
            sections={sections}
          />
        </div>
      </div>
    </div>
  );
};
