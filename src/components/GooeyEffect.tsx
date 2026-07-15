"use client";

import React from 'react';

export default function GooeyEffect() {
  return (
    <>
      <svg className="hidden">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ filter: "url(#goo)" }}
      >
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-[var(--color-sage)] rounded-full opacity-30 animate-pulse mix-blend-screen" />
        <div className="absolute top-1/3 left-1/2 w-48 h-48 bg-[var(--color-sage)] rounded-full opacity-20 animate-bounce mix-blend-screen" style={{ animationDuration: '4s' }} />
        <div className="absolute top-2/3 right-1/4 w-24 h-24 bg-[var(--color-sage)] rounded-full opacity-40 animate-pulse mix-blend-screen" style={{ animationDelay: '1s' }} />
      </div>
    </>
  );
}
