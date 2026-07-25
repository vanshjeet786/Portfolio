import React, { useState } from 'react';
import { CONNECT_DATA } from './ConnectData';
import { ExternalLink, Download } from 'lucide-react';
import { SoundEngine } from '@/utils/SoundEngine';

export const LayoutBlueprint: React.FC<{ onSwitchLayout: () => void }> = ({ onSwitchLayout }) => {
  const [activeNode, setActiveNode] = useState<string | null>('profile');

  const nodes = [
    { id: 'profile', label: 'SYS_CORE', x: '50%', y: '50%' },
    { id: 'about', label: 'DATA_BIO', x: '20%', y: '30%' },
    { id: 'crafts', label: 'PROC_CRAFTS', x: '80%', y: '25%' },
    { id: 'links', label: 'NET_LINKS', x: '30%', y: '75%' },
    { id: 'resume', label: 'FILE_CV', x: '70%', y: '80%' },
  ];

  const handleNodeEnter = (id: string) => {
    if (activeNode !== id) {
      SoundEngine.playHover();
      setActiveNode(id);
    }
  };

  return (
    <div className="w-full h-full bg-[#050505] relative overflow-hidden font-mono">
      {/* Blueprint Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #b87333 1px, transparent 1px),
            linear-gradient(to bottom, #b87333 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Switch Layout - Compass Dial */}
      <div
        className="absolute top-1/2 right-8 -translate-y-1/2 w-16 h-16 rounded-full border border-[#b87333]/30 flex items-center justify-center cursor-pointer group z-20 hover:border-[#b87333]/80 transition-colors duration-500"
        onClick={(e) => { e.stopPropagation(); onSwitchLayout(); }}
      >
        <div className="absolute inset-2 border border-[#b87333]/10 rounded-full group-hover:rotate-90 transition-transform duration-700" />
        <div className="w-1 h-1 bg-[#b87333] rounded-full" />
        <span className="absolute -top-6 text-[8px] tracking-widest text-[#b87333]/50">N</span>
        <span className="absolute -bottom-6 text-[8px] tracking-widest text-[#b87333]/50">S</span>
      </div>

      {/* Connection Lines (SVG) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <defs>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#b87333" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#b87333" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Draw lines from core (50%,50%) to all other nodes */}
        {nodes.map(node => {
          if (node.id === 'profile') return null;
          const isActive = activeNode === node.id || activeNode === 'profile';
          return (
            <line
              key={`line-${node.id}`}
              x1="50%" y1="50%"
              x2={node.x} y2={node.y}
              stroke="#b87333"
              strokeWidth="1"
              strokeDasharray={isActive ? "none" : "4 4"}
              opacity={isActive ? 0.4 : 0.1}
              className="transition-all duration-700"
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map(node => {
        const isActive = activeNode === node.id;
        return (
          <div
            key={node.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
            style={{ left: node.x, top: node.y }}
            onMouseEnter={() => handleNodeEnter(node.id)}
            onClick={() => handleNodeEnter(node.id)}
          >
            <div className="relative group cursor-pointer flex flex-col items-center">
              {/* Node Point */}
              <div className={`
                w-3 h-3 rounded-none rotate-45 border transition-all duration-500 flex items-center justify-center
                ${isActive ? 'border-[#b87333] bg-[#b87333]/20 scale-150' : 'border-[#b87333]/40 bg-transparent'}
              `}>
                {isActive && <div className="w-1 h-1 bg-[#b87333]" />}
              </div>

              {/* Node Label */}
              <span className={`
                mt-4 text-[10px] tracking-[0.3em] uppercase transition-all duration-300 whitespace-nowrap
                ${isActive ? 'text-[#b87333]' : 'text-white/30'}
              `}>
                [{node.label}]
              </span>

              {/* Hover Glow */}
              <div className={`
                absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[url(#nodeGlow)]
                pointer-events-none transition-opacity duration-700 rounded-full
                ${isActive ? 'opacity-100' : 'opacity-0'}
              `} />
            </div>
          </div>
        );
      })}

      {/* Content Display Area (Fixed at bottom or side depending on active node) */}
      <div className={`
        absolute inset-0 pointer-events-none flex items-center justify-center z-10 transition-opacity duration-500
        ${activeNode ? 'opacity-100' : 'opacity-0'}
      `}>
        <div className="w-full max-w-md mx-auto p-8 border border-[#b87333]/20 bg-[#050505]/90 backdrop-blur-md pointer-events-auto transform translate-y-24 shadow-[0_0_50px_rgba(184,115,51,0.05)]">

          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#b87333]/20">
            <div className="w-1.5 h-1.5 bg-[#b87333] animate-pulse" />
            <span className="text-[10px] text-[#b87333] tracking-[0.4em] uppercase">
              {nodes.find(n => n.id === activeNode)?.label}
            </span>
          </div>

          <div className="min-h-[200px] text-white/80 font-jost text-sm leading-relaxed font-light">
            {activeNode === 'profile' && (
              <div className="text-center">
                <h2 className="text-2xl tracking-widest uppercase mb-2 text-white">{CONNECT_DATA.profile.name}</h2>
                <p className="text-[#b87333] font-mono text-[10px] tracking-widest mb-4">{CONNECT_DATA.profile.title}</p>
                <img src={CONNECT_DATA.profile.image} className="w-24 h-24 mx-auto border border-[#b87333]/30 p-1 opacity-80 filter sepia-[0.3]" alt="Profile" />
              </div>
            )}

            {activeNode === 'about' && (
              <div>
                <p className="mb-4 text-white uppercase tracking-wider text-base">{CONNECT_DATA.about.headline}</p>
                <p className="text-xs text-white/60 mb-4">{CONNECT_DATA.about.paragraphs[0]}</p>
                <div className="flex gap-2">
                  {CONNECT_DATA.about.tags.map(t => <span key={t.label} className="text-[9px] font-mono border border-white/10 px-2 py-1 text-white/40">{t.label}</span>)}
                </div>
              </div>
            )}

            {activeNode === 'crafts' && (
              <div className="space-y-4">
                {CONNECT_DATA.hobbies.items.map(h => (
                  <div key={h.title} className="border-l-2 border-[#b87333]/30 pl-3">
                    <p className="text-xs text-white uppercase tracking-wider mb-1">{h.title}</p>
                    <p className="text-[10px] font-mono text-white/40">{h.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {activeNode === 'links' && (
              <div className="grid grid-cols-2 gap-4">
                {CONNECT_DATA.links.items.map(l => (
                  <a key={l.name} href={l.href} target="_blank" rel="noreferrer" className="block border border-white/10 p-3 hover:border-[#b87333]/50 transition-colors group">
                    <p className="text-[9px] font-mono text-[#b87333] mb-1">{l.name}</p>
                    <p className="text-xs text-white truncate flex items-center justify-between">
                      {l.label.split('/')[0]} <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                    </p>
                  </a>
                ))}
              </div>
            )}

            {activeNode === 'resume' && (
              <div className="text-center pt-8">
                <a href={CONNECT_DATA.resume.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 border border-[#b87333] text-[#b87333] px-6 py-3 hover:bg-[#b87333] hover:text-black transition-all">
                  <Download className="w-4 h-4" />
                  <span className="text-xs tracking-widest uppercase font-mono">{CONNECT_DATA.resume.name}</span>
                </a>
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};
