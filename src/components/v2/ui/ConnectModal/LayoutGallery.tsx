import React, { useRef, useState, useEffect } from 'react';
import { CONNECT_DATA } from './ConnectData';
import { ExternalLink, Download } from 'lucide-react';

export const LayoutGallery: React.FC<{ onSwitchLayout: () => void }> = ({ onSwitchLayout }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    if (trackRef.current && containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      const progress = scrollLeft / (scrollWidth - clientWidth);
      setScrollProgress(progress);
    }
  };

  useEffect(() => {
    // Horizontal wheel scroll mapping
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div className="w-full h-full bg-[#e8e6e1] relative text-[#1a1a1a]">
      {/* Switch Layout - Proportion Dots */}
      <div
        className="absolute top-6 right-6 z-20 flex gap-2 cursor-pointer group p-2"
        onClick={(e) => { e.stopPropagation(); onSwitchLayout(); }}
      >
        <div className="w-2 h-2 rounded-full bg-[#1a1a1a]/40 group-hover:bg-[#1a1a1a] transition-colors" />
        <div className="w-3 h-2 rounded-full bg-[#1a1a1a]/40 group-hover:bg-[#1a1a1a] transition-colors" />
        <div className="w-5 h-2 rounded-full bg-[#1a1a1a]/40 group-hover:bg-[#1a1a1a] transition-colors" />
      </div>

      {/* Progress Track */}
      <div className="absolute bottom-10 left-12 right-12 h-[1px] bg-[#1a1a1a]/10 z-10 pointer-events-none hidden md:block">
        <div
          className="absolute top-0 left-0 h-full bg-[#1a1a1a] transition-all duration-300 ease-out"
          style={{ width: `${Math.max(5, scrollProgress * 100)}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#1a1a1a] transition-all duration-300 ease-out"
          style={{ left: `calc(${scrollProgress * 100}% - 4px)` }}
        />
      </div>

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full h-full overflow-x-auto overflow-y-hidden flex items-center hide-scrollbar pl-12 md:pl-24 pr-[50vw]"
      >
        <div ref={trackRef} className="flex items-center h-[70%] gap-24 md:gap-40 shrink-0">

          {/* Piece 1: Title/Bio */}
          <div className="w-[80vw] md:w-[600px] flex flex-col justify-end h-full pb-10 border-l border-[#1a1a1a]/20 pl-8 md:pl-16 relative">
            <span className="absolute top-0 left-[-2px] text-[10px] font-mono rotate-90 origin-left text-[#1a1a1a]/40 tracking-widest">
              EXHIBIT 01
            </span>
            <h1 className="text-5xl md:text-7xl font-light tracking-tighter uppercase font-jost mb-6 leading-[0.9]">
              {CONNECT_DATA.profile.name.split(' ').map((n, i) => <div key={i}>{n}</div>)}
            </h1>
            <p className="text-sm md:text-base font-jost text-[#1a1a1a]/70 max-w-md mb-8 leading-relaxed">
              {CONNECT_DATA.about.headline} {CONNECT_DATA.about.paragraphs[0]}
            </p>
            <div className="flex gap-4">
              <span className="text-[10px] font-mono tracking-widest uppercase border border-[#1a1a1a]/20 px-3 py-1">
                {CONNECT_DATA.profile.title}
              </span>
            </div>
          </div>

          {/* Piece 2: Portrait */}
          <div className="w-[80vw] md:w-[400px] h-full flex flex-col justify-center shrink-0">
             <div className="w-full aspect-[3/4] relative overflow-hidden bg-[#1a1a1a]/5 p-2 md:p-4">
                <img
                  src={CONNECT_DATA.profile.image}
                  alt="Portrait"
                  className="w-full h-full object-cover filter grayscale sepia-[0.2]"
                />
             </div>
             <p className="text-[10px] font-mono text-center mt-4 text-[#1a1a1a]/40 tracking-[0.4em]">FIG. 1 — REMOTE / GLOBAL</p>
          </div>

          {/* Piece 3: Crafts */}
          <div className="w-[80vw] md:w-[700px] h-full flex flex-col justify-center shrink-0 border-l border-[#1a1a1a]/20 pl-8 md:pl-16 relative">
            <span className="absolute top-0 left-[-2px] text-[10px] font-mono rotate-90 origin-left text-[#1a1a1a]/40 tracking-widest">
              EXHIBIT 02
            </span>
            <h3 className="text-[10px] uppercase tracking-[0.4em] font-mono mb-12 text-[#1a1a1a]/50">
              {CONNECT_DATA.hobbies.header}
            </h3>
            <div className="grid grid-cols-2 gap-x-12 gap-y-16">
              {CONNECT_DATA.hobbies.items.map((hobby, i) => (
                <div key={i} className="group">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-[10px] font-mono text-[#1a1a1a]/30">0{i+1}</span>
                    <div className="h-[1px] flex-1 bg-[#1a1a1a]/10 group-hover:bg-[#1a1a1a]/40 transition-colors" />
                  </div>
                  <h4 className="text-xl tracking-wider uppercase font-jost mb-3 text-[#1a1a1a]">
                    {hobby.title}
                  </h4>
                  <p className="text-sm text-[#1a1a1a]/60 font-light font-jost leading-relaxed">
                    {hobby.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Piece 4: Links */}
          <div className="w-[80vw] md:w-[500px] h-full flex flex-col justify-center shrink-0 border-l border-[#1a1a1a]/20 pl-8 md:pl-16 relative">
            <span className="absolute top-0 left-[-2px] text-[10px] font-mono rotate-90 origin-left text-[#1a1a1a]/40 tracking-widest">
              EXHIBIT 03
            </span>
            <div className="space-y-8">
              {CONNECT_DATA.links.items.map((link, i) => (
                <a
                  key={i} href={link.href} target="_blank" rel="noreferrer"
                  className="block group"
                >
                  <p className="text-[10px] font-mono tracking-widest text-[#1a1a1a]/40 mb-1 uppercase">{link.name}</p>
                  <p className="text-2xl font-light font-jost text-[#1a1a1a] flex items-center gap-4">
                    {link.label}
                    <ExternalLink className="w-4 h-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </p>
                </a>
              ))}

              <div className="pt-8 mt-8 border-t border-[#1a1a1a]/20">
                <a
                  href={CONNECT_DATA.resume.href} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-4 px-6 py-4 bg-[#1a1a1a] text-[#e8e6e1] hover:bg-[#333] transition-colors"
                >
                  <span className="text-xs tracking-[0.2em] uppercase font-mono">{CONNECT_DATA.resume.name}</span>
                  <Download className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll Hint */}
      <div className="absolute top-1/2 right-4 md:right-8 -translate-y-1/2 pointer-events-none md:hidden flex flex-col items-center gap-2 opacity-50">
        <span className="text-[10px] font-mono tracking-widest text-[#1a1a1a] rotate-90 origin-center whitespace-nowrap">DRAG</span>
        <div className="w-[1px] h-12 bg-[#1a1a1a]" />
      </div>

    </div>
  );
};
