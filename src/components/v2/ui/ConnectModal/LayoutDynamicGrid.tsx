import React, { useState } from 'react';
import { CONNECT_DATA } from './ConnectData';
import { ExternalLink } from 'lucide-react';
import { SoundEngine } from '@/utils/SoundEngine';

export const LayoutDynamicGrid: React.FC<{ onSwitchLayout: () => void }> = ({ onSwitchLayout }) => {
  const [activeBlock, setActiveBlock] = useState<string>('profile');

  const handleBlockClick = (id: string) => {
    if (activeBlock !== id) {
      SoundEngine.playClick();
      setActiveBlock(id);
    }
  };


  return (
    <div className="w-full h-full bg-[#0a0a0a] p-4 md:p-8 relative">

      {/* Container simulating a solid architectural grid */}
      <div className={`w-full h-full flex flex-col md:flex-row gap-2 transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]`}>

        {/* Profile Block */}
        <div
          onClick={() => handleBlockClick('profile')}
          className={`
            bg-[#141414] border border-white/5 overflow-hidden relative cursor-pointer group transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]
            ${activeBlock === 'profile' ? 'flex-[4] md:flex-[4]' : 'flex-[1] md:flex-[1] hover:bg-[#1a1a1a]'}
          `}
        >
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
             <div className={`transition-opacity duration-500 delay-300 ${activeBlock === 'profile' ? 'opacity-100' : 'opacity-0 md:opacity-100'}`}>
                <h1 className={`font-jost uppercase transition-all duration-700 ${activeBlock === 'profile' ? 'text-5xl md:text-7xl text-white font-light' : 'text-xl text-white/50'}`}>
                  {CONNECT_DATA.profile.name}
                </h1>
                {activeBlock === 'profile' && (
                  <p className="text-sm font-mono text-white/40 mt-4 tracking-widest">{CONNECT_DATA.profile.title}</p>
                )}
             </div>
          </div>
        </div>

        {/* Right Column Stack */}
        <div className={`flex flex-col gap-2 transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${activeBlock === 'profile' ? 'flex-[2]' : 'flex-[4]'}`}>

          {/* About Block */}
          <div
            onClick={() => handleBlockClick('about')}
            className={`
              bg-[#141414] border border-white/5 overflow-hidden relative cursor-pointer group transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]
              ${activeBlock === 'about' ? 'flex-[4]' : 'flex-[1] hover:bg-[#1a1a1a]'}
            `}
          >
            <div className="absolute inset-0 p-6 flex flex-col">
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-4">Biography</span>
              {activeBlock === 'about' && (
                <div className="animate-fade-in-up mt-auto">
                  <h2 className="text-3xl font-light font-jost text-white mb-4 uppercase leading-tight max-w-xl">{CONNECT_DATA.about.headline}</h2>
                  <p className="text-sm text-white/60 font-light max-w-xl">{CONNECT_DATA.about.paragraphs[0]}</p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Split */}
          <div className={`flex flex-row gap-2 transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${activeBlock === 'about' ? 'flex-[1]' : 'flex-[3]'}`}>

            {/* Crafts Block */}
            <div
              onClick={() => handleBlockClick('crafts')}
              className={`
                bg-[#141414] border border-white/5 overflow-hidden relative cursor-pointer group transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]
                ${activeBlock === 'crafts' ? 'flex-[3]' : 'flex-[1] hover:bg-[#1a1a1a]'}
              `}
            >
              <div className="absolute inset-0 p-6 flex flex-col">
                <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-4">Crafts</span>
                {activeBlock === 'crafts' && (
                  <div className="animate-fade-in-up mt-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                    {CONNECT_DATA.hobbies.items.map((h, i) => (
                      <div key={i} className="bg-white/[0.02] p-4 border border-white/5">
                        <p className="text-xs text-white uppercase tracking-wider mb-1">{h.title}</p>
                        <p className="text-[10px] text-white/40">{h.desc}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Links Block */}
            <div
              onClick={() => handleBlockClick('links')}
              className={`
                bg-[#141414] border border-white/5 overflow-hidden relative cursor-pointer group transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]
                ${activeBlock === 'links' ? 'flex-[3]' : 'flex-[1] hover:bg-[#1a1a1a]'}
              `}
            >
              <div className="absolute inset-0 p-6 flex flex-col">
                <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-4">Network</span>
                {activeBlock === 'links' && (
                  <div className="animate-fade-in-up mt-auto flex flex-col gap-3">
                    {CONNECT_DATA.links.items.map((l, i) => (
                      <a key={i} href={l.href} target="_blank" rel="noreferrer" className="flex items-center justify-between border-b border-white/10 pb-2 hover:border-white/50 transition-colors">
                        <span className="text-sm font-jost text-white">{l.label.split('/')[0]}</span>
                        <ExternalLink className="w-3 h-3 text-white/50" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Switch Layout - Engraved Intersection Crosshair */}
        {/* We place this absolute center to act as the master toggle */}
        <div
          onClick={(e) => { e.stopPropagation(); onSwitchLayout(); }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center cursor-pointer group z-50 bg-[#0a0a0a] rounded-full border border-white/5 hover:border-white/30 transition-colors"
        >
          <div className="relative w-4 h-4">
            <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-white/30 group-hover:bg-white transition-colors" />
            <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-white/30 group-hover:bg-white transition-colors" />
          </div>
        </div>

      </div>

    </div>
  );

};
