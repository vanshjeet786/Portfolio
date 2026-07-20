import { useEffect, useRef, useState } from 'react';
import type { FC } from 'react';
import gsap from 'gsap';

interface TrueFocusProps {
  text: string;
  className?: string;
  splitBy?: 'word' | 'letter';
  animationSpeed?: number;
}

export const TrueFocus: FC<TrueFocusProps> = ({ 
  text, 
  className = '', 
  splitBy = 'word',
  animationSpeed = 1.2 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const focusRectRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const items = splitBy === 'word' ? text.split(' ') : text.split('');

  useEffect(() => {
    // Auto-focus animation loop
    const tl = gsap.timeline({ repeat: -1 });
    
    items.forEach((_, i) => {
      // If it's a space character in letter mode, skip the pause
      const isSpace = splitBy === 'letter' && items[i] === ' ';
      
      tl.call(() => {
        if (!isSpace) {
          setActiveIndex(i);
          
          const el = elementsRef.current[i];
          const rectEl = focusRectRef.current;
          const containerEl = containerRef.current;
          
          if (el && rectEl && containerEl) {
            const elRect = el.getBoundingClientRect();
            const containerRect = containerEl.getBoundingClientRect();
            
            gsap.to(rectEl, {
              x: elRect.left - containerRect.left - (splitBy === 'word' ? 8 : 4),
              y: elRect.top - containerRect.top - 4,
              width: elRect.width + (splitBy === 'word' ? 16 : 8),
              height: elRect.height + 8,
              duration: 0.8,
              ease: "expo.out"
            });
          }
        }
      }, [], `+=${i === 0 ? 0 : (isSpace ? 0 : animationSpeed)}`); 
    });
    
    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, splitBy, animationSpeed]);

  return (
    <div 
      ref={containerRef} 
      className={`relative inline-flex flex-wrap ${splitBy === 'word' ? 'gap-x-4 gap-y-2' : ''} ${className}`}
      onMouseLeave={() => setActiveIndex(null)}
    >
      {/* The focus frame */}
      <div 
        ref={focusRectRef}
        className="absolute top-0 left-0 border border-white/30 rounded-md pointer-events-none shadow-[0_0_15px_rgba(255,255,255,0.2)]"
        style={{ width: 0, height: 0, transition: 'opacity 0.4s', opacity: activeIndex !== null ? 1 : 0 }}
      />
      
      {items.map((item, i) => {
        const isActive = activeIndex === i;
        const isHovered = activeIndex !== null;
        const isSpace = item === ' ';
        
        return (
          <span
            key={i}
            ref={el => { elementsRef.current[i] = el; }}
            onMouseEnter={() => !isSpace && setActiveIndex(i)}
            className="relative cursor-default transition-all duration-700"
            style={{
              filter: isHovered && !isActive && !isSpace ? 'blur(8px)' : 'blur(0px)',
              opacity: isHovered && !isActive && !isSpace ? 0.2 : 1,
              transform: isActive ? 'scale(1.08)' : 'scale(1)',
              display: isSpace ? 'inline-block' : 'inline-block',
              width: isSpace ? '0.5em' : 'auto' // ensure space has width
            }}
          >
            {item}
          </span>
        );
      })}
    </div>
  );
};
