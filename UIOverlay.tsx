import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/stores/useStore';
import gsap from 'gsap';
import { TrueFocus } from './ui/TrueFocus';
import { EtherealNetwork } from './ui/EtherealNetwork';
import { SVGNoise } from './ui/SVGNoise';
import { SoundEngine } from '@/utils/SoundEngine';

const NARRATIVE_TEXTS_1 = [
  "You're lost.",
  "We all are.",
  "Personality tests are horoscopes for LinkedIn.",
  "The Compass doesn't ask what you want to be.",
  "It calculates what you already are."
];

const NARRATIVE_TEXTS_2 = [
  "Paper tells a flat story.",
  "We built a system that reads between the lines.",
  "A living graph of human potential.",
  "Not just what they did.",
  "How they think."
];

const NARRATIVE_TEXTS_3 = [
  "Most apps just send text.",
  "They forget the most important part of talking.",
  "Knowing the other person is actually there.",
  "We didn't build a chat app.",
  "We built a place."
];

const NARRATIVE_TEXTS_4 = [
  "Scale breaks everything.",
  "Unless it's built to bend.",
  "Data must flow without friction.",
  "A solid stance.",
  "An unbreakable structure."
];

const NARRATIVE_TEXTS_5 = [
  "Structure is nothing without signal.",
  "Data is useless without intent.",
  "The network is open.",
  "Initiate protocol.",
  "Make contact."
];

