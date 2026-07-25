import React, { useState } from 'react';
import { CONNECT_DATA } from './ConnectData';
import { ExternalLink, Download } from 'lucide-react';
import { SoundEngine } from '@/utils/SoundEngine';

export const LayoutGlassLens: React.FC<{ onSwitchLayout: () => void }> = ({ onSwitchLayout }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const panes = [
    { id: 'profile', title: 'Identity' },
    { id: 'about', title: 'Biography' },
    { id: 'crafts', title: 'Crafts' },
    { id: 'links', title: 'Network' },
  ];

  const handlePaneClick = (index: number) => {
    if (index !== activeIndex) {
      SoundEngine.playClick();
      setActiveIndex(index);
    }
  };

  return (
    <div className="w-full h-full bg-[#0a0f14] relative flex items-center justify-center overflow-hidden perspective-[1000px]">

      {/* Background Ambience */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-r from-[#2a3f54] to-transparent blur-[100px] -translate-x-1/2 -translate-y-1/4" />
        <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-l from-[#1f2e3d] to-transparent blur-[80px] translate-x-1/4 translate-y-1/4" />
      </div>

      {/* Switch Layout - Arc Dots */}
      <div
        className="absolute bottom-12 left-12 z-30 flex flex-col gap-3 group cursor-pointer"
        onClick={(e) => { e.stopPropagation(); onSwitchLayout(); }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-white/80 transition-colors -translate-x-2" />
        <div className="w-2 h-2 rounded-full bg-white/30 group-hover:bg-white/90 transition-colors" />
        <div className="w-2.5 h-2.5 rounded-full bg-white/40 group-hover:bg-white transition-colors translate-x-2" />
      </div>

      {/* Glass Panes Stack */}
      <div className="relative w-full max-w-4xl h-[600px] flex items-center justify-center preserve-3d">
        {panes.map((pane, index) => {
          const offset = index - activeIndex;
          const isActive = offset === 0;
          const isPast = offset < 0;

          // Calculate 3D transforms based on index relative to active index
          const translateZ = isActive ? 0 : isPast ? -200 + (offset * 100) : -100 - (offset * 50);
          const translateX = isActive ? 0 : isPast ? -200 + (offset * 50) : 200 + (offset * 50);
          const rotateY = isActive ? 0 : isPast ? 15 : -15;
          const opacity = isActive ? 1 : Math.max(0, 1 - Math.abs(offset) * 0.3);
          const blur = isActive ? 0 : Math.min(10, Math.abs(offset) * 4);

          return (
            <div
              key={pane.id}
              onClick={() => handlePaneClick(index)}
              className={`
                absolute w-[90%] md:w-[600px] h-[450px] rounded-3xl border border-white/10
                bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-2xl
                transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]
                flex flex-col overflow-hidden
                ${isActive ? 'cursor-default z-20 shadow-[0_30px_60px_rgba(0,0,0,0.5)]' : 'cursor-pointer z-10 hover:border-white/30'}
              `}
              style={{
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg)`,
                opacity,
                filter: `blur(${blur}px)`,
              }}
            >
              {/* Glass Glare */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

              {/* Pane Header */}
              <div className="px-8 py-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                <span className="text-[10px] font-mono tracking-widest text-white/50 uppercase">
                  {String(index + 1).padStart(2, '0')} // {pane.title}
                </span>
                {!isActive && (
                  <span className="text-[9px] font-mono text-white/30 tracking-wider">CLICK TO FOCUS</span>
                )}
              </div>

              {/* Pane Content */}
              <div className="flex-1 p-8 overflow-y-auto custom-scrollbar relative z-10">
                {pane.id === 'profile' && (
                  <div className="flex flex-col md:flex-row gap-8 items-center h-full justify-center">
                    <img src={CONNECT_DATA.profile.image} alt="Profile" className="w-40 h-40 rounded-2xl object-cover filter grayscale opacity-90 border border-white/10 shadow-lg" />
                    <div className="text-center md:text-left">
                      <h2 className="text-4xl font-light font-jost text-white mb-2">{CONNECT_DATA.profile.name}</h2>
                      <p className="text-xs font-mono text-white/60 tracking-widest uppercase mb-4">{CONNECT_DATA.profile.title}</p>
                      <p className="text-[10px] font-mono text-white/40 tracking-wider flex items-center justify-center md:justify-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/40" /> {CONNECT_DATA.profile.location}
                      </p>
                    </div>
                  </div>
                )}

                {pane.id === 'about' && (
                  <div className="flex flex-col justify-center h-full">
                    <h3 className="text-2xl font-light font-jost text-white mb-6 leading-snug">
                      {CONNECT_DATA.about.headline}
                    </h3>
                    <div className="space-y-4 text-sm text-white/60 font-light leading-relaxed">
                      {CONNECT_DATA.about.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                    </div>
                  </div>
                )}

                {pane.id === 'crafts' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full content-center">
                    {CONNECT_DATA.hobbies.items.map((hobby, i) => (
                      <div key={i} className="p-4 bg-white/[0.03] rounded-xl border border-white/5">
                        <hobby.icon className="w-5 h-5 text-white/70 mb-3" />
                        <h4 className="text-sm font-jost text-white mb-1">{hobby.title}</h4>
                        <p className="text-[10px] text-white/40 font-light">{hobby.desc}</p>
                      </div>
                    ))}
                  </div>
                )}

                {pane.id === 'links' && (
                  <div className="flex flex-col justify-center h-full gap-4">
                    {CONNECT_DATA.links.items.map((link, i) => (
                      <a key={i} href={link.href} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/10 hover:bg-white/[0.05] transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                            <link.icon className="w-4 h-4 text-white/70" />
                          </div>
                          <div>
                            <p className="text-[10px] font-mono text-white/40 tracking-wider mb-0.5">{link.name}</p>
                            <p className="text-sm font-jost text-white/90">{link.label}</p>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
                      </a>
                    ))}
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <a href={CONNECT_DATA.resume.href} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 w-full p-4 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-colors">
                        <Download className="w-4 h-4" />
                        <span className="text-xs font-mono tracking-widest uppercase">{CONNECT_DATA.resume.label}</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
