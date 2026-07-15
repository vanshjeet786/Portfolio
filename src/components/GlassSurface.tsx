"use client";

import React, { ReactNode } from "react";

interface GlassSurfaceProps {
  children: ReactNode;
  className?: string;
}

export default function GlassSurface({ children, className = "" }: GlassSurfaceProps) {
  return (
    <div className={`glass-surface rounded-xl p-6 ${className}`}>
      {children}
    </div>
  );
}
