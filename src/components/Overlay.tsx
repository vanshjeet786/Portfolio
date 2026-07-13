import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useStore } from '../store/useStore';
import clsx from 'clsx';

const SECTIONS = [
  { id: 'home', title: 'Knowledge' },
  { id: 'career-compass', title: 'Career Compass' },
  { id: 'leaderboard', title: 'Leaderboard' },
  { id: 'stance', title: 'Stance' },
  { id: 'exiles-chat', title: 'Exiles Chat' },
];

const Section = ({
  id,
  title,
  subtitle
}: {
  id: string,
  title: string,
  subtitle?: string
}) => {
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  const setCurrentSection = useStore(state => state.setCurrentSection);
  const addVisitedSection = useStore(state => state.addVisitedSection);

  useEffect(() => {
    if (inView) {
      setCurrentSection(id);
      addVisitedSection(id);
    }
  }, [inView, id, setCurrentSection, addVisitedSection]);

  return (
    <div
      ref={ref}
      id={id}
      className="h-screen w-full flex flex-col items-center justify-center pointer-events-none"
    >
      <div className="text-center opacity-80 mix-blend-difference text-white">
        {id === 'home' ? (
           <h1 className="text-4xl md:text-6xl font-light tracking-widest uppercase">The object represents knowledge.</h1>
        ) : (
          <>
            <h2 className="text-5xl md:text-7xl font-light tracking-wide">{title}</h2>
            {subtitle && <p className="mt-4 text-xl tracking-widest uppercase opacity-70">{subtitle}</p>}
          </>
        )}
      </div>
    </div>
  );
};

const Navigation = () => {
  const visitedSections = useStore(state => state.visitedSections);
  const currentSection = useStore(state => state.currentSection);

  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-50 mix-blend-difference text-white">
      {SECTIONS.map((section) => {
        const isVisited = visitedSections.includes(section.id);
        const isCurrent = currentSection === section.id;

        return (
          <div key={section.id} className="flex items-center gap-4 group cursor-pointer pointer-events-auto">
            <div
              className={clsx(
                "w-2 h-2 rounded-full transition-all duration-1000",
                isCurrent ? "scale-150 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" :
                isVisited ? "bg-white/60" : "bg-white/20"
              )}
            />
            <span
              className={clsx(
                "text-xs tracking-widest uppercase transition-all duration-1000",
                isCurrent ? "opacity-100 translate-x-2" :
                isVisited ? "opacity-40" : "opacity-0 -translate-x-2 group-hover:opacity-20 group-hover:translate-x-0"
              )}
            >
              {section.title}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const Overlay = () => {
  return (
    <>
      <Navigation />

      {/* Spacer to allow scrolling before first section hits */}
      <div className="h-[20vh]"></div>

      <Section id="home" title="" />

      <div className="h-[50vh]"></div>

      <Section id="career-compass" title="Career Compass" subtitle="Creates neural pathways." />

      <div className="h-[50vh]"></div>

      <Section id="leaderboard" title="Leaderboard" subtitle="Creates mathematical structures." />

      <div className="h-[50vh]"></div>

      <Section id="stance" title="Stance" subtitle="Creates organic geometry." />

      <div className="h-[50vh]"></div>

      <Section id="exiles-chat" title="Exiles Chat" subtitle="Creates communication networks." />

      {/* Spacer at the end */}
      <div className="h-[50vh]"></div>
    </>
  );
};

export default Overlay;
