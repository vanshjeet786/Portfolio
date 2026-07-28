import React, { useRef, useEffect, useState } from 'react';
import { X, ZoomIn } from 'lucide-react';
import gsap from 'gsap';
import { SoundEngine } from '@/utils/SoundEngine';

export interface ProjectSection {
  title: string;
  content: React.ReactNode;
}

export interface ShowcaseImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface ProjectShowcase {
  primaryImage: ShowcaseImage;
  gallery: ShowcaseImage[];
}

export interface ProjectModalV2Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  tagline: string;
  meta: {
    role: string;
    timeline: string;
    context: string;
    about: React.ReactNode;
  };
  sections: {
    foundation: ProjectSection;
    design: ProjectSection;
    engineering: ProjectSection;
    deepDive: ProjectSection;
    optimization?: ProjectSection;
    devops?: ProjectSection;
    showcase?: ProjectShowcase;
  };
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
  const [zoomedImage, setZoomedImage] = useState<ShowcaseImage | null>(null);

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
    SoundEngine.playClick();
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
          
          {/* Title Area */}
          <section className="w-full flex flex-col items-start gap-4 border-b border-white/10 pb-12 reveal">
            <h2 className="text-4xl md:text-6xl font-light text-[#f4dfc6] leading-tight font-jost uppercase tracking-wider">{title}</h2>
            <p className="text-lg text-white/70 max font-lato">{tagline}</p>
          </section>

          {/* 01 Meta */}
          <section className="w-full flex flex-col md:flex-row gap-8 items-start reveal">
            <div className="md:w-1/3 flex-shrink-0">                        
            </div>
            <div className="md:w-2/3 bg-white/5 border border-white/10 p-8 rounded-xl space-y-6 hover:bg-white/10 transition-colors duration-500">
              <h4 className="text-white/100 text-xl tracking-wider uppercase border-b border-white/10 pb-4 mb-4">About the Project</h4>
              <div className="text-white/80 font-light leading-relaxed text-sm">
                {meta.about}
              </div>
              <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/10 mt-6">
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-white/50 mb-2">Role</span>
                  <span className="text-sm font-light text-white/90">{meta.role}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-white/50 mb-2">Timeline</span>
                  <span className="text-sm font-light text-white/90">{meta.timeline}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-white/50 mb-2">Context</span>
                  <span className="text-sm font-light text-white/90">{meta.context}</span>
                </div>
              </div>
            </div>
          </section>

          {/* 02 Foundation */}
          <section className="w-full flex flex-col md:flex-row-reverse gap-8 items-start reveal">
            <div className="md:w-1/3 flex-shrink-0 text-right">
               </div>
            <div className="md:w-2/3 bg-white/5 border border-white/10 p-8 rounded-xl space-y-6 hover:bg-white/10 transition-colors duration-500">
              <h4 className="text-white/100 text-xl tracking-wider uppercase border-b border-white/10 pb-4 mb-4">{sections.foundation.title}</h4>
              <div className="text-white/80 font-light leading-relaxed text-sm space-y-4">
                 {sections.foundation.content}
              </div>
            </div>
          </section>

          {/* 02.5 Showcase */}
          {sections.showcase && (
            <section className="w-full flex flex-col gap-8 reveal">
              <div className="w-full bg-white/5 border border-white/10 p-8 md:p-10 rounded-xl space-y-8 hover:bg-white/10 transition-colors duration-500">
                <div className="flex justify-between items-end border-b border-white/10 pb-4 mb-4">
                  <h4 className="text-white/100 text-xl tracking-wider uppercase">Showcase</h4>
                </div>
                
                {/* Primary Hero Image */}
                <div 
                  className="relative group overflow-hidden rounded-xl border border-white/10 hover:border-white/30 transition-all duration-500 cursor-pointer"
                  onClick={() => setZoomedImage(sections.showcase!.primaryImage)}
                >
                  <img 
                    alt={sections.showcase.primaryImage.alt} 
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" 
                    src={sections.showcase.primaryImage.src}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex items-center gap-2 bg-[#0a0a0a]/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                      <ZoomIn className="w-4 h-4 text-[#c8a68a]" />
                      <span className="text-xs text-white uppercase tracking-widest font-lexend">Expand</span>
                    </div>
                  </div>
                </div>

                {/* Filmstrip Gallery */}
                {sections.showcase.gallery.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                      {sections.showcase.gallery.map((img, idx) => (
                        <div key={idx} className="flex-shrink-0 w-64 space-y-2 cursor-pointer group" onClick={() => setZoomedImage(img)}>
                          <div className="aspect-video bg-black/50 rounded-lg border border-white/10 overflow-hidden relative">
                            <img alt={img.alt} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" src={img.src} />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <ZoomIn className="w-4 h-4 text-white/80" />
                            </div>
                          </div>
                          {img.caption && <p className="text-xs text-white/60 text-center font-lato">{img.caption}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* 03 Design (Optional but usually present) */}
          {sections.design && (
          <section className="w-full flex flex-col md:flex-row gap-8 items-start reveal">
            <div className="md:w-1/3 flex-shrink-0">
               </div>
             <div className="md:w-2/3 bg-white/5 border border-white/10 p-8 rounded-xl space-y-6 hover:bg-white/10 transition-colors duration-500">
              <h4 className="text-white/100 text-xl tracking-wider uppercase border-b border-white/10 pb-4 mb-4">{sections.design.title}</h4>
              <div className="text-white/80 font-light leading-relaxed text-sm space-y-4">
                 {sections.design.content}
              </div>
            </div>
          </section>
          )}

          {/* 04 Engineering */}
          <section className="w-full flex flex-col md:flex-row-reverse gap-8 items-start reveal">
            <div className="md:w-1/3 flex-shrink-0 text-right">
              </div>
            <div className="md:w-2/3 bg-white/5 border border-white/10 p-8 rounded-xl space-y-6 hover:bg-white/10 transition-colors duration-500">
              <h4 className="text-white/100 text-xl tracking-wider uppercase border-b border-white/10 pb-4 mb-4">{sections.engineering.title}</h4>
              <div className="text-white/80 font-light leading-relaxed text-sm space-y-4">
                 {sections.engineering.content}
              </div>
            </div>
          </section>
          
          {/* 05 Deep Dive */}
          <section className="w-full flex flex-col md:flex-row gap-8 items-start reveal">
            <div className="md:w-1/3 flex-shrink-0">
              </div>
             <div className="md:w-2/3 bg-white/5 border border-white/10 p-8 rounded-xl space-y-6 hover:bg-white/10 transition-colors duration-500">
              <h4 className="text-white/100 text-xl tracking-wider uppercase border-b border-white/10 pb-4 mb-4">{sections.deepDive.title}</h4>
              <div className="text-white/80 font-light leading-relaxed text-sm space-y-4">
                 {sections.deepDive.content}
              </div>
            </div>
          </section>

          {/* 06 Optimization */}
          {sections.optimization && (
          <section className="w-full flex flex-col md:flex-row-reverse gap-8 items-start reveal">
            <div className="md:w-1/3 flex-shrink-0 text-right">
              </div>
            <div className="md:w-2/3 bg-white/5 border border-white/10 p-8 rounded-xl space-y-6 hover:bg-white/10 transition-colors duration-500">
              <h4 className="text-white/40 text-xs tracking-wider uppercase border-b border-white/10 pb-4 mb-4">{sections.optimization.title}</h4>
              <div className="text-white/80 font-light leading-relaxed text-sm space-y-4">
                 {sections.optimization.content}
              </div>
            </div>
          </section>
          )}

          {/* 07 DevOps */}
          {sections.devops && (
          <section className="w-full flex flex-col md:flex-row gap-8 items-start reveal pb-24">
            <div className="md:w-1/3 flex-shrink-0">
              </div>
             <div className="md:w-2/3 bg-white/5 border border-white/10 p-8 rounded-xl space-y-6 hover:bg-white/10 transition-colors duration-500">
              <h4 className="text-white/40 text-xs tracking-wider uppercase border-b border-white/10 pb-4 mb-4">{sections.devops.title}</h4>
              <div className="text-white/80 font-light leading-relaxed text-sm space-y-4">
                 {sections.devops.content}
              </div>
            </div>
          </section>
          )}

        </div>
      </div>

      {/* Zoom Modal */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-12 cursor-zoom-out"
          onClick={() => setZoomedImage(null)}
        >
          <button 
            className="absolute top-8 right-8 w-12 h-12 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
            onClick={(e) => { e.stopPropagation(); setZoomedImage(null); }}
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <img 
            src={zoomedImage.src} 
            alt={zoomedImage.alt}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl border border-white/10"
          />
          {zoomedImage.caption && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/80 px-6 py-3 rounded-full border border-white/10 backdrop-blur-md">
              <p className="text-white text-sm font-lato tracking-wider uppercase">{zoomedImage.caption}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
