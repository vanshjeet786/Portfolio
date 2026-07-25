import React, { useState, useRef } from 'react';
import { CONNECT_DATA } from './ConnectData';
import { ExternalLink, Download } from 'lucide-react';
import { SoundEngine } from '@/utils/SoundEngine';

export const LayoutSlabs: React.FC<{ onSwitchLayout: () => void }> = ({ onSwitchLayout }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const sections = [
    { title: 'Profile', id: 'profile' },
    { title: 'About', id: 'about' },
    { title: 'Crafts', id: 'crafts' },
    { title: 'Links', id: 'links' },
  ];

  const handleSlabClick = (index: number) => {
    if (activeIndex === index) return;
    SoundEngine.playClick();
    setActiveIndex(index);
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-[#111]" ref={containerRef}>
      {sections.map((section, index) => {
        const isActive = activeIndex === index;
        return (
          <div
            key={section.id}
            onClick={() => handleSlabClick(index)}
            onMouseEnter={() => { if (!isActive) SoundEngine.playHover(); }}
            className={`
              relative flex flex-col md:flex-row overflow-hidden border-b md:border-b-0 md:border-r border-white/5
              transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] cursor-pointer
              ${isActive ? 'flex-[4] md:flex-[4] bg-[#1a1a1a]' : 'flex-[1] md:flex-[1] hover:bg-[#151515]'}
            `}
          >
            {/* Vertical Title (Desktop) / Horizontal Title (Mobile) */}
            <div className="p-4 md:p-6 flex md:flex-col items-center justify-between md:justify-start min-w-[60px] md:min-w-[80px] bg-black/20">
              <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-white/50 font-mono md:[writing-mode:vertical-lr] md:rotate-180 whitespace-nowrap">
                {section.title}
              </span>
              <span className="text-white/20 font-mono text-[10px] mt-0 md:mt-4">
                0{index + 1}
              </span>
            </div>

            {/* Content Area */}
            <div
              className={`
                flex-1 p-6 md:p-12 overflow-y-auto custom-scrollbar transition-opacity duration-700 delay-200
                ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none absolute inset-0 md:static'}
              `}
            >
              <div className="max-w-2xl mx-auto w-full h-full">
                {isActive && (
                  <div className="animate-fade-in-up">
                    {section.id === 'profile' && <ProfileContent />}
                    {section.id === 'about' && <AboutContent />}
                    {section.id === 'crafts' && <CraftsContent />}
                    {section.id === 'links' && <LinksContent />}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Switch Layout Button - Engraved Notches */}
      <button
        onClick={(e) => { e.stopPropagation(); onSwitchLayout(); }}
        className="absolute bottom-6 right-6 flex gap-1 z-10 group"
        title="Next Design Paradigm"
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-6 bg-white/20 rounded-full group-hover:bg-[#d4af37] group-hover:h-8 transition-all duration-300"
            style={{ transitionDelay: `${i * 50}ms` }}
          />
        ))}
      </button>
    </div>
  );
};

// Subcomponents for Slabs

const ProfileContent = () => (
  <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
    <div className="w-40 h-40 rounded-full overflow-hidden border border-white/10 mb-8 filter grayscale hover:grayscale-0 transition-all duration-700">
      <img src={CONNECT_DATA.profile.image} alt={CONNECT_DATA.profile.name} className="w-full h-full object-cover scale-110" />
    </div>
    <h2 className="text-4xl md:text-5xl font-light text-white tracking-widest uppercase font-jost mb-2">
      {CONNECT_DATA.profile.name}
    </h2>
    <p className="text-[#d4af37] tracking-[0.4em] text-xs font-mono uppercase mb-4">
      {CONNECT_DATA.profile.title}
    </p>
    <p className="text-white/40 text-[10px] tracking-widest font-mono uppercase">
      {CONNECT_DATA.profile.location}
    </p>
  </div>
);

const AboutContent = () => (
  <div className="flex flex-col justify-center h-full min-h-[400px]">
    <h3 className="text-[10px] uppercase tracking-[0.4em] text-[#d4af37] font-mono mb-4">
      {CONNECT_DATA.about.header}
    </h3>
    <h2 className="text-3xl md:text-4xl font-light text-white tracking-tight uppercase font-jost mb-8">
      {CONNECT_DATA.about.headline}
    </h2>
    <div className="space-y-6 text-sm text-white/70 font-light font-jost leading-relaxed tracking-wide">
      {CONNECT_DATA.about.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
    </div>
    <div className="mt-10 flex flex-wrap gap-4">
      {CONNECT_DATA.about.tags.map((tag, i) => (
        <span key={i} className="flex items-center gap-2 text-[10px] text-white/50 font-mono border border-white/10 px-3 py-1.5 rounded-full">
          <tag.icon className="w-3.5 h-3.5 text-[#d4af37]" />
          {tag.label}
        </span>
      ))}
    </div>
  </div>
);

const CraftsContent = () => (
  <div className="flex flex-col justify-center h-full min-h-[400px]">
    <h3 className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-mono mb-8">
      {CONNECT_DATA.hobbies.header}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {CONNECT_DATA.hobbies.items.map((hobby, i) => (
        <div key={i} className="p-6 border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-colors duration-300">
          <hobby.icon className="w-6 h-6 text-[#d4af37] mb-4" />
          <h4 className="text-sm tracking-widest text-white/90 font-jost uppercase mb-2">
            {hobby.title}
          </h4>
          <p className="text-xs text-white/50 font-light leading-relaxed">
            {hobby.desc}
          </p>
        </div>
      ))}
    </div>
  </div>
);

const LinksContent = () => (
  <div className="flex flex-col justify-center h-full min-h-[400px]">
    <h3 className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-mono mb-8">
      {CONNECT_DATA.links.header}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {CONNECT_DATA.links.items.map((link, i) => (
        <a
          key={i} href={link.href} target="_blank" rel="noreferrer"
          className="flex items-center justify-between p-5 border border-white/10 hover:border-white/30 group transition-all"
        >
          <div className="flex items-center gap-4">
            <link.icon className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-mono">{link.name}</p>
              <p className="text-xs text-white/80 group-hover:text-white font-jost truncate max-w-[150px] md:max-w-[200px]">{link.label}</p>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
        </a>
      ))}
    </div>
    <a
      href={CONNECT_DATA.resume.href} target="_blank" rel="noreferrer"
      className="flex items-center justify-between p-6 bg-[#d4af37]/10 border border-[#d4af37]/30 hover:bg-[#d4af37]/20 transition-all group"
    >
      <div className="flex items-center gap-4">
        <CONNECT_DATA.resume.icon className="w-6 h-6 text-[#d4af37]" />
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37] font-mono">{CONNECT_DATA.resume.name}</p>
          <p className="text-sm text-white font-jost">{CONNECT_DATA.resume.label}</p>
        </div>
      </div>
      <Download className="w-5 h-5 text-[#d4af37] group-hover:-translate-y-1 transition-transform" />
    </a>
  </div>
);
