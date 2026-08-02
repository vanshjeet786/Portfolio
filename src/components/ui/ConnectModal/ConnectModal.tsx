import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ExternalLink } from 'lucide-react';
import { SoundEngine } from '@/utils/SoundEngine';
import { CONNECT_DATA } from './ConnectData';

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConnectModal: React.FC<ConnectModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [activeBlock, setActiveBlock] = useState<string>('profile');

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', display: 'flex' }
      );
    } else {
      gsap.to(modalRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power3.inOut',
        onComplete: () => {
          if (modalRef.current) modalRef.current.style.display = 'none';
        },
      });
    }
  }, [isOpen]);

  const handleBlockClick = (id: string) => {
    if (activeBlock !== id) {
      SoundEngine.playClick();
      setActiveBlock(id);
    }
  };

  return (
    <div
      ref={modalRef}
      style={{ display: 'none' }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-auto"
    >
      {/* Background Overlay */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        onClick={() => {
          SoundEngine.playClick();
          onClose();
        }}
      />

      {/* Modal Container */}
      <div className="relative w-full h-full max-w-[1600px] bg-transparent rounded-sm overflow-hidden flex flex-col shadow-2xl">
        {/* Global Minimal Close Button */}
        <button
          onMouseEnter={() => SoundEngine.playHover()}
          onClick={() => {
            SoundEngine.playClick();
            onClose();
          }}
          className="absolute top-8 right-8 z-[100] group w-12 h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 transition-all duration-300 mix-blend-difference cursor-pointer"
          aria-label="Close"
        >
          <div className="relative w-4 h-4">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white rotate-45 group-hover:rotate-90 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white -rotate-45 group-hover:rotate-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" />
          </div>
        </button>

        {/* Dynamic Grid Layout Area */}
        <div className="flex-1 relative overflow-hidden w-full h-full rounded-sm">
          <div className="w-full h-full bg-[#0a0a0a] p-6 md:p-12 relative flex flex-col">
            {/* Main Grid Container */}
            <div className="flex-1 w-full flex flex-col md:flex-row gap-6 mt-8 md:mt-12 transition-all duration-700 ease-[cubic-bezier(0.87,0,0.13,1)]">
              {/* Profile Block */}
              <div
                onClick={() => handleBlockClick('profile')}
                className={`
                  relative overflow-hidden cursor-pointer group transition-all duration-700 ease-[cubic-bezier(0.87,0,0.13,1)] bg-[#141414]
                  ${activeBlock === 'profile' ? 'flex-[5] md:flex-[5]' : 'flex-[1] md:flex-[1] hover:bg-[#1a1a1a]'}
                `}
              >
                {activeBlock === 'profile' && (
                  <div className="absolute inset-0">
                    <img
                      src={CONNECT_DATA.profile.image}
                      alt="Profile"
                      className="w-full h-full object-cover filter grayscale opacity-40 mix-blend-luminosity scale-105 animate-slow-pan"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
                  </div>
                )}

                <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end pointer-events-none">
                  <div
                    className={`transition-opacity duration-500 ${activeBlock === 'profile' ? 'opacity-100' : 'opacity-0 md:opacity-100'}`}
                  >
                    <h1
                      className={`font-jost uppercase transition-all duration-700 tracking-tight leading-none ${activeBlock === 'profile' ? 'text-6xl md:text-8xl text-white font-light mb-4' : 'text-2xl md:text-3xl text-white/40 group-hover:text-white/80'}`}
                    >
                      {activeBlock === 'profile' ? CONNECT_DATA.profile.name : 'Identity'}
                    </h1>
                    {activeBlock === 'profile' && (
                      <p className="text-lg md:text-base font-lexend text-white/60 tracking-widest uppercase">
                        {CONNECT_DATA.profile.title}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Stack */}
              <div
                className={`flex flex-col gap-6 transition-all duration-700 ease-[cubic-bezier(0.87,0,0.13,1)] ${activeBlock === 'profile' ? 'flex-[2]' : 'flex-[5]'}`}
              >
                {/* About Block */}
                <div
                  onClick={() => handleBlockClick('about')}
                  className={`
                    relative overflow-hidden cursor-pointer group transition-all duration-700 ease-[cubic-bezier(0.87,0,0.13,1)] bg-[#141414]
                    ${activeBlock === 'about' ? 'flex-[5]' : 'flex-[1] hover:bg-[#1a1a1a]'}
                  `}
                >
                  <div
                    className={`absolute inset-0 flex flex-col ${activeBlock === 'about' ? 'p-8 md:p-14 overflow-y-auto custom-scrollbar' : 'p-8 md:p-12 justify-end'}`}
                  >
                    {!activeBlock.includes('about') && (
                      <h2 className="text-2xl md:text-3xl font-jost uppercase text-white/40 group-hover:text-white/80 transition-colors">
                        About
                      </h2>
                    )}

                    {activeBlock === 'about' && (
                      <div className="animate-fade-in-up flex flex-col justify-center w-full py-4">
                        <div className="flex items-center gap-3 mb-6">
                          <span className="text-s uppercase tracking-[0.3em] font-china text-[#c8a68a]">
                            About
                          </span>
                          <div className="h-[1px] flex-1 bg-gradient-to-r from-white/20 to-transparent" />
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-light font-jost text-white mb-8 uppercase leading-tight tracking-tight">
                          {CONNECT_DATA.about.headline}
                        </h2>
                        <div className="flex flex-col gap-5 mb-10 max-w-8xl">
                          {CONNECT_DATA.about.paragraphs.map((p, i) => (
                            <p key={i} className="text-base md:text-lg text-white/75 font-light font-jost leading-relaxed">
                              {p}
                            </p>
                          ))}
                        </div>
                        {'tags' in CONNECT_DATA.about && Array.isArray((CONNECT_DATA.about as { tags?: Array<{ label: string; icon: React.ComponentType<{ className?: string }> }> }).tags) && (
                          <div className="flex flex-wrap gap-3 pt-6 border-t border-white/10">
                            {(CONNECT_DATA.about as { tags: Array<{ label: string; icon: React.ComponentType<{ className?: string }> }> }).tags.map((t, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-2.5 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-white/60 uppercase tracking-widest"
                              >
                                <t.icon className="w-3.5 h-3.5 text-[#c8a68a] flex-shrink-0" />
                                <span>{t.label}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Split */}
                <div
                  className={`flex flex-row gap-6 transition-all duration-700 ease-[cubic-bezier(0.87,0,0.13,1)] ${activeBlock === 'about' ? 'flex-[1]' : 'flex-[4]'}`}
                >
                  {/* Crafts Block */}
                  <div
                    onClick={() => handleBlockClick('crafts')}
                    className={`
                      relative overflow-hidden cursor-pointer group transition-all duration-700 ease-[cubic-bezier(0.87,0,0.13,1)] bg-[#141414]
                      ${activeBlock === 'crafts' ? 'flex-[3]' : 'flex-[1] hover:bg-[#1a1a1a]'}
                    `}
                  >
                    <div
                      className={`absolute inset-0 flex flex-col ${activeBlock === 'crafts' ? 'p-8 md:p-16' : 'p-6 sm:p-8 justify-end items-start'}`}
                    >
                      {!activeBlock.includes('crafts') && (
                        <h2 className="text-lg sm:text-l md:text-2xl font-lato uppercase text-white/40 group-hover:text-white/80 transition-colors tracking-wider whitespace-nowrap">
                          Interests
                        </h2>
                      )}

                      {activeBlock === 'crafts' && (
                        <div className="animate-fade-in-up h-full flex flex-col justify-center">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12">
                            {CONNECT_DATA.hobbies.items.map((h, i) => (
                              <div key={i} className="flex flex-col">
                                <h.icon className="w-6 h-6 text-white/80 mb-4" strokeWidth={1} />
                                <h3 className="text-xl text-white uppercase tracking-wider font-lato mb-3">{h.title}</h3>
                                <p className="text-base text-white/50 font-light leading-relaxed">{h.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Links Block */}
                  <div
                    onClick={() => handleBlockClick('links')}
                    className={`
                      relative overflow-hidden cursor-pointer group transition-all duration-700 ease-[cubic-bezier(0.87,0,0.13,1)] bg-[#141414]
                      ${activeBlock === 'links' ? 'flex-[2]' : 'flex-[1] hover:bg-[#1a1a1a]'}
                    `}
                  >
                    <div
                      className={`absolute inset-0 flex flex-col ${activeBlock === 'links' ? 'p-10 md:p-16' : 'p-6 sm:p-8 justify-end items-start'}`}
                    >
                      {!activeBlock.includes('links') && (
                        <h2 className="text-lg sm:text-xl md:text-2xl font-jost uppercase text-white/40 group-hover:text-white/80 transition-colors tracking-wider whitespace-nowrap">
                          Network
                        </h2>
                      )}

                      {activeBlock === 'links' && (
                        <div className="animate-fade-in-up h-full flex flex-col justify-center gap-8">
                          {CONNECT_DATA.links.items.map((l, i) => (
                            <a
                              key={i}
                              href={l.href}
                              target="_blank"
                              rel="noreferrer"
                              className="group/link flex items-center justify-between border-b border-white/10 pb-4 hover:border-white/50 transition-colors"
                            >
                              <div className="flex items-center gap-4 group-hover/link:translate-x-2 transition-transform duration-500 ease-out">
                                <div className={`relative flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 ${l.hoverBg || 'group-hover/link:bg-white/15 group-hover/link:border-white/40 group-hover/link:scale-110'} transition-all duration-300 ease-out shadow-lg flex-shrink-0`}>
                                  <l.icon size={20} className={`w-5 h-5 text-white/80 ${l.hoverIcon || 'group-hover/link:text-white group-hover/link:scale-110'} transition-all duration-300 flex-shrink-0`} />
                                </div>
                                <span className="text-2xl font-light font-jost text-white">
                                  {l.name}
                                </span>
                              </div>
                              <ExternalLink className="w-5 h-5 text-white/30 group-hover/link:text-white group-hover/link:-translate-y-1 group-hover/link:translate-x-1 transition-all duration-500" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
