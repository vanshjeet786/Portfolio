# 📱 The Definitive Guide to Mobile Optimization

This document serves as a "no stone unturned" reference for optimizing heavy, interactive desktop websites for mobile devices. It is tailored specifically for our modern tech stack: **React, Three.js (React Three Fiber), GSAP, Anime.js, and Tailwind CSS v4**.

Optimizing for mobile is not just about making things fit on a smaller screen; it’s about **experience preservation** under severe hardware constraints (CPU, GPU, Memory, Thermal throttling, and Battery life).

---

## 📊 1. Core Metrics & Measurement

Before optimizing, you must know what to measure. Mobile devices have vastly different capabilities than desktop rigs.

### Key Technical Performance Metrics (Core Web Vitals)
*   **LCP (Largest Contentful Paint):** Target < 2.5s. On mobile, this is often delayed by heavy 3D models or unoptimized textures blocking the main thread or consuming bandwidth.
*   **INP (Interaction to Next Paint):** Target < 200ms. Crucial for React/WebGL apps. Heavy JS execution (like complex GSAP calculations or R3F render loops) can block the main thread, causing delayed touch feedback.
*   **CLS (Cumulative Layout Shift):** Target < 0.1. Ensure canvas elements and fallback images have explicit dimensions to avoid layout jumps while models load.

### Hardware-Specific Metrics
*   **Memory (RAM):** Mobile browsers aggressively kill tabs that use too much memory. Large textures and un-disposed WebGL geometries are the main culprits.
*   **Battery Life & Thermals:** Constant 60fps rendering of a complex 3D scene will rapidly drain a battery and cause thermal throttling (which forcibly underclocks the CPU/GPU, dropping frames).
*   **Device Pixel Ratio (DPR):** Modern phones have high DPR (2x, 3x, or even 4x). Rendering WebGL at native resolution on a 3x mobile screen pushes more pixels than a 1080p desktop monitor.

### Measurement Tools
*   **Actual Devices:** Chrome DevTools mobile view does **NOT** emulate mobile CPU/GPU constraints. You must test on physical mid-range devices (e.g., a 3-year-old Android).
*   **Lighthouse / WebPageTest:** For baseline web vitals (throttle CPU to 4x or 6x slowdown).
*   **r3f-perf:** Use `<Perf />` from `r3f-perf` in development to monitor GPU time, memory allocation, and draw calls.

---

## 🎨 2. UI/UX & Responsive Design (React + Tailwind v4)

Translating a desktop UI to mobile requires a paradigm shift in interaction and layout.

### Best Practices & Solutions
*   **Viewport Handling:** Avoid `100vh` on mobile due to the disappearing browser UI (address bar). Use Tailwind's Dynamic Viewport Heights (`h-dvh`) to prevent UI jumping when scrolling.
*   **Touch Targets:** Apple and Google recommend a minimum touch target size of **44x44px** (or 48x48px). Use Tailwind padding (`p-3` or `p-4`) rather than hardcoding widths to increase the tap area without changing the visual size.
*   **Hover States:** Mobile has no hover. Any information hidden behind a hover state must be visible by default or accessible via tap on mobile. Ensure `hover:` variants in Tailwind are grouped with `@media (hover: hover)` if they interfere with touch, or use Tailwind v4's intelligent hover handling.
*   **Fluid Typography:** Use CSS `clamp()` for responsive text sizing so it scales smoothly rather than relying entirely on breakpoint jumps (e.g., `text-[clamp(1rem,2vw,1.5rem)]`).

### Common Mistakes
*   ❌ Relying on `cursor-pointer` to indicate interactivity (useless on mobile).
*   ❌ Placing critical navigation at the top left (hard to reach with one hand). Move primary actions to the bottom or easily reachable zones.

---

## 🧊 3. 3D, WebGL & Canvas (Three.js & R3F)

This is the most critical section for our stack. A 3D monolithic cube that looks stunning on desktop can melt a smartphone if not properly configured.

### Optimization Strategies

**1. Cap the Device Pixel Ratio (DPR)**
Never let R3F render at the phone's native resolution. Cap it at 1.5 or 2 max.
```tsx
// DO THIS:
<Canvas dpr={[1, 1.5]}>

// AVOID THIS:
<Canvas dpr={window.devicePixelRatio}>
```

**2. Adaptive Degradation**
Use `@react-three/drei`'s adaptive components to lower rendering quality during movement or when frame rates drop.
```tsx
import { AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';

<Canvas>
  <AdaptiveDpr pixelated />
  <AdaptiveEvents />
</Canvas>
```

**3. Optimize Assets**
*   **Textures:** Use `.WEBP` or highly compressed `.KTX2` (Basis) formats. Mobile GPUs struggle with large texture memory. Resize textures (max 1024x1024 for mobile, often 512x512 is enough).
*   **Geometry:** Use `Draco` or `Meshopt` compression for GLTF/GLB models. Reduce polygon count drastically. If you have a complex cube, use a lower-LOD (Level of Detail) version for mobile.

