"use client";

import React, { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FiGithub, FiLinkedin, FiMail, FiFileText } from "react-icons/fi";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!footerRef.current || !contentRef.current) return;

    gsap.from(contentRef.current.children, {
      y: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: "power2.out",
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top 80%",
      }
    });
  }, { scope: footerRef });

  return (
    <footer
      ref={footerRef}
      className="min-h-screen relative flex items-center justify-center px-4 md:px-20 bg-transparent text-center"
    >
      <div ref={contentRef} className="max-w-2xl mx-auto space-y-12 z-10 flex flex-col items-center">

        <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 border border-white/10 shadow-2xl">
          <Image
            src="/VAnsh AGM.png"
            alt="Vanshjeet Singh"
            fill
            className="object-cover"
          />
        </div>

        <h2 className="text-3xl md:text-5xl font-light text-white/90">
          Let&apos;s build something meaningful.
        </h2>

        <div className="flex gap-8 text-white/50 pt-8">
          <a href="#" className="hover:text-[var(--color-accent)] transition-colors interactive">
            <FiFileText size={24} />
            <span className="sr-only">Resume</span>
          </a>
          <a href="#" className="hover:text-[var(--color-accent)] transition-colors interactive">
            <FiGithub size={24} />
            <span className="sr-only">GitHub</span>
          </a>
          <a href="#" className="hover:text-[var(--color-accent)] transition-colors interactive">
            <FiLinkedin size={24} />
            <span className="sr-only">LinkedIn</span>
          </a>
          <a href="#" className="hover:text-[var(--color-accent)] transition-colors interactive">
            <FiMail size={24} />
            <span className="sr-only">Email</span>
          </a>
        </div>

        <p className="text-sm text-white/30 pt-16 uppercase tracking-widest">
          © {new Date().getFullYear()} Vanshjeet Singh
        </p>
      </div>
    </footer>
  );
}