export const UIOverlay = () => {
  const activeScene = useStore((state) => state.activeScene);
  const progress = useStore((state) => state.progress);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayedScene, setDisplayedScene] = useState(activeScene);
  
  const [isCompassOpen, setIsCompassOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const narrativeRef = useRef<HTMLDivElement>(null);

  const [isSkillometerOpen, setIsSkillometerOpen] = useState(false);
  const skillometerModalRef = useRef<HTMLDivElement>(null);
  const skillometerTriggerRef = useRef<HTMLButtonElement>(null);

  const [isStanceOpen, setIsStanceOpen] = useState(false);
  const stanceModalRef = useRef<HTMLDivElement>(null);
  const stanceTriggerRef = useRef<HTMLButtonElement>(null);

  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const terminalModalRef = useRef<HTMLDivElement>(null);
  const terminalTriggerRef = useRef<HTMLButtonElement>(null);

  // Scene transitions
  useEffect(() => {
    if (!containerRef.current || displayedScene === activeScene) return;

    if (activeScene !== 1 && isCompassOpen) {
      setTimeout(() => setIsCompassOpen(false), 0);
    }
    
    if (activeScene !== 3 && isSkillometerOpen) {
      setTimeout(() => setIsSkillometerOpen(false), 0);
    }
    
    if (activeScene !== 7 && isStanceOpen) {
      setTimeout(() => setIsStanceOpen(false), 0);
    }
    
    if (activeScene !== 9 && isTerminalOpen) {
      setTimeout(() => setIsTerminalOpen(false), 0);
    }

    // Play Deep Sub-bass Transition Sound
    SoundEngine.playTransition();

    const currentCard = containerRef.current.firstElementChild;
    if (currentCard) {
      gsap.to(currentCard, {
        opacity: 0,
        y: 20,
        scale: 0.98,
        duration: 0.8,
        ease: 'power3.inOut',
        onComplete: () => {
          setDisplayedScene(activeScene);
          requestAnimationFrame(() => {
            const newCard = containerRef.current?.firstElementChild;
            if (newCard) {
              gsap.fromTo(newCard, 
                { opacity: 0, y: -20, scale: 0.98 },
                { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'expo.out' }
              );
            }
          });
        }
      });
    }
  }, [activeScene, displayedScene, isCompassOpen, isSkillometerOpen, isStanceOpen, isTerminalOpen]);

  // Compass Modal Animation Effect
  useEffect(() => {
    if (displayedScene !== 1) return;
    if (isCompassOpen) {
      gsap.to(triggerRef.current, { opacity: 0, x: -20, duration: 0.4, ease: "power2.in" });
      gsap.fromTo(modalRef.current, 
        { opacity: 0, x: 40, clipPath: 'circle(0% at center)' },
        { opacity: 1, x: 0, clipPath: 'circle(150% at center)', duration: 1.2, ease: "expo.out", display: 'block' }
      );
    } else {
      gsap.to(modalRef.current, { 
        opacity: 0, x: 40, clipPath: 'circle(0% at center)', duration: 0.6, ease: "power3.inOut",
        onComplete: () => {
          if (modalRef.current) modalRef.current.style.display = 'none';
        }
      });
      gsap.fromTo(triggerRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.8, ease: "expo.out", delay: 0.3 }
      );
    }
  }, [isCompassOpen, displayedScene]);

  // Skillometer Modal Animation Effect
  useEffect(() => {
    if (displayedScene !== 3) return;
    if (isSkillometerOpen) {
      gsap.to(skillometerTriggerRef.current, { opacity: 0, y: -20, duration: 0.4, ease: "power2.in" });
      gsap.fromTo(skillometerModalRef.current, 
        { opacity: 0, y: 40, clipPath: 'circle(0% at center)' },
        { opacity: 1, y: 0, clipPath: 'circle(150% at center)', duration: 1.2, ease: "expo.out", display: 'block' }
      );
    } else {
      gsap.to(skillometerModalRef.current, { 
        opacity: 0, y: 40, clipPath: 'circle(0% at center)', duration: 0.6, ease: "power3.inOut",
        onComplete: () => {
          if (skillometerModalRef.current) skillometerModalRef.current.style.display = 'none';
        }
      });
      gsap.fromTo(skillometerTriggerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "expo.out", delay: 0.3 }
      );
    }
  }, [isSkillometerOpen, displayedScene]);

  // Stance Modal Animation Effect
  useEffect(() => {
    if (displayedScene !== 7) return;
    if (isStanceOpen) {
      gsap.to(stanceTriggerRef.current, { opacity: 0, scale: 0.8, duration: 0.4, ease: "power2.in" });
      gsap.fromTo(stanceModalRef.current, 
        { opacity: 0, y: -40, clipPath: 'circle(0% at center)' },
        { opacity: 1, y: 0, clipPath: 'circle(150% at center)', duration: 1.2, ease: "expo.out", display: 'block' }
      );
    } else {
      gsap.to(stanceModalRef.current, { 
        opacity: 0, y: -40, clipPath: 'circle(0% at center)', duration: 0.6, ease: "power3.inOut",
        onComplete: () => {
          if (stanceModalRef.current) stanceModalRef.current.style.display = 'none';
        }
      });
      gsap.fromTo(stanceTriggerRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "expo.out", delay: 0.3 }
      );
    }
  }, [isStanceOpen, displayedScene]);

  // Terminal Modal Animation Effect
  useEffect(() => {
    if (displayedScene !== 9) return;
    if (isTerminalOpen) {
      gsap.to(terminalTriggerRef.current, { opacity: 0, scale: 0.9, duration: 0.4, ease: "power2.in" });
      gsap.fromTo(terminalModalRef.current, 
        { opacity: 0, scale: 0.95, filter: 'blur(10px)' },
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.2, ease: "expo.out", display: 'flex' }
      );
    } else {
      gsap.to(terminalModalRef.current, { 
        opacity: 0, scale: 0.95, filter: 'blur(10px)', duration: 0.6, ease: "power3.inOut",
        onComplete: () => {
          if (terminalModalRef.current) terminalModalRef.current.style.display = 'none';
        }
      });
      gsap.fromTo(terminalTriggerRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "expo.out", delay: 0.3 }
      );
    }
  }, [isTerminalOpen, displayedScene]);

  // Scroll-driven Narrative Text Engine
  const [activeNarrativeText, setActiveNarrativeText] = useState("");
  useEffect(() => {
    let currentText = "";
    // Adjusted bounds for 4 voids over 8 scenes total
    if (progress > 0.15 && progress < 0.25) {
      const p = (progress - 0.15) / 0.1;
      const idx = Math.max(0, Math.min(NARRATIVE_TEXTS_1.length - 1, Math.floor(p * NARRATIVE_TEXTS_1.length)));
      currentText = NARRATIVE_TEXTS_1[idx];
    } else if (progress > 0.35 && progress < 0.45) {
      const p = (progress - 0.35) / 0.1;
      const idx = Math.max(0, Math.min(NARRATIVE_TEXTS_2.length - 1, Math.floor(p * NARRATIVE_TEXTS_2.length)));
      currentText = NARRATIVE_TEXTS_2[idx];
    } else if (progress > 0.55 && progress < 0.65) {
      const p = (progress - 0.55) / 0.1;
      const idx = Math.max(0, Math.min(NARRATIVE_TEXTS_3.length - 1, Math.floor(p * NARRATIVE_TEXTS_3.length)));
      currentText = NARRATIVE_TEXTS_3[idx];
    } else if (progress > 0.70 && progress < 0.78) {
      const p = (progress - 0.70) / 0.08;
      const idx = Math.max(0, Math.min(NARRATIVE_TEXTS_4.length - 1, Math.floor(p * NARRATIVE_TEXTS_4.length)));
      currentText = NARRATIVE_TEXTS_4[idx];
    } else if (progress > 0.85 && progress < 0.95) {
      const p = (progress - 0.85) / 0.1;
      const idx = Math.max(0, Math.min(NARRATIVE_TEXTS_5.length - 1, Math.floor(p * NARRATIVE_TEXTS_5.length)));
      currentText = NARRATIVE_TEXTS_5[idx];
    }

    if (currentText !== activeNarrativeText) {
      setTimeout(() => setActiveNarrativeText(currentText), 0);
    }
  }, [progress, activeNarrativeText]);

  return (
    <div className="fixed top-0 left-0 w-full h-full z-10 pointer-events-none flex flex-col">
      
      {/* Dynamic Content Container */}
      <div ref={containerRef} className="flex-1 w-full h-full flex items-center justify-center p-8 md:p-16">
        
        {/* SCENE 0: HOME */}
        {displayedScene === 0 && (
          <div className="w-full flex justify-center items-center pointer-events-auto h-full">
            <div className="relative inline-flex items-center justify-center p-12">
              <TrueFocus 
                text="VANSHJEET" 
                splitBy="letter" 
                animationSpeed={0.8}
                className="text-5xl md:text-8xl font-light tracking-[0.25em] text-white z-0"
              />
              <div 
                className="absolute inset-0 rounded-2xl pointer-events-none z-10 shadow-2xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.01)',
                  backdropFilter: 'blur(4px)',
                  WebkitBackdropFilter: 'blur(4px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: 'inset 0 0 30px rgba(255,255,255,0.02)',
                  transform: 'scale(1.15)'
                }}
              >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>
            </div>
          </div>
        )}

        {/* SCENE 1: CAREER COMPASS */}
        {displayedScene === 1 && (
          <div className="w-full h-full flex justify-end items-end relative pointer-events-auto pb-12 pr-12">
            <button
              ref={triggerRef}
              onMouseEnter={() => SoundEngine.playHover()}
              onClick={() => { SoundEngine.playClick(); setIsCompassOpen(true); }}
              className="absolute left-16 top-1/2 -translate-y-1/2 group flex items-center gap-6 cursor-none"
            >
              <div className="relative w-12 h-12 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute w-full h-[1px] bg-white/40 group-hover:scale-x-150 transition-transform duration-500" />
                <div className="absolute w-[1px] h-full bg-white/40 group-hover:scale-y-150 transition-transform duration-500" />
                <div className="w-2 h-2 bg-[#00f0ff] rounded-full shadow-[0_0_15px_#00f0ff] group-hover:scale-150 transition-transform duration-500" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] tracking-[0.3em] uppercase text-white/50 font-mono mb-1">Target Acquired</span>
                <span className="text-xs tracking-[0.2em] uppercase text-white group-hover:text-[#00f0ff] transition-colors duration-500">
                  Access Data
                </span>
              </div>
            </button>

            <div ref={modalRef} style={{ display: 'none' }} className="fixed inset-0 w-full h-full flex flex-col justify-center items-center bg-[#050505]/80 backdrop-blur-3xl border border-white/10 rounded-none p-12 overflow-hidden shadow-2xl">
              <SVGNoise />
              <div className="flex justify-between items-start mb-16">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.4em] text-[#00f0ff] font-mono">Project 01</span>
                  <h2 className="text-4xl md:text-6xl font-light mt-4 text-white tracking-tight">Career Compass</h2>
                </div>
                <button 
                  onMouseEnter={() => SoundEngine.playHover()}
                  onClick={() => { SoundEngine.playClick(); setIsCompassOpen(false); }}
                  className="w-10 h-10 flex items-center justify-center border border-white/20 hover:border-[#00f0ff] rounded-none transition-colors cursor-none group relative overflow-hidden"
                >
                  <div className="w-full h-full bg-[#00f0ff]/10 absolute bottom-0 left-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <div className="w-4 h-[1px] bg-white rotate-45 absolute" />
                  <div className="w-4 h-[1px] bg-white -rotate-45 absolute" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/10 pt-8">
                <div>
                  <h3 className="text-xs tracking-[0.2em] text-white/50 uppercase font-mono mb-4">Classification</h3>
                  <p className="text-sm text-white font-light tracking-wide">Decision Support System</p>
                </div>
                <div>
                  <h3 className="text-xs tracking-[0.2em] text-white/50 uppercase font-mono mb-4">Synopsis</h3>
                  <p className="text-sm text-gray-400 leading-relaxed font-light">
                    Conventional guidance relies on static questionnaires. Career Compass normalizes cognitive traits to establish true direction. A deeply integrated neural matrix mapping the psyche.
                  </p>
                  <button 
                    onMouseEnter={() => SoundEngine.playHover()}
                    onClick={() => SoundEngine.playClick()}
                    className="mt-8 px-6 py-3 text-[10px] tracking-[0.3em] uppercase text-[#00f0ff] border border-[#00f0ff]/30 hover:bg-[#00f0ff]/10 transition-colors duration-300 cursor-none"
                  >
                    Initialize Matrix
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* SCENE 2: NARRATIVE VOID */}
        {displayedScene === 2 && <div className="w-full h-full" />}

        {/* SCENE 3: SKILLOMETER */}
        {displayedScene === 3 && (
          <div className="w-full h-full flex justify-center items-end relative pointer-events-auto pb-12">
            <button
              ref={skillometerTriggerRef}
              onMouseEnter={() => SoundEngine.playHover()}
              onClick={() => { SoundEngine.playClick(); setIsSkillometerOpen(true); }}
              className="absolute right-16 top-16 group flex flex-col items-center gap-4 cursor-none"
            >
              <div className="w-[1px] h-16 bg-gradient-to-b from-transparent to-white/50 group-hover:h-24 transition-all duration-500" />
              <div className="w-8 h-8 rounded-full border border-[#f59e0b]/50 flex items-center justify-center group-hover:border-[#f59e0b] group-hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all duration-500">
                <div className="w-1.5 h-1.5 bg-[#f59e0b] rounded-full group-hover:scale-150 transition-transform duration-300" />
              </div>
              <span className="text-[9px] tracking-[0.4em] uppercase text-white/50 font-mono mt-2 group-hover:text-[#f59e0b] transition-colors duration-500" style={{ writingMode: 'vertical-rl' }}>
                Initiate Scan
              </span>
            </button>

            <div ref={skillometerModalRef} style={{ display: 'none' }} className="fixed inset-0 w-full h-full flex flex-col justify-center items-center bg-[#050505]/80 backdrop-blur-3xl border border-white/10 rounded-none p-12 overflow-hidden shadow-[0_30px_100px_rgba(245,158,11,0.1)]">
              <SVGNoise />
              <div className="absolute -top-10 -left-10 text-[180px] font-bold text-white/5 pointer-events-none select-none tracking-tighter">02</div>
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-12">
                <div className="flex-1">
                  <span className="text-[10px] uppercase tracking-[0.4em] text-[#f59e0b] font-mono">Project 02</span>
                  <h2 className="text-4xl md:text-5xl font-light mt-4 text-white tracking-tight">Skillometer</h2>
                  <h3 className="text-xs tracking-[0.2em] text-white/40 uppercase font-mono mt-2">The Living System</h3>
                  <div className="mt-12 w-12 h-[1px] bg-[#f59e0b]/50" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300 leading-relaxed font-light mt-2">
                    An architectural graph modeling candidate signals, capability matrices, and alignment scores dynamically. True alignment emerges not from scores, but from relationships within the ecosystem.
                  </p>
                  <div className="mt-10 flex items-center gap-6">
                    <button 
                      onMouseEnter={() => SoundEngine.playHover()}
                      onClick={() => SoundEngine.playClick()}
                      className="px-8 py-3 text-[10px] tracking-[0.3em] uppercase text-[#f59e0b] border border-[#f59e0b]/30 hover:bg-[#f59e0b]/10 transition-colors duration-300 cursor-none"
                    >
                      View Architecture
                    </button>
                  </div>
                </div>
                <button 
                  onMouseEnter={() => SoundEngine.playHover()}
                  onClick={() => { SoundEngine.playClick(); setIsSkillometerOpen(false); }}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors cursor-none group ml-auto"
                >
                  <div className="w-4 h-[1px] bg-white rotate-45 absolute group-hover:rotate-135 transition-transform duration-500" />
                  <div className="w-4 h-[1px] bg-white -rotate-45 absolute group-hover:-rotate-135 transition-transform duration-500" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SCENE 4: NARRATIVE VOID 2 */}
        {displayedScene === 4 && <div className="w-full h-full" />}

        {/* SCENE 5: ETHEREAL NETWORK (Exiles + Leaderboard) */}
        {/* We keep this mounted when displayedScene is 5 */}
        <EtherealNetwork isActive={displayedScene === 5} />

        {/* SCENE 6: NARRATIVE VOID 3 */}
        {displayedScene === 6 && <div className="w-full h-full" />}

        {/* SCENE 7: STANCE */}
        {displayedScene === 7 && (
          <div className="w-full h-full flex justify-center items-end relative pointer-events-auto pb-12">
            
            {/* Minimalist Floating Crosshair Trigger */}
            <button
              ref={stanceTriggerRef}
              onMouseEnter={() => SoundEngine.playHover()}
              onClick={() => { SoundEngine.playClick(); setIsStanceOpen(true); }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 group cursor-none w-24 h-24 flex items-center justify-center"
            >
              <div className="absolute w-[1px] h-12 bg-white/30 group-hover:h-24 transition-all duration-500" />
              <div className="absolute w-12 h-[1px] bg-white/30 group-hover:w-24 transition-all duration-500" />
              <div className="absolute w-6 h-6 border border-white/50 rotate-45 group-hover:rotate-90 group-hover:scale-150 transition-all duration-700" />
              <div className="absolute top-full mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center">
                <span className="text-[9px] uppercase tracking-[0.4em] font-mono text-white/80">Analyze</span>
                <span className="text-[9px] uppercase tracking-[0.4em] font-mono text-white/50">Structure</span>
              </div>
            </button>

            {/* Monolithic Data Slate Modal (Similar to Skillometer but matching the Monolith design) */}
            <div ref={stanceModalRef} style={{ display: 'none' }} className="fixed inset-0 w-full h-full flex flex-col justify-center items-center bg-[#050505]/80 backdrop-blur-3xl border border-white/10 rounded-none p-12 overflow-hidden shadow-[0_30px_100px_rgba(225,29,72,0.1)]">
              <SVGNoise />
              {/* Massive background typography matching the monolith vibe */}
              <div className="absolute -top-12 -left-4 text-[240px] font-bold text-[#e11d48]/5 pointer-events-none select-none tracking-tighter">05</div>
              
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-16">
                <div className="flex-1">
                  <span className="text-[10px] uppercase tracking-[0.4em] text-[#e11d48] font-mono">Project 05 // Structural Engine</span>
                  <h2 className="text-5xl md:text-7xl font-light mt-6 text-white tracking-tight uppercase">Stance</h2>
                  <div className="mt-12 w-24 h-[2px] bg-gradient-to-r from-[#e11d48] to-transparent" />
                </div>
                
                <div className="flex-1 pt-4">
                  <h3 className="text-xs tracking-[0.2em] text-white/40 uppercase font-mono mb-4">Integrity Matrix</h3>
                  <p className="text-sm text-gray-400 leading-relaxed font-light mb-8">
                    Stance was built to ensure perfect alignment in highly rigid, structured data pipelines. It operates like a glass monolith: completely transparent, incredibly dense, and unbreakable under immense load.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="border border-white/5 p-4 hover:border-white/20 transition-colors duration-300">
                      <span className="text-[9px] uppercase tracking-[0.3em] text-[#e11d48] font-mono block mb-2">Protocol</span>
                      <span className="text-xs text-white/80 font-light">GraphQL Over WS</span>
                    </div>
                    <div className="border border-white/5 p-4 hover:border-white/20 transition-colors duration-300">
                      <span className="text-[9px] uppercase tracking-[0.3em] text-[#e11d48] font-mono block mb-2">Resilience</span>
                      <span className="text-xs text-white/80 font-light">99.999% Uptime</span>
                    </div>
                  </div>
                </div>

                <button 
                  onMouseEnter={() => SoundEngine.playHover()}
                  onClick={() => { SoundEngine.playClick(); setIsStanceOpen(false); }}
                  className="w-12 h-12 flex items-center justify-center border border-white/20 hover:bg-[#e11d48]/10 hover:border-[#e11d48] transition-all cursor-none group ml-auto"
                >
                  <div className="w-5 h-[1px] bg-white rotate-45 absolute group-hover:rotate-135 transition-transform duration-500" />
                  <div className="w-5 h-[1px] bg-white -rotate-45 absolute group-hover:-rotate-135 transition-transform duration-500" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SCENE 8: NARRATIVE VOID 4 */}
        {displayedScene === 8 && <div className="w-full h-full" />}

        {/* SCENE 9: THE TERMINAL (OUTRO) */}
        {displayedScene === 9 && (
          <div className="w-full h-full flex justify-center items-center relative pointer-events-auto">
            
            <button
              ref={terminalTriggerRef}
              onMouseEnter={() => SoundEngine.playHover()}
              onClick={() => { SoundEngine.playClick(); setIsTerminalOpen(true); }}
              className="group cursor-none flex flex-col items-center justify-center relative z-20"
            >
              <div className="relative w-32 h-32 rounded-full border border-white/20 flex items-center justify-center overflow-hidden group-hover:border-[#00f0ff]/50 transition-colors duration-700">
                <div className="absolute inset-0 bg-[#00f0ff]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="w-2 h-2 bg-white rounded-full group-hover:scale-[20] transition-transform duration-700 ease-in-out group-hover:bg-[#00f0ff]/20" />
                <span className="absolute text-[8px] uppercase tracking-[0.4em] font-mono text-white/50 group-hover:text-white transition-colors duration-300">
                  Connect
                </span>
              </div>
            </button>

            <div 
              ref={terminalModalRef} 
              style={{ display: 'none' }} 
              className="absolute inset-0 z-30 flex-col items-center justify-center bg-[#050505]/95 backdrop-blur-3xl border border-white/5 p-12"
            >
              <button 
                onMouseEnter={() => SoundEngine.playHover()}
                onClick={() => { SoundEngine.playClick(); setIsTerminalOpen(false); }}
                className="absolute top-12 right-12 w-12 h-12 flex items-center justify-center hover:bg-white/5 transition-colors cursor-none group"
              >
                <div className="w-5 h-[1px] bg-white rotate-45 absolute group-hover:rotate-135 transition-transform duration-500" />
                <div className="w-5 h-[1px] bg-white -rotate-45 absolute group-hover:-rotate-135 transition-transform duration-500" />
              </button>

              <div className="text-center mb-16">
                <h2 className="text-6xl md:text-8xl font-light text-white tracking-tighter uppercase mb-4">
                  End of Transmission
                </h2>
                <div className="w-24 h-[1px] bg-[#00f0ff]/50 mx-auto" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
                {[
                  { name: 'GitHub', label: 'git://vanshjeet', color: '#ffffff' },
                  { name: 'LinkedIn', label: 'net://vanshjeet', color: '#0a66c2' },
                  { name: 'Email', label: 'mailto://connect', color: '#00f0ff' }
                ].map((link, i) => (
                  <a 
                    key={i}
                    href="#"
                    onMouseEnter={() => SoundEngine.playHover()}
                    onClick={(e) => { e.preventDefault(); SoundEngine.playClick(); }}
                    className="group relative border border-white/10 p-8 hover:border-white/30 transition-all duration-500 cursor-none overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                    <span className="relative z-10 text-[10px] uppercase tracking-[0.4em] text-white/50 font-mono block mb-4">
                      {link.name}
                    </span>
                    <span 
                      className="relative z-10 text-sm md:text-base font-light tracking-widest transition-colors duration-300"
                      style={{ color: link.color }}
                    >
                      {link.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Global Narrative Overlay (Fades in editor text based on scroll) */}
      <div 
        ref={narrativeRef}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center w-full max-w-4xl px-8 z-10"
      >
        <h2 
          className="text-4xl md:text-6xl font-light text-white tracking-tight"
          style={{
            opacity: activeNarrativeText ? 1 : 0,
            transform: `scale(${activeNarrativeText ? 1 : 0.95}) translateY(${activeNarrativeText ? '0px' : '20px'})`,
            filter: `blur(${activeNarrativeText ? '0px' : '10px'})`,
            transition: 'opacity 0.8s ease, transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), filter 1s ease'
          }}
        >
          {activeNarrativeText}
        </h2>
      </div>
      
      {/* Global Scroll Indicator */}
      <div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center transition-opacity duration-500 z-10"
        style={{ opacity: (isCompassOpen || isSkillometerOpen || isStanceOpen || isTerminalOpen || activeNarrativeText !== "") ? 0 : 0.3 }}
      >
        <span className="text-[9px] uppercase tracking-[0.4em] mb-4 font-mono text-white">Scroll</span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent"></div>
      </div>
    </div>
  );
};