**4. Rendering & Materials**
*   **Anti-aliasing:** Disable anti-aliasing on mobile. With high DPR, physical pixels are small enough that MSAA is often an unnecessary GPU tax.
*   **Materials:** Prefer `meshBasicMaterial` or `meshLambertMaterial` over `meshStandardMaterial` or `meshPhysicalMaterial` on mobile if lighting doesn't need to be hyper-realistic.
*   **Shadows:** Disable shadows, bake them into textures, or use simple contact shadows instead of real-time directional light shadows.

**5. Memory Management (The React + Three.js Trap)**
*   React components mounting and unmounting do not always automatically clear Three.js memory (geometries/materials). Ensure you use `useLoader.clear()` or dispose of materials and geometries properly to prevent mobile browser crashes.

---

## 🎬 4. Animation Optimization (GSAP, Anime.js & Lenis)

Silky smooth animations on desktop can become jittery nightmares on mobile.

### Best Practices

**1. Animate Only Compositor Properties**
Only animate `transform` (translate, scale, rotate) and `opacity`.
*   ❌ **NEVER** animate `width`, `height`, `top`, `left`, `margin`, or `box-shadow` on mobile. It forces layout recalculations (Reflow/Repaint).

**2. GSAP MatchMedia (Contextual Animation)**
Simplify or completely disable complex staggered animations on mobile to preserve CPU cycles.
```javascript
import gsap from "gsap";

let mm = gsap.matchMedia();

mm.add("(max-width: 768px)", () => {
  // Mobile: Simple fade in
  gsap.to(".cube", { opacity: 1, duration: 1 });
});

mm.add("(min-width: 769px)", () => {
  // Desktop: Complex rotation and stagger
  gsap.to(".cube", { rotation: 360, opacity: 1, stagger: 0.1, duration: 2 });
});
```

**3. Anime.js Production Handling**
To prevent ES module resolution errors and reduce initial JS payload, load Anime.js dynamically only when needed.
```javascript
import { useEffect } from 'react';

useEffect(() => {
  import('animejs').then((module) => {
    const anime = module.default || module;
    anime({ targets: '.element', translateX: 250 });
  });
}, []);
```

**4. Pause Off-Screen / Inactive Animations**
Use `IntersectionObserver` to pause GSAP timelines or R3F `useFrame` loops when the element is not in the viewport. Also, listen to the Page Visibility API to pause rendering when the user switches tabs.

**5. Lenis (Smooth Scrolling)**
Lenis works great, but evaluate if native scrolling is better for mobile. If using Lenis on mobile, ensure `syncTouch: true` or completely disable it to fallback to native mobile scrolling (which is already smooth and hardware-accelerated).

---

## 🔋 5. Experience Preservation

How do we keep the "quiet confidence, craftsmanship, and timeless design" without the computational cost?

1.  **Fallback to 2.5D or Video:** If the 3D scene (e.g., fracturing monolithic cube) is simply too heavy for a low-end device, consider rendering a pre-computed video (MP4/WebM) or using CSS 3D transforms instead of a full WebGL canvas.
2.  **Glassmorphism Moderation:** `backdrop-filter: blur()` is notoriously expensive on mobile GPUs. Use it extremely sparingly, or replace it with semi-transparent solid colors (e.g., Slate or Clay palettes) on mobile breakpoints.
3.  **TrueFocus & Text:** For effects like TrueFocus, ensure `splitBy="word"` is used over "letter". Animating hundreds of individual `<span>` tags per letter will crash a mobile DOM renderer.

---

## 🚫 6. Common Implementation Mistakes Check-list

- [ ] **Mistake:** Using `vh` units causing layout shifts. **Fix:** Use `dvh` (dynamic viewport height).
- [ ] **Mistake:** Heavy DOM. Hundreds of DOM elements for decorative effects. **Fix:** Consolidate, or draw to a single `<canvas>`.
- [ ] **Mistake:** Leaving `console.log` or React Strict Mode running in profiling environments, skewing mobile results.
- [ ] **Mistake:** Assuming fast network. **Fix:** Lazy load off-screen images/models. Use `React.Suspense`.
- [ ] **Mistake:** Uncapped frame rates. **Fix:** Allow R3F to drop to 30fps on mobile to save battery using `frameloop="demand"` where continuous animation isn't required.

---

## 💡 7. Developer Advice & Suggestions

*   **Mobile-First is a Mindset, not just CSS:** When building a new feature (like the ProjectModalV2), don't just scale down the desktop version. Ask: *"What is the core information the user needs right now, and what is the cheapest way to render it?"*
*   **Emulate Network, Not Just Screen Size:** When testing locally, use Chrome's Network tab to throttle to "Fast 3G". Your heavy GLTF models will suddenly take 15 seconds to load. You *will* need loading screens and suspense fallbacks.
*   **Graceful Degradation:** It is perfectly acceptable for the mobile experience to have fewer particles, less complex shaders, and simpler animations. A smooth, 60fps simple experience feels exponentially more "premium" and "crafted" than a 15fps complex experience.
