import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/stores/useStore';
import gsap from 'gsap';
import { TrueFocus } from './ui/TrueFocus';
import { EtherealNetwork } from './ui/EtherealNetwork';
import { SVGNoise } from './ui/SVGNoise';
import { SoundEngine } from '@/utils/SoundEngine';

const NARRATIVE_TEXTS_1 = [
  "You're lost. Maybe?",
  "I Ddeveloped a 6-LAYER AI Career Counsellor",
  "The priority was to ensure it doesn't assess",
  "Using RIASEC, Big 5, MBTI, Multiple Presonality",
  "And a few open ended questions to undertsnad someone better"
];

const NARRATIVE_TEXTS_2 = [
  "This one Judges",
  "I built a 4-layer soft skills assessment test",
  "The objective was to be accurate",
  "Very Interesting project",
  "Identifies the thinking patterns of a person"
];

const NARRATIVE_TEXTS_3 = [
  "I designed a chat app and a Leaderboard Platform",
  "As a project  for a company.",
  "Priority was Database design",
  "Idempotency",
  "And API functions calls using CURL"
];

const NARRATIVE_TEXTS_4 = [
  "These are exact models",
  "I used to design a few webpages ",
  "for Stance Health",
  "Priority was SEO"
];

const NARRATIVE_TEXTS_5 = [
  "Hello!!!",
  "I am Vansh",
  "Would love to connect!",
];

const SCENE_LABELS = [
  'Home',
  'Compass',
  'WHERE AM I?',
  'Skillometer',
  'WHERE AM I NOW?',
  'Mini Projects',
  'WHERE AM I AGAIN?',
  'Stance',
  'I THINK THIS IS THE END',
  'Vansh'
];

const MODAL_FRAME_CLASS =
  'fixed inset-4 md:inset-8 z-30 flex flex-col bg-[#050505]/92 backdrop-blur-3xl border border-white/10 rounded-2xl p-8 md:p-12 overflow-y-auto custom-scrollbar shadow-[0_30px_100px_rgba(0,0,0,0.65)]';

const CLOSE_BUTTON_CLASS =
  'absolute top-6 right-6 md:top-8 md:right-8 w-11 h-11 flex items-center justify-center border border-white/15 hover:border-white/40 hover:bg-white/5 transition-all cursor-none group rounded-full';

