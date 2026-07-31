import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dotRef.current || !ringRef.current) return;

    // Use GSAP quickTo for highly performant tracking
    const xDotTo = gsap.quickTo(dotRef.current, "x", { duration: 0.1, ease: "power3" });
    const yDotTo = gsap.quickTo(dotRef.current, "y", { duration: 0.1, ease: "power3" });
    
    const xRingTo = gsap.quickTo(ringRef.current, "x", { duration: 0.6, ease: "power3.out" });
    const yRingTo = gsap.quickTo(ringRef.current, "y", { duration: 0.6, ease: "power3.out" });

    const onMouseMove = (e: MouseEvent) => {
      xDotTo(e.clientX);
      yDotTo(e.clientY);
      xRingTo(e.clientX);
      yRingTo(e.clientY);
    };

    const onMouseDown = () => {
      gsap.to(ringRef.current, { scale: 0.5, duration: 0.2 });
      gsap.to(dotRef.current, { scale: 1.5, duration: 0.2 });
    };

    const onMouseUp = () => {
      gsap.to(ringRef.current, { scale: 1, duration: 0.2 });
      gsap.to(dotRef.current, { scale: 1, duration: 0.2 });
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    // Initial positioning off-screen
    gsap.set([dotRef.current, ringRef.current], { xPercent: -50, yPercent: -50, opacity: 1 });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <>
      <div 
        ref={ringRef}
        className="fixed top-0 left-0 w-10 h-10 border border-white/40 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{ backdropFilter: 'blur(2px)' }}
      />
      <div 
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[10000] mix-blend-difference shadow-[0_0_10px_#fff]"
      />
    </>
  );
};
