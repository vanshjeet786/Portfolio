import { ProjectModalV2 } from './ui/ProjectModalV2/ProjectModalV2';
import { useEffect, useRef, useState, Suspense, lazy } from 'react';
import { WatsonxData } from '@carbon/icons-react';
import { useStore } from '@/stores/useStore';
import gsap from 'gsap';
import { TrueFocus } from './ui/TrueFocus';
import { SoundEngine } from '@/utils/SoundEngine';

import careerCompassWebp from '@/assets/images/careercompass.webp';
import careerCompassResultsWebp from '@/assets/images/career-compass-results.webp';
import skillometerWebp from '@/assets/images/skillometer..webp';
import skillometerResultsWebp from '@/assets/images/skillometer.skitre.ai daf09edb8776.webp';
import stanceBackWebp from '@/assets/images/stance-back.webp';
import stanceWomensWebp from '@/assets/images/stance-womens.webp';

const EtherealNetwork = lazy(() => import('./ui/EtherealNetwork').then(m => ({ default: m.EtherealNetwork })));
const ConnectModal = lazy(() => import('./ui/ConnectModal/ConnectModal').then(m => ({ default: m.ConnectModal })));


const NARRATIVE_TEXTS_1 = [
  "You're lost. Maybe?",
  "I developed a 6-LAYER AI Career Counsellor",
  "The priority was to ensure it doesn't assess",
  "Using RIASEC, Big 5, MBTI, Multiple Presonality",
  "And a few open ended questions to understand a person better"
];

const NARRATIVE_TEXTS_2 = [
  "This one Judges",
  "I built a 4-layer soft skills assessment test",
  "The objective was to be accurate",
  "Very interesting project",
  "Identifies the thinking patterns of a person"
];

const NARRATIVE_TEXTS_3 = [
  "These are the exact models",
  "I used to design a few webpages ",
  "for Stance Health",
  "Priority was SEO"
];

const NARRATIVE_TEXTS_4 = [
  "I designed a chat app and a Leaderboard Platform",
  "As a project  for a company.",
  "Priority was Database design",
  "Idempotency",
  "And API functions calls using CURL"
];

const NARRATIVE_TEXTS_5 = [
  "",
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
  'Stance',
  'WHERE AM I AGAIN?',
  'Mini Projects',
  'I THINK THIS IS THE END',
  'Vansh'
];

// const MODAL_FRAME_CLASS =
  

// const CLOSE_BUTTON_CLASS =
  

