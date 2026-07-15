"use client";

import React, { useEffect, useState } from "react";

export default function Navigation() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll));
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 right-0 p-8 z-50 flex flex-col items-end gap-2 text-sm text-zinc-400">
      <div className="flex gap-4">
        <span>Vanshjeet Singh</span>
        <span className="text-zinc-600">/</span>
        <span>Product Engineer</span>
      </div>

      {/* Journey Progress */}
      <div className="w-32 h-[1px] bg-zinc-800 mt-4 relative overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-accent transition-transform duration-100 ease-out"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>
    </nav>
  );
}
