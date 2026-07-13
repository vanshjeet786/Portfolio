"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Navigation() {
  const [chapter, setChapter] = useState("01 // PROGRESS");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollY / docHeight) * 100;
      setProgress(scrollPercent);

      if (scrollPercent < 20) setChapter("01 // PROGRESS");
      else if (scrollPercent < 40) setChapter("02 // CAREER COMPASS");
      else if (scrollPercent < 60) setChapter("03 // LEADERBOARD API");
      else if (scrollPercent < 80) setChapter("04 // STANCE HEALTH");
      else setChapter("05 // EXILES CHAT");
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 right-0 p-8 z-50 flex flex-col items-end mix-blend-difference pointer-events-none">
      <div className="text-sm font-medium tracking-wide text-white mb-2">
        {chapter}
      </div>
      <div className="w-32 h-1 bg-white/20 overflow-hidden rounded-full">
        <div
          className="h-full bg-[#8B864E] transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </nav>
  );
}
