import { useEffect, useRef, useState } from 'react';
import type { FC } from 'react';
import gsap from 'gsap';

interface TrueFocusProps {
  text?: string;
  customItems?: string[];
  className?: string;
  splitBy?: 'word' | 'letter';
  animationSpeed?: number; // seconds per item
  noGap?: boolean;
  blurAmount?: number;
  borderColor?: string;
  glowColor?: string;
}

export const TrueFocus: FC<TrueFocusProps> = ({ 
  text = '', 
  customItems,
  className = '', 
  splitBy = 'word',
  animationSpeed = 2.0,
  noGap = false,
  blurAmount = 8,
  borderColor = 'rgba(255, 255, 255, 0.4)',
  glowColor = 'rgba(255, 255, 255, 0.25)'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const focusRectRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const items = customItems || (splitBy === 'word' ? text.split(' ').filter(Boolean) : text.split(''));

  // 1. Auto-advance activeIndex on a clean timer interval
  useEffect(() => {
    if (items.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, animationSpeed * 1000);

    return () => clearInterval(interval);
  }, [items.length, animationSpeed, isHovered]);

  // 2. Animate focus rectangle whenever activeIndex changes
  useEffect(() => {
    const el = elementsRef.current[activeIndex];
    const rectEl = focusRectRef.current;
    const containerEl = containerRef.current;

    if (el && rectEl && containerEl) {
      const elRect = el.getBoundingClientRect();
      const containerRect = containerEl.getBoundingClientRect();

      const paddingX = splitBy === 'word' && !noGap ? 12 : 6;
      const paddingY = 6;

      gsap.to(rectEl, {
        x: elRect.left - containerRect.left - paddingX,
        y: elRect.top - containerRect.top - paddingY,
        width: elRect.width + paddingX * 2,
        height: elRect.height + paddingY * 2,
        duration: 0.6,
        ease: 'expo.out',
        opacity: 1
      });
    }
  }, [activeIndex, items, splitBy, noGap]);

  return (
    <div 
      ref={containerRef} 
      className={`relative inline-flex flex-wrap items-center justify-center ${splitBy === 'word' && !noGap ? 'gap-x-4 gap-y-2' : ''} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ReactBits Style Focus Frame with Glowing Border and Corner Accents */}
      <div 
        ref={focusRectRef}
        className="absolute top-0 left-0 pointer-events-none z-10"
        style={{ 
          width: 0, 
          height: 0, 
          border: `1px solid ${borderColor}`,
          borderRadius: '6px',
          boxShadow: `0 0 20px ${glowColor}, inset 0 0 15px ${glowColor}`
        }}
      >
        <span className="absolute -top-[3px] -left-[3px] w-2.5 h-2.5 border-t-2 border-l-2 border-white rounded-tl-sm" />
        <span className="absolute -top-[3px] -right-[3px] w-2.5 h-2.5 border-t-2 border-r-2 border-white rounded-tr-sm" />
        <span className="absolute -bottom-[3px] -left-[3px] w-2.5 h-2.5 border-b-2 border-l-2 border-white rounded-bl-sm" />
        <span className="absolute -bottom-[3px] -right-[3px] w-2.5 h-2.5 border-b-2 border-r-2 border-white rounded-br-sm" />
      </div>
      
      {items.map((item, i) => {
        const isActive = activeIndex === i;
        const isSpace = item === ' ';
        
        return (
          <span
            key={i}
            ref={el => { elementsRef.current[i] = el; }}
            onMouseEnter={() => setActiveIndex(i)}
            className="relative cursor-pointer transition-all duration-700 select-none"
            style={{
              filter: !isActive && !isSpace ? `blur(${blurAmount}px)` : 'blur(0px)',
              opacity: !isActive && !isSpace ? 0.25 : 1,
              transform: isActive ? 'scale(1.06)' : 'scale(1)',
              display: 'inline-block',
              marginRight: noGap && i < items.length - 1 ? '0.05em' : undefined
            }}
          >
            {item}
          </span>
        );
      })}
    </div>
  );
};