export const UIOverlay = () => {
  const activeScene = useStore((state) => state.activeScene);
  const setModalOpen = useStore((state) => state.setModalOpen);
  const progress = useStore((state) => state.progress);
  const jumpToScene = useStore((state) => state.jumpToScene);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayedScene, setDisplayedScene] = useState(activeScene);
  
  const [isCompassOpen, setIsCompassOpen] = useState(false);
  
  const triggerRef = useRef<HTMLButtonElement>(null);
  const narrativeRef = useRef<HTMLDivElement>(null);

  const [isSkillometerOpen, setIsSkillometerOpen] = useState(false);
  
  const skillometerTriggerRef = useRef<HTMLButtonElement>(null);

  const [isStanceOpen, setIsStanceOpen] = useState(false);
  
  const stanceTriggerRef = useRef<HTMLButtonElement>(null);

  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

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
    
    if (activeScene !== 5 && isStanceOpen) {
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
    if (displayedScene !== 1 || !triggerRef.current) return;
    if (isCompassOpen) {
      gsap.to(triggerRef.current, { opacity: 0, x: -20, duration: 0.4, ease: "power2.in" });
    } else {
      gsap.fromTo(triggerRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.8, ease: "expo.out", delay: 0.3 }
      );
    }
  }, [isCompassOpen, displayedScene]);

  // Skillometer Modal Animation Effect
  useEffect(() => {
    if (displayedScene !== 3 || !skillometerTriggerRef.current) return;
    if (isSkillometerOpen) {
      gsap.to(skillometerTriggerRef.current, { opacity: 0, y: -20, duration: 0.4, ease: "power2.in" });
    } else {
      gsap.fromTo(skillometerTriggerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "expo.out", delay: 0.3 }
      );
    }
  }, [isSkillometerOpen, displayedScene]);

  // Stance Modal Animation Effect
  useEffect(() => {
    if (displayedScene !== 5 || !stanceTriggerRef.current) return;
    if (isStanceOpen) {
      gsap.to(stanceTriggerRef.current, { opacity: 0, scale: 0.8, duration: 0.7, ease: "power2.in" });
    } else {
      gsap.fromTo(stanceTriggerRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "expo.out", delay: 0.3 }
      );
    }
  }, [isStanceOpen, displayedScene]);

  // Terminal Trigger Animation Effect
  useEffect(() => {
    if (displayedScene !== 9 || !terminalTriggerRef.current) return;
    if (isTerminalOpen) {
      gsap.to(terminalTriggerRef.current, { opacity: 0, scale: 0.9, duration: 0.4, ease: "power2.in" });
    } else {
      gsap.fromTo(terminalTriggerRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "expo.out", delay: 0.3 }
      );
    }
  }, [isTerminalOpen, displayedScene]);


  useEffect(() => {
    const closeActiveModal = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      const hasOpenModal = isCompassOpen || isSkillometerOpen || isStanceOpen || isTerminalOpen;
      if (hasOpenModal) {
        SoundEngine.playClose();
      }
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
      calculateNarrativeState(0.85, 0.94, NARRATIVE_TEXTS_4) ||
      calculateNarrativeState(0.93, 0.99, NARRATIVE_TEXTS_5);

    if (!active) {
      currentText = "";
      subP = 0;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveNarrativeText(currentText);

    setNarrativeSubP(subP);
  }, [progress]);

  return (
    <div id="ui-layout-layer" className="fixed top-0 left-0 w-full h-full z-10 pointer-events-none flex flex-col">
      
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
                  WebkitBackdropFilter: 'blur(1px)',
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
              onClick={() => { SoundEngine.playClick(); setIsCompassOpen(true); setModalOpen(true); }}
              className="absolute left-36 top-1/4 -translate-y-1/2 group flex items-center gap-6 cursor-none"
            >
              <div className="relative flex h-12 w-12 items-center justify-center opacity-70 transition-opacity duration-500 group-hover:opacity-100">
                <div className="absolute inset-0 rounded-full border border-white/10 group-hover:border-[#e8c1a9]/30 transition-colors duration-500" />
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-7 w-7 text-[#e8c1a9] drop-shadow-[0_0_10px_rgba(0,240,255,0.28)] transition-all duration-500 group-hover:scale-110 group-hover:text-[#f5ead7]"
                  fill="currentColor"
                >
                  <path d="m0.939 14.973 10.97 6.4V24L0.94 17.6v-2.626zm22.123 0v2.626l-10.971 6.4v-2.626l10.97 -6.401ZM0.939 10.66l10.97 6.4v2.627l-7.223 -4.214 -1.068 0.622 -2.253 -1.313 1.07 -0.623 -1.496 -0.873V10.66zm22.123 0v2.626l-1.496 0.873 1.07 0.624 -2.253 1.313 -1.07 -0.623 -7.224 4.214V17.06l10.972 -6.4ZM0.939 6.347l10.97 6.4v2.627l-3.525 -2.057 -1.067 0.622 -2.252 -1.314 1.067 -0.622 -1.429 -0.833 -1.066 0.622 -2.253 -1.314 1.068 -0.622 -1.514 -0.883Zm22.123 0v2.626l-1.514 0.883 1.07 0.622 -2.254 1.315 -1.068 -0.623 -1.428 0.833 1.068 0.622 -2.252 1.314 -1.07 -0.622 -3.525 2.057v-2.627l10.972 -6.4ZM12 8.584l3.236 1.885 -2.252 1.314 -0.983 -0.573 -0.982 0.573 -2.252 -1.314 3.235 -1.885Zm0 -4.293 6.916 4.03 -2.252 1.315L12 6.918 7.338 9.635 5.085 8.321ZM12 0l10.597 6.175 -2.252 1.314L12 2.627 3.657 7.489 1.405 6.175 12 0Z" />
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] tracking-[0.3em] uppercase text-white/50 font-lexend mb-1">ABOUT PROJECT</span>
                <span className="text-xs tracking-[0.2em] uppercase text-white group-hover:text-[#e8c1a9] transition-colors duration-500">
                  CAREER COMPASS
                </span>
              </div>
            </button>
            <ProjectModalV2 
              isOpen={isCompassOpen}
              onClose={() => { setIsCompassOpen(false); setModalOpen(false); }}
              title="Career Compass"
              tagline="An AI Powered Career Counsellor"
              meta={{
                role: "Tech. Prod. Manager and Lead Developer",
                timeline: "July 2025 to Dec 2025",
                context: "Full-time project for Skitre.ai",
                about: "Built for Skitre.AI, Career Compass is an application designed to guide users towards their ideal career paths. It features a comprehensive, 6-layer assessment that evaluates multiple intelligences, personality traits, aptitudes, background, interests, and self-reflection. The app utilizes real-time market data and an integrated AI Career Counselor to provide highly personalized career recommendations."
              }}
              sections={{
                foundation: {
                  title: "Tech Stack & Tooling",
                  content: (
                    <div className="flex flex-col gap-2">
                      <span>Frontend: React 18, Vite, Tailwind CSS (Glassmorphism), Lucide React</span>
                      <span>Backend: Nodejs (v22.22), Supabase (PostgreSQL, Auth, RLS)</span>
                      <span>AI/ML: Groq AI</span>
                    </div>
                  )
                },
                design: {
                  title: "UI/UX Design Process",
                  content: (
                    <div className="flex flex-col gap-2">
                      <span>Light Mode (Background: #f8fafc; Text: #1c1c1c) with Glassmorphism accents.</span>
                      <span>Outfit for headings and Figtree for body text.</span>
                      <span>Fully responsive layout with mobile-friendly assessment cards.</span>
                    </div>
                  )
                },
                engineering: {
                  title: "Technical Architecture",
                  content: "The Vite/React frontend serves as a single-page application (SPA) interfacing securely with a PostgreSQL backend. Authentication and Row-Level Security (RLS) are implemented to protect user data.                                                                Real-time counseling is powered by the Groq API, synthesizing historical BackgroundInfo and scored data."
                },
                showcase: {
                  primaryImage: {
                    src: careerCompassWebp,
                    alt: "Career Compass Primary Showcase",
                  },
                  gallery: [
                    {
                      src: careerCompassWebp,
                      alt: "Dashboard Overview",
                      caption: "Dashboard Overview"
                    },
                    {
                      src: careerCompassResultsWebp,
                      alt: "Assessment Flow and Personalized Results",
                      caption: "Personalized Results"
                    }
                  ]
                }
              }}
            />
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
              onClick={() => { SoundEngine.playClick(); setIsSkillometerOpen(true); setModalOpen(true); }}
              className="absolute right-16 top-16 group flex flex-col items-center gap-4 cursor-none"
            >
              <div className="w-[1px] h-16 bg-gradient-to-b from-transparent to-white/50 group-hover:h-24 transition-all duration-500" />
              <div className="w-10 h-10 rounded-full border border-[#f8f7da]/50 flex items-center justify-center text-[#f8f7da]/80 group-hover:text-[#f8f7da] group-hover:border-[#f8f7da] group-hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all duration-500">
                <WatsonxData
                  size={20}
                  className="transition-transform duration-300 group-hover:scale-110"
                  aria-hidden="true"
                />
              </div>
              <span className="text-[12px] tracking-[0.4em] uppercase text-white/50 font-lato mt-2 group-hover:text-[#f8f7da] transition-colors duration-500" style={{ writingMode: 'vertical-rl' }}>
                SKILLOMETER
              </span>
            </button>
            <ProjectModalV2 
              isOpen={isSkillometerOpen}
              onClose={() => { setIsSkillometerOpen(false); setModalOpen(false); }}
              title="Skillometer"
              tagline="A Soft Skills Assessment Platform"
              meta={{
                role: "Lead Product Engineer and Creative Technologist",
                timeline: "Feb 2026 - May 2026",
                context: "Full-time project for Skitre.ai",
                about: "I built Skillometer for Skitre.ai. A 4-layer soft skills assessment platform. The objective was to be highly accurate in identifying the thinking patterns of a person. It dynamically models candidate signals and alignment scores, avoiding traditional rigid dashboards in favor of graph-based visualizations."
              }}
              sections={{
                foundation: {
                  title: "Tech Stack",
                  content: (
                    <div className="flex flex-col gap-2">
                      <span>Frontend: React 18, TypeScript, Vite</span>
                      <span>Backend: Supabase (Deno), Node.js</span>
                    </div>
                  )
                },
                design: {
                  title: "UI/UX Design Process",
                  content: (
                    <div className="flex flex-col gap-2">
                      <span>Aesthetic: Strict "dark terminal aesthetic" maintained via CSS(Radix UI).
</span>
                      <span>Components: shadcn/ui for accessible primitives and lucide-react for consistent iconography.</span>
                    </div>
                  )
                },
                engineering: {
                  title: "Technical Architecture",
                  content: "A structured 10-stage execution pipeline designed to secure platform AI capabilities. It incorporates JWT session validation and organization-scoped access to resolve ASVF-002 security findings."
                },
                showcase: {
                  primaryImage: {
                    src: skillometerWebp,
                    alt: "Skillometer Interface",
                  },
                  gallery: [
                    {
                      src: skillometerWebp,
                      alt: "Skillometer Interface",
                      caption: "Assessment Page"
                    },
                    {
                      src: skillometerResultsWebp,
                      alt: "Skillometer Results",
                      caption: "Assessment Analytics"
                    }
                  ]
                }
              }}
            />
          </div>
        )}
        
{/* SCENE 4: NARRATIVE VOID 2 */}
        {displayedScene === 4 && <div className="w-full h-full" />}

        {/* SCENE 7: ETHEREAL NETWORK (Exiles + Leaderboard) */}
        {/* We keep this mounted when displayedScene is 7 */}
        <Suspense fallback={null}>
          <EtherealNetwork isActive={displayedScene === 7} />
        </Suspense>

        {/* SCENE 6: NARRATIVE VOID 3 */}
        {displayedScene === 6 && <div className="w-full h-full" />}

        
        {/* SCENE 5: STANCE */}
        {displayedScene === 5 && (
          <div className="w-full h-full flex justify-center items-end relative pointer-events-auto pb-12">
            
    

            <ProjectModalV2 
              isOpen={isStanceOpen}
              onClose={() => { setIsStanceOpen(false); setModalOpen(false); }}
              title="Stance"
              tagline="Set of frontend pages to improve SEO"
              meta={{
                role: "UI/UX developer",
                timeline: "2026",
                context: "Freelance Project",
                about: "I designed and developed website pages for Stance Health. The priority was SEO. I utilized abstract, soft, physically grounded 3D elements to focus on movement and recovery without relying on typical healthcare tropes."
              }}
              sections={{
                foundation: {
                  title: "Tech Stack",
                  content: (
                    <div className="flex flex-col gap-2">
                      <span>Frontend: React, TypeScript, Tailwind CSS, Framer Motion</span>
                      <span>3D Engine: Three.js, R3F, GSAP</span>
                    </div>
                  )
                },
                design: {
                  title: "UI/UX Design Process",
                  content: (
                    <div className="flex flex-col gap-2">
                      <span>Structured the layout to give the 3D models and the content breathing room.</span>
                      <span>I focused on creating a cinematic, product-like experience rather than a traditional recovery website. The interface uses 3D anatomy, smooth transitions, progressive disclosure, motion-driven interactions, and modular layouts to guide users naturally through conditions, assessments, recovery journeys, and booking while keeping the experience clean.</span>
                    </div>
                  )
                },
                engineering: {
                  title: "Technical Architecture",
                  content: "I built the application using React, Next.js, TypeScript, and Three.js with React Three Fiber for interactive 3D rendering. Animations are powered by GSAP and Framer Motion, while reusable components, modular page architecture, dynamic anatomy scenes, and shared UI systems keep the codebase scalable and maintainable across multiple rehabilitation journeys and booking flows. Custom physical materials were created for the translucent glass forms."
                },
                showcase: {
                  primaryImage: {
                    src: stanceBackWebp,
                    alt: "Stance Health Overview",
                  },
                  gallery: [
                    {
                      src: stanceBackWebp,
                      alt: "Stance Health",
                      caption: "Organic Structure"
                    },
                    {
                      src: stanceWomensWebp,
                      alt: "Stance Details",
                      caption: "Abstract Sanctuary"
                    }
                  ]
                }
              }}
            />
          </div>
        )}
        
{/* SCENE 6: NARRATIVE VOID 3 */}
        {displayedScene === 6 && <div className="w-full h-full" />}

        {/* SCENE 5: STANCE */}
        {displayedScene === 5 && (
          <div className="w-full h-full flex justify-center items-end relative overflow-hidden pointer-events-auto pb-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(200,166,138,0.13),transparent_28%),radial-gradient(circle_at_62%_56%,rgba(127,143,130,0.08),transparent_24%)]" />
            <div className="absolute left-12 top-14 hidden max-w-[18rem] md:block">
            </div>
            
            {/* Anatomical locator trigger */}
            <button
              ref={stanceTriggerRef}
              onMouseEnter={() => SoundEngine.playHover()}
              onClick={() => { SoundEngine.playClick(); { setIsStanceOpen(true); setModalOpen(true); }; }}
              className="absolute left-8/10 top-1/7 -translate-x-1/2 -translate-y-1/2 group cursor-none w-36 h-36 flex items-left justify-left rounded-full"
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
              onClick={() => { SoundEngine.playClick(); setIsTerminalOpen(true); setModalOpen(true); }}
              className="group cursor-none flex flex-col items-center justify-center relative z-20"
            >
              <div className="relative w-32 h-32 rounded-full border border-white/20 flex items-center justify-center overflow-hidden group-hover:border-[#d4af37]/50 transition-colors duration-700">
                <div className="absolute inset-0 bg-[#d4af37]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="w-2 h-2 bg-white rounded-full group-hover:scale-[20] transition-transform duration-700 ease-in-out group-hover:bg-[#d4af37]/20" />
                <span className="absolute text-[8px] uppercase tracking-[0.4em] font-mulish text-white/50 group-hover:text-white transition-colors duration-300">
                  Connect
                </span>
              </div>
            </button>

            <Suspense fallback={null}>
              <ConnectModal isOpen={isTerminalOpen} onClose={() => { setIsTerminalOpen(false); setModalOpen(false); }} />
            </Suspense>
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

      {/* Global Scroll Indicator (Disabled / Hidden at End Section scene 8 & 9) */}
      <div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center transition-opacity duration-500 z-10"
        style={{ opacity: (isCompassOpen || isSkillometerOpen || isStanceOpen || isTerminalOpen || activeNarrativeText !== "" || displayedScene >= 8 || activeScene >= 8) ? 0 : 0.3 }}
      >
        <span className="text-[10px] uppercase tracking-[0.4em] mb-4 font-Chelsea text-white">Scroll</span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-white to-transparent"></div>
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

export default UIOverlay;
