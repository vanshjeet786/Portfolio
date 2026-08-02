import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface CornerCounterProps {
  progress: number;
}

export const CornerCounter = ({ progress }: CornerCounterProps) => {
  const textRef = useRef<HTMLDivElement>(null);
  const proxyRef = useRef({ val: 0 });

  useEffect(() => {
    // Smoothly interpolate the displayed number
    gsap.to(proxyRef.current, {
      val: progress,
      duration: 0.5,
      ease: "power2.out",
      onUpdate: () => {
        if (textRef.current) {
           // Format to always have 3 digits (e.g. 004, 042, 100)
           const currentVal = Math.round(proxyRef.current.val);
           const padded = String(currentVal).padStart(3, '0');
           textRef.current.innerText = `${padded}%`;
        }
      }
    });
  }, [progress]);

  return (
    <div className="absolute bottom-8 right-8 lg:bottom-12 lg:right-12 text-[#B89073] font-mono select-none overflow-hidden flex flex-col items-end">
      <div className="text-[10px] tracking-[0.2em] uppercase opacity-60 mb-2">System Load</div>
      <div
        ref={textRef}
        className="text-2xl md:text-4xl font-light tracking-widest antialiased"
      >
        000%
      </div>
    </div>
  );
};