export const UIOverlay = () => {
  const activeScene = useStore((state) => state.activeScene);
  const setModalOpen = useStore((state) => state.setModalOpen);
  const progress = useStore((state) => state.progress);
  const jumpToScene = useStore((state) => state.jumpToScene);
  
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
      setTimeout(() => { setIsCompassOpen(false); setModalOpen(false); }, 0);
    }
    
    if (activeScene !== 3 && isSkillometerOpen) {
      setTimeout(() => { setIsSkillometerOpen(false); setModalOpen(false); }, 0);
    }
    
    if (activeScene !== 7 && isStanceOpen) {
      setTimeout(() => { setIsStanceOpen(false); setModalOpen(false); }, 0);
    }
    
    if (activeScene !== 9 && isTerminalOpen) {
      setTimeout(() => { setIsTerminalOpen(false); setModalOpen(false); }, 0);
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
  }, [activeScene, displayedScene, isCompassOpen, isSkillometerOpen, isStanceOpen, isTerminalOpen, setModalOpen]);

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
      gsap.to(stanceTriggerRef.current, { opacity: 0, scale: 0.8, duration: 0.7, ease: "power2.in" });
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


  useEffect(() => {
    const closeActiveModal = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (isCompassOpen) setIsCompassOpen(false);
      if (isSkillometerOpen) setIsSkillometerOpen(false);
      if (isStanceOpen) setIsStanceOpen(false);
      if (isTerminalOpen) setIsTerminalOpen(false);
      setModalOpen(false);
    };

    window.addEventListener('keydown', closeActiveModal);
    return () => window.removeEventListener('keydown', closeActiveModal);
  }, [isCompassOpen, isSkillometerOpen, isStanceOpen, isTerminalOpen, setModalOpen]);

  // Scroll-driven Narrative Text Engine (Flat single-line layout with letter-by-letter scroll fade)
  const [activeNarrativeText, setActiveNarrativeText] = useState("");
  const [narrativeSubP, setNarrativeSubP] = useState(0);

  useEffect(() => {
    let currentText = "";
    let subP = 0;

    const calculateNarrativeState = (
      startP: number,
      endP: number,
      texts: string[]
    ) => {
      if (progress >= startP && progress <= endP) {
        const totalDuration = endP - startP;
        const lineDuration = totalDuration / texts.length;
        const relativeP = progress - startP;
        const idx = Math.max(0, Math.min(texts.length - 1, Math.floor(relativeP / lineDuration)));
        currentText = texts[idx];
        const lineStartP = startP + idx * lineDuration;
        subP = Math.max(0, Math.min(1, (progress - lineStartP) / lineDuration));
        return true;
      }
      return false;
    };

    // Check each narrative void section
    const active =
      calculateNarrativeState(0.15, 0.29, NARRATIVE_TEXTS_1) ||
      calculateNarrativeState(0.37, 0.51, NARRATIVE_TEXTS_2) ||
      calculateNarrativeState(0.59, 0.73, NARRATIVE_TEXTS_3) ||
      calculateNarrativeState(0.81, 0.93, NARRATIVE_TEXTS_4) ||
      calculateNarrativeState(0.93, 0.99, NARRATIVE_TEXTS_5);

    if (!active) {
      currentText = "";
      subP = 0;
    }

    setActiveNarrativeText(currentText);
    setNarrativeSubP(subP);
  }, [progress]);

  return (
    <div className="fixed top-0 left-0 w-full h-full z-10 pointer-events-none flex flex-col">
      
      {/* Dynamic Content Container */}
      <div ref={containerRef} className="flex-1 w-full h-full flex items-center justify-center p-8 md:p-16">
        
        {/* SCENE 0: HOME */}
        {displayedScene === 0 && (
          <div className="w-full flex justify-center items-center pointer-events-auto h-full">
            <div className="relative inline-flex items-center justify-center p-12">
              <TrueFocus 
                customItems={['SOME', 'WHERE']} 
                splitBy="word" 
                noGap={true}
                animationSpeed={1.8}
                blurAmount={10}
                className="text-5xl md:text-8xl font-jost tracking-[0.25em] text-white z-0"
              />
              <div 
                className="absolute inset-0 rounded-2xl pointer-events-none z-10 shadow-2xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.01)',
                  backdropFilter: 'blur(3px)',
                  WebkitBackdropFilter: 'blur(3px)',
                  border: '1px solid rgba(255, 255, 255, 0.01)',
                  boxShadow: 'inset 0 0 30px rgba(255,255,255,0.02)',
                  transform: 'scale(1.2)'
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
              onClick={() => { SoundEngine.playClick(); { setIsCompassOpen(true); setModalOpen(true); }; }}
              className="absolute left-16 top-1/2 -translate-y-1/2 group flex items-center gap-6 cursor-none"
            >
              <div className="relative w-12 h-12 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute w-full h-[1px] bg-white/40 group-hover:scale-x-150 transition-transform duration-500" />
                <div className="absolute w-[1px] h-full bg-white/40 group-hover:scale-y-150 transition-transform duration-500" />
                <div className="w-2 h-2 bg-[#e8c1a9] rounded-full shadow-[0_0_15px_#00f0ff] group-hover:scale-150 transition-transform duration-500" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] tracking-[0.3em] uppercase text-white/50 font-lexend mb-1">ABOUT PROJECT</span>
                <span className="text-xs tracking-[0.2em] uppercase text-white group-hover:text-[#e8c1a9] transition-colors duration-500">
                  CAREER COMPASS
                </span>
              </div>
            </button>

            <div ref={modalRef} style={{ display: 'none' }} className={`${MODAL_FRAME_CLASS} justify-center items-center`}>
              <SVGNoise />
              <div className="flex justify-between items-start mb-16">
                <div>
                  <span className="text-[14px] uppercase tracking-[0.4em] text-[#ef8532] font-lato">Welcome!</span>
                  <h2 className="text-4xl md:text-6xl font-light mt-4 text-white tracking-tight">Career Compass</h2>
                </div>
                <button 
                  onMouseEnter={() => SoundEngine.playHover()}
                  onClick={() => { SoundEngine.playClick(); { setIsCompassOpen(false); setModalOpen(false); }; }}
                  className={CLOSE_BUTTON_CLASS}
                >
                  <div className="w-full h-full bg-[#ef8532]/10 absolute bottom-0 left-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <div className="w-4 h-[1px] bg-white rotate-45 absolute" />
                  <div className="w-4 h-[1px] bg-white -rotate-45 absolute" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/10 pt-8">
                <div>
                  <h3 className="text-xs tracking-[0.2em] text-white/50 uppercase font-lato mb-4">About</h3>
                  <p className="text-sm text-white font-light tracking-wide">An AI Powered Career Counsellor I built for Skitre.AI.</p>
                </div>
                <div>
                  <h3 className="text-xs tracking-[0.2em] text-white/50 uppercase font-lato mb-4">Stack</h3>
                  <p className="text-sm text-gray-400 leading-relaxed font-jost">
                    React, Supabase, CSS
                  </p>
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
              onClick={() => { SoundEngine.playClick(); { setIsSkillometerOpen(true); setModalOpen(true); }; }}
              className="absolute right-16 top-16 group flex flex-col items-center gap-4 cursor-none"
            >
              <div className="w-[1px] h-16 bg-gradient-to-b from-transparent to-white/50 group-hover:h-24 transition-all duration-500" />
              <div className="w-8 h-8 rounded-full border border-[#f8f7da]/50 flex items-center justify-center group-hover:border-[#f8f7da] group-hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all duration-500">
                <div className="w-1.5 h-1.5 bg-[#f8f7da] rounded-full group-hover:scale-150 transition-transform duration-300" />
              </div>
<span className="text-xs tracking-[0.2em] uppercase text-white group-hover:text-[#e8c1a9] transition-colors duration-500">
                  ABOUT PROJECT
                </span>
              <span className="text-[12px] tracking-[0.4em] uppercase text-white/50 font-lato mt-2 group-hover:text-[#f8f7da] transition-colors duration-500" style={{ writingMode: 'vertical-rl' }}>
                SKILLOMETER
              </span>
            </button>

            <div ref={skillometerModalRef} style={{ display: 'none' }} className={`${MODAL_FRAME_CLASS} justify-center items-center shadow-[0_30px_100px_rgba(245,158,11,0.12)]`}>
              <SVGNoise />
              <div className="absolute -top-10 -left-10 text-[180px] font-bold text-white/5 pointer-events-none select-none tracking-tighter">02</div>
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-12">
                <div className="flex-1">
                  <span className="text-[10px] uppercase tracking-[0.4em] text-[#c8a68a] font-lato">Welcome again!</span>
                  <h2 className="text-4xl md:text-5xl font-jost mt-4 text-white tracking-tight">Skillometer</h2>
                  <h3 className="text-xs tracking-[0.2em] text-white/40 uppercase font-lato mt-2">soft-Skill assessment test</h3>
                  <div className="mt-12 w-12 h-[1px] bg-[#c8a68a]/50" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300 leading-relaxed font-jost mt-2">
                    An architectural graph modeling candidate signals, capability matrices, and alignment scores dynamically. True alignment emerges not from scores, but from relationships within the ecosystem.
                  </p>
                  <div className="mt-10 flex items-center gap-6">
                  </div>
                </div>
                <button 
                  onMouseEnter={() => SoundEngine.playHover()}
                  onClick={() => { SoundEngine.playClick(); { setIsSkillometerOpen(false); setModalOpen(false); }; }}
                  className={`${CLOSE_BUTTON_CLASS} static ml-auto`}
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
          <div className="w-full h-full flex justify-center items-end relative overflow-hidden pointer-events-auto pb-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(200,166,138,0.13),transparent_28%),radial-gradient(circle_at_62%_56%,rgba(127,143,130,0.08),transparent_24%)]" />
            <div className="absolute left-12 top-14 hidden max-w-[18rem] md:block">
            </div>
            
            {/* Anatomical locator trigger */}
            <button
              ref={stanceTriggerRef}
              onMouseEnter={() => SoundEngine.playHover()}
              onClick={() => { SoundEngine.playClick(); { setIsStanceOpen(true); setModalOpen(true); }; }}
              className="absolute left-1/5 top-3/7 -translate-x-1/2 -translate-y-1/2 group cursor-none w-36 h-36 flex items-left justify-left rounded-full"
            >
              <div className="absolute inset-0 rounded-full border border-[#ffe897]/25 bg-black/10 backdrop-blur-[2px] group-hover:border-[#ffe897]/70 group-hover:shadow-[0_0_35px_rgba(200,166,138,0.18)] transition-all duration-700" />
              <div className="absolute w-[1px] h-20 bg-gradient-to-b from-transparent via-[#f4dfc6]/70 to-transparent group-hover:h-32 transition-all duration-500" />
              <div className="absolute w-20 h-[1px] bg-gradient-to-r from-transparent via-[#f4dfc6]/70 to-transparent group-hover:w-32 transition-all duration-500" />
              <div className="absolute w-10 h-10 rounded-full border border-[#ffe897]/50 group-hover:scale-125 group-hover:border-[#ffe897] transition-all duration-700" />
              <div className="absolute w-2.5 h-2.5 rounded-full bg-[#f8f7da] shadow-[0_0_18px_rgba(143,81,98,0.65)] group-hover:scale-150 transition-transform duration-500" />
              <div className="absolute top-full mt-5 flex flex-col items-center opacity-80 transition-opacity duration-500 group-hover:opacity-100">
                <span className="text-[7px] uppercase tracking-[0.4em] font-mono text-[#f4dfc6]">ABOUT PROJECT</span>
                <span className="mt-1 text-[15px] uppercase tracking-[0.4em] font-mulish text-white/50">STANCE</span>
              </div>
            </button>

            {/* Warm clinical project slate */}
            <div ref={stanceModalRef} style={{ display: 'none' }} className={`${MODAL_FRAME_CLASS} items-center shadow-[0_30px_100px_rgba(200,166,138,0.12)]`}>
              <SVGNoise />
              <div className="absolute -top-12 -left-4 text-[240px] font-bold text-[#c8a68a]/5 pointer-events-none select-none tracking-tighter">04</div>
              <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_70%_40%,rgba(127,143,130,0.08),transparent_35%)] pointer-events-none" />
              
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-16">
                <div className="flex-1">
                  <span className="text-[14px] uppercase tracking-[0.4em] text-[#c8a68a] font-mulish">Project 04 · STANCE HEALTH</span>
                  <h2 className="text-5xl md:text-7xl font-jost mt-6 text-[#f4dfc6] tracking-tight uppercase">Stance</h2>
                  <p className="mt-6 max-w-md text-sm text-white/55 leading-relaxed font-jost">
                    Website pages for a health and movement brand, designed to make service discovery feel calm, trustworthy, and immediate.
                  </p>
                  <div className="mt-12 w-24 h-[2px] bg-gradient-to-r from-[#c8a68a] via-[#7f8f82]/70 to-transparent" />
                </div>
                
                <div className="flex-1 pt-4">
                  <h3 className="text-xs tracking-[0.2em] text-white/40 uppercase font-mulish mb-4">Experience Priorities</h3>
                  <p className="text-sm text-gray-300 leading-relaxed font-jost mb-8">
                    The Stance section now gives the original model more space to breathe: slower scroll resistance near the reveal, a muted care palette, and an after-scene narrative that lets the SEO context arrive later.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="border border-white/5 p-4 hover:border-white/20 transition-colors duration-300">
                      <span className="text-[9px] uppercase tracking-[0.3em] text-[#c8a68a] font-mulish block mb-2">Visibility</span>
                      <span className="text-xs text-white/80 font-jost">Muted clinical contrast</span>
                    </div>
                    <div className="border border-white/5 p-4 hover:border-white/20 transition-colors duration-300">
                      <span className="text-[9px] uppercase tracking-[0.3em] text-[#7f8f82] font-mulish block mb-2">Focus</span>
                      <span className="text-xs text-white/80 font-jost">SEO + patient pages</span>
                    </div>
                  </div>
                </div>

                <button 
                  onMouseEnter={() => SoundEngine.playHover()}
                  onClick={() => { SoundEngine.playClick(); { setIsStanceOpen(false); setModalOpen(false); }; }}
                  className={`${CLOSE_BUTTON_CLASS} static ml-auto hover:border-[#c8a68a] hover:bg-[#c8a68a]/10`}
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
              onClick={() => { SoundEngine.playClick(); { setIsTerminalOpen(true); setModalOpen(true); }; }}
              className="group cursor-none flex flex-col items-center justify-center relative z-20"
            >
              <div className="relative w-32 h-32 rounded-full border border-white/20 flex items-center justify-center overflow-hidden group-hover:border-[#00f0ff]/50 transition-colors duration-700">
                <div className="absolute inset-0 bg-[#00f0ff]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="w-2 h-2 bg-white rounded-full group-hover:scale-[20] transition-transform duration-700 ease-in-out group-hover:bg-[#00f0ff]/20" />
                <span className="absolute text-[8px] uppercase tracking-[0.4em] font-mulish text-white/50 group-hover:text-white transition-colors duration-300">
                  Connect
                </span>
              </div>
            </button>

            <div 
              ref={terminalModalRef} 
              style={{ display: 'none' }} 
              className={`${MODAL_FRAME_CLASS} items-center justify-center shadow-[0_30px_100px_rgba(0,240,255,0.12)]`}
            >
              <button 
                onMouseEnter={() => SoundEngine.playHover()}
                onClick={() => { SoundEngine.playClick(); { setIsTerminalOpen(false); setModalOpen(false); }; }}
                className={CLOSE_BUTTON_CLASS}
              >
                <div className="w-5 h-[1px] bg-white rotate-45 absolute group-hover:rotate-135 transition-transform duration-500" />
                <div className="w-5 h-[1px] bg-white -rotate-45 absolute group-hover:-rotate-135 transition-transform duration-500" />
              </button>

              <div className="text-center mb-16">
                <h2 className="text-6xl md:text-8xl font-jost text-white tracking-tighter uppercase mb-4">
                  That's it. For Now....
                </h2>
                <div className="w-24 h-[1px] bg-[#00f0ff]/50 mx-auto" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-15 w-full max-w-8xl">
                {[
                  { name: 'GitHub', label: 'github.com/vanshjeet786', href: 'https://github.com/vanshjeet786', color: '#ffffff' },
                  { name: 'LinkedIn', label: 'linkedin.com/in/vanshjeetsingh', href: 'https://www.linkedin.com/in/vanshjeet', color: '#0a66c2' },
                  { name: 'Mail', label: 'Mail', href: 'mailto:singhvanshjeet@gmail.com', color: '#00f0ff' }
                ].map((link, i) => (
                  <a 
                    key={i}
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                    onMouseEnter={() => SoundEngine.playHover()}
                    onClick={() => SoundEngine.playClick()}
                    className="group relative border border-white/10 p-8 hover:border-white/30 transition-all duration-500 cursor-none overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                    <span className="relative z-10 text-[10px] uppercase tracking-[0.4em] text-white/50 font-mono block mb-4">
                      {link.name}
                    </span>
                    <span 
                      className="relative z-10 text-sm md:text-base font-jost tracking-widest transition-colors duration-300"
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

      {/* Global Narrative Overlay (Flat single-line layout with scroll-driven letter fade out) */}
      <div 
        ref={narrativeRef}
        className="absolute top-[70%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center w-full max-w-5xl px-4 z-10 overflow-visible flex justify-center items-center"
      >
        <FlatNarrativeText text={activeNarrativeText} subP={narrativeSubP} />
      </div>
      

      <SceneProgress
        activeScene={activeScene}
        progress={progress}
        isHidden={isCompassOpen || isSkillometerOpen || isStanceOpen || isTerminalOpen}
        onJump={(index) => {
          SoundEngine.playClick();
          jumpToScene(index);
        }}
      />

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

interface SceneProgressProps {
  activeScene: number;
  progress: number;
  isHidden: boolean;
  onJump: (index: number) => void;
}

const SceneProgress = ({ activeScene, progress, isHidden, onJump }: SceneProgressProps) => (
  <nav
    aria-label="Scene progress"
    className="absolute left-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3 pointer-events-auto md:flex"
    style={{ opacity: isHidden ? 0 : 1, transition: 'opacity 0.5s ease' }}
  >
    <div className="mb-2 text-[9px] uppercase tracking-[0.35em] text-white/35 font-mono">
      {Math.round(progress * 100).toString().padStart(2, '0')}%
    </div>
    {SCENE_LABELS.map((label, index) => {
      const isActive = activeScene === index;
      return (
        <button
          key={label}
          type="button"
          aria-label={`Jump to ${label}`}
          aria-current={isActive ? 'step' : undefined}
          onMouseEnter={() => SoundEngine.playHover()}
          onClick={() => onJump(index)}
          className="group flex items-center gap-3 cursor-none text-left"
        >
          <span
            className={`block h-[1px] transition-all duration-300 ${
              isActive ? 'w-10 bg-[#f8f7da] shadow-[0_0_10px_#f8f7da]' : 'w-4 bg-white/25 group-hover:w-8 group-hover:bg-white/60'
            }`}
          />
          <span className={`text-[9px] uppercase tracking-[0.28em] font-lato transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/30 group-hover:text-white/70'}`}>
            {label}
          </span>
        </button>
      );
    })}
  </nav>
);

const FlatNarrativeText = ({ text, subP }: { text: string; subP: number }) => {
  if (!text) return null;

  // Entrance phase: subP 0.0 -> 0.18
  let overallEntranceOpacity = 1;
  if (subP < 0.18) {
    overallEntranceOpacity = Math.max(0, subP / 0.18);
  }

  const chars = Array.from(text);
  const totalChars = chars.length;

  return (
    <div className="w-full text-center whitespace-nowrap overflow-visible pointer-events-none select-none flex justify-center items-center">
      <h2 
        className="text-base sm:text-xl md:text-2xl lg:text-3xl font-light text-white tracking-wider uppercase font-jost whitespace-nowrap inline-flex max-w-[95vw] overflow-visible"
        style={{
          opacity: overallEntranceOpacity,
          transform: `translateY(${(1 - overallEntranceOpacity) * 12}px)`,
          filter: `blur(${(1 - overallEntranceOpacity) * 5}px)`,
        }}
      >
        {chars.map((char, i) => {
          // Sequential letter exit threshold: subP from 0.50 to 0.95
          const exitStart = 0.50 + (i / Math.max(1, totalChars)) * 0.35;
          const exitEnd = Math.min(0.98, exitStart + 0.15);

          let charOpacity = 1;
          let charBlur = 0;
          let charY = 0;

          if (subP > exitStart) {
            const exitP = Math.min(1, (subP - exitStart) / (exitEnd - exitStart));
            charOpacity = 1 - exitP;
            charBlur = exitP * 8;
            charY = -exitP * 12;
          }

          return (
            <span
              key={i}
              className="inline-block transition-all duration-75"
              style={{
                opacity: charOpacity,
                filter: `blur(${charBlur}px)`,
                transform: `translateY(${charY}px)`,
                whiteSpace: char === ' ' ? 'pre' : 'normal',
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          );
        })}
      </h2>
    </div>
  );
};
