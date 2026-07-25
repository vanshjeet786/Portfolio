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

      {/* View Switcher */}
      <button
        onClick={(e) => { e.stopPropagation(); onSwitchLayout(); }}
        className="absolute top-8 right-24 z-20 group flex items-center gap-4 cursor-pointer"
        aria-label="Switch to Grid View"
      >
        <span className="text-xs uppercase tracking-widest font-mono text-[#1a1a1a]/40 group-hover:text-[#1a1a1a] transition-colors opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 duration-500 ease-out">
          Grid View
        </span>
        <div className="w-12 h-12 rounded-full border border-[#1a1a1a]/20 group-hover:border-[#1a1a1a] flex items-center justify-center transition-all duration-500">
          <div className="w-3 h-3 rounded-full bg-[#1a1a1a]/20 group-hover:bg-[#1a1a1a] transition-all duration-500 scale-50 group-hover:scale-100" />
        </div>
      </button>

      {/* Progress Track */}
      <div className="absolute bottom-10 left-12 right-12 h-[1px] bg-[#1a1a1a]/10 z-10 pointer-events-none hidden md:block">
        <div
          className="absolute top-0 left-0 h-full bg-[#1a1a1a] transition-all duration-300 ease-out"
          style={{ width: `${Math.max(2, scrollProgress * 100)}%` }}
        />
      </div>

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full h-full overflow-x-auto overflow-y-hidden flex items-center hide-scrollbar pl-12 md:pl-24 pr-[30vw] md:pr-[50vw]"
      >
        <div ref={trackRef} className="flex items-center h-full py-24 gap-40 shrink-0">

          {/* Identity Section */}
          <div className="flex items-center gap-16 shrink-0 h-full">
            <div className="h-full aspect-[3/4] max-h-[60vh] relative overflow-hidden bg-black/5">
              <img
                src={CONNECT_DATA.profile.image}
                alt="Portrait"
                className="w-full h-full object-cover filter grayscale"
              />
            </div>
            <div className="flex flex-col max-w-lg">
              <h1 className="text-6xl md:text-8xl font-light tracking-tight uppercase font-jost mb-6 text-[#1a1a1a] leading-none whitespace-nowrap">
                {CONNECT_DATA.profile.name}
              </h1>
              <span className="text-sm font-mono tracking-widest uppercase text-[#1a1a1a]/50">
                {CONNECT_DATA.profile.title}
              </span>
            </div>
          </div>

          {/* Story Section */}
          <div className="flex flex-col justify-center shrink-0 max-w-2xl h-full border-l border-[#1a1a1a]/10 pl-24">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight uppercase font-jost mb-12 text-[#1a1a1a] leading-tight max-w-xl">
              {CONNECT_DATA.about.headline}
            </h2>
            <div className="space-y-8">
              {CONNECT_DATA.about.paragraphs.map((p, i) => (
                <p key={i} className="text-xl font-jost text-[#1a1a1a]/70 leading-loose">
                  {p}
                </p>
              ))}
            </div>
          </div>

          {/* Crafts Section */}
          <div className="flex flex-col justify-center shrink-0 h-full border-l border-[#1a1a1a]/10 pl-24">
            <h3 className="text-xs uppercase tracking-widest font-mono mb-16 text-[#1a1a1a]/40">
              {CONNECT_DATA.hobbies.header}
            </h3>
            <div className="grid grid-cols-2 gap-x-24 gap-y-20 max-w-4xl">
              {CONNECT_DATA.hobbies.items.map((hobby, i) => (
                <div key={i} className="flex flex-col">
                  <hobby.icon className="w-8 h-8 text-[#1a1a1a]/80 mb-6" strokeWidth={1} />
                  <h4 className="text-2xl tracking-wider uppercase font-jost mb-4 text-[#1a1a1a]">
                    {hobby.title}
                  </h4>
                  <p className="text-lg text-[#1a1a1a]/60 font-light font-jost leading-relaxed max-w-sm">
                    {hobby.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Network Section */}
          <div className="flex flex-col justify-center shrink-0 h-full border-l border-[#1a1a1a]/10 pl-24">
            <h3 className="text-xs uppercase tracking-widest font-mono mb-16 text-[#1a1a1a]/40">
              {CONNECT_DATA.links.header}
            </h3>
            <div className="flex flex-col gap-12">
              {CONNECT_DATA.links.items.map((link, i) => (
                <a
                  key={i} href={link.href} target="_blank" rel="noreferrer"
                  className="group flex items-center justify-between w-96 border-b border-[#1a1a1a]/10 pb-6 hover:border-[#1a1a1a]/50 transition-colors"
                >
                  <span className="text-3xl font-light font-jost text-[#1a1a1a] group-hover:translate-x-2 transition-transform duration-500 ease-out">
                    {link.name}
                  </span>
                  <ExternalLink className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500 text-[#1a1a1a]/50" />
                </a>
              ))}

              <div className="pt-12">
                <a
                  href={CONNECT_DATA.resume.href} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-6 group"
                >
                  <div className="w-16 h-16 rounded-full border border-[#1a1a1a] flex items-center justify-center bg-transparent group-hover:bg-[#1a1a1a] transition-colors duration-500">
                    <Download className="w-5 h-5 text-[#1a1a1a] group-hover:text-[#e8e6e1] transition-colors duration-500" strokeWidth={1.5} />
                  </div>
                  <span className="text-lg font-jost uppercase tracking-widest text-[#1a1a1a]">
                    {CONNECT_DATA.resume.label}
                  </span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll Hint */}
      <div className="absolute bottom-24 right-12 pointer-events-none hidden md:flex items-center gap-4 opacity-40">
        <div className="w-12 h-[1px] bg-[#1a1a1a]" />
        <span className="text-xs font-mono tracking-widest text-[#1a1a1a] uppercase">Scroll</span>
      </div>

    </div>
  );
};
