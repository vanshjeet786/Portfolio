import React, { useState, useEffect, useRef } from 'react';
import { CONNECT_DATA } from './ConnectData';

export const LayoutDepthChamber: React.FC<{ onSwitchLayout: () => void }> = ({ onSwitchLayout }) => {
  const [scrollZ, setScrollZ] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const sections = [
    { id: 'profile', zPos: 0 },
    { id: 'about', zPos: 1000 },
    { id: 'crafts', zPos: 2000 },
    { id: 'links', zPos: 3000 },
  ];

  const MAX_SCROLL = 3000;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setScrollZ(prev => {
        const newZ = prev + e.deltaY * 2; // Speed multiplier
        return Math.max(0, Math.min(newZ, MAX_SCROLL + 500)); // Allow slightly scrolling past last item
      });
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  const progressPercent = Math.min(100, (scrollZ / MAX_SCROLL) * 100);

  return (
    <div className="w-full h-full bg-[#141517] relative overflow-hidden perspective-[1200px]" ref={containerRef}>

      {/* Fog Overlay to simulate depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#141517] via-transparent to-[#141517] z-50 pointer-events-none opacity-80" />

      {/* Switch Layout - Depth Gauge Tracker */}
      <div
        className="absolute right-10 top-1/2 -translate-y-1/2 h-64 w-12 flex flex-col items-center z-50 cursor-pointer group"
        onClick={(e) => { e.stopPropagation(); onSwitchLayout(); }}
      >
        <div className="text-[8px] font-mono text-white/30 mb-2 rotate-90 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">NEXT</div>
        <div className="w-[1px] h-full bg-white/10 relative">
          <div
            className="absolute left-1/2 -translate-x-1/2 w-3 h-1 bg-white transition-all duration-100 ease-out"
            style={{ top: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 3D Scene */}
      <div className="absolute inset-0 preserve-3d" style={{ transform: `translateZ(${scrollZ}px)` }}>

        {sections.map((section, _) => {
          // Calculate relative distance from camera (z=0)
          const relativeZ = section.zPos - scrollZ;
          // If relativeZ is positive, it's in front of camera (visible). If negative, it's behind (invisible).
          // We fade it out as it passes behind the camera
          const opacity = relativeZ > 0
            ? Math.max(0, 1 - (relativeZ / 1500)) // Fade out in distance
            : Math.max(0, 1 + (relativeZ / 500)); // Fade out quickly when passed

          const blur = relativeZ > 0
            ? Math.max(0, (relativeZ / 1000) * 5)
            : 0;

          return (
            <div
              key={section.id}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl flex flex-col items-center text-center preserve-3d"
              style={{
                transform: `translateZ(${-section.zPos}px)`,
                opacity,
                filter: `blur(${blur}px)`,
                pointerEvents: Math.abs(relativeZ) < 300 ? 'auto' : 'none' // Only clickable when near
              }}
            >
              {section.id === 'profile' && (
                <div>
                  <div className="text-[10px] font-mono text-white/30 tracking-[0.5em] mb-8">SCROLL TO DESCEND</div>
                  <h1 className="text-6xl md:text-8xl font-light font-jost text-white uppercase tracking-tighter mix-blend-difference mb-4">
                    {CONNECT_DATA.profile.name}
                  </h1>
                  <p className="text-sm font-mono text-white/50 tracking-widest">{CONNECT_DATA.profile.title}</p>
                </div>
              )}

              {section.id === 'about' && (
                <div className="bg-[#1a1c20]/80 backdrop-blur-xl border border-white/5 p-12 rounded-2xl shadow-2xl">
                  <h2 className="text-3xl font-light font-jost text-white mb-6 uppercase">{CONNECT_DATA.about.headline}</h2>
                  <p className="text-base text-white/70 font-light max-w-xl mx-auto leading-relaxed">
                    {CONNECT_DATA.about.paragraphs[0]}
                  </p>
                </div>
              )}

              {section.id === 'crafts' && (
                <div className="w-full">
                  <div className="text-[10px] font-mono text-white/30 tracking-[0.5em] mb-12">DISCIPLINES</div>
                  <div className="grid grid-cols-2 gap-8">
                    {CONNECT_DATA.hobbies.items.map((hobby, i) => (
                      <div key={i} className="text-left bg-gradient-to-b from-white/5 to-transparent p-6 rounded-xl border-t border-white/10">
                        <hobby.icon className="w-6 h-6 text-white mb-4" />
                        <h3 className="text-lg text-white font-jost mb-2">{hobby.title}</h3>
                        <p className="text-xs text-white/50">{hobby.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {section.id === 'links' && (
                <div className="flex flex-col items-center gap-8">
                  <div className="flex gap-6">
                    {CONNECT_DATA.links.items.map((link, i) => (
                      <a key={i} href={link.href} target="_blank" rel="noreferrer" className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white hover:text-black transition-all duration-300">
                        <link.icon className="w-6 h-6" />
                      </a>
                    ))}
                  </div>
                  <a href={CONNECT_DATA.resume.href} target="_blank" rel="noreferrer" className="text-sm font-mono tracking-widest text-white border-b border-white pb-1 hover:text-white/50 hover:border-white/50 transition-colors uppercase">
                    {CONNECT_DATA.resume.label}
                  </a>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
