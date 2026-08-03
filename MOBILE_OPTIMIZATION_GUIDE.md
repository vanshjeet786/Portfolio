# Comprehensive Mobile Optimization Guide
## For a High-Fidelity 3D React/Vite/WebGL Web Application

**Context:** This guide outlines the exhaustive steps, requirements, metrics, and common pitfalls for optimizing a complex web application using React, Vite, React Three Fiber (R3F), GSAP, Lenis, and Anime.js for mobile (phone) devices. The scope assumes an application roughly **1.5x the size of the current architecture** (e.g., expanding from 10 to 15+ scenes, incorporating more 3D assets, and housing a larger DOM overlay structure).

---

## 1. The Scale: What 1.5x Means for Mobile
Scaling a WebGL-heavy site by 1.5x doesn't just mean a longer scroll; it means significantly higher memory consumption, longer JavaScript parsing times, and increased thermal load on mobile GPUs.
* **Asset Load:** More high-resolution textures and complex geometries.
* **JS Heap:** A larger React tree and more GSAP/Anime.js instances living in memory.
* **Draw Calls:** More objects in the 3D scene requiring rendering per frame.
* **Battery & Heat:** Sustained 60FPS WebGL on a phone causes rapid battery drain and thermal throttling, which forcibly degrades CPU/GPU performance after a few minutes.

---

## 2. Master Checklist: What Must Be Covered

### A. WebGL & Three.js / R3F (The Heaviest Lifters)
* [ ] **Device Pixel Ratio (DPR) Scaling:** Cap DPR on mobile. (e.g., `dpr={[1, Math.min(1.5, window.devicePixelRatio)]}`). Rendering at 3x on an iPhone 14 Pro will crash the browser due to GPU memory limits.
* [ ] **Geometry Compression:** All `.gltf`/`.glb` files MUST use Draco compression.
* [ ] **Texture Compression:** Convert `.png`/`.jpg` to KTX2 (Basis Universal) formats. They stay compressed directly on the GPU, saving massive amounts of VRAM.
* [ ] **Instancing & Merging:** Use `InstancedMesh` for repeated objects (e.g., the Ethereal Network nodes) to reduce draw calls from thousands to one.
* [ ] **Material Simplification:** Downgrade `MeshPhysicalMaterial` to `MeshStandardMaterial` or `MeshBasicMaterial` on mobile where lighting nuances (like clearcoat or transmission) aren't strictly necessary.
* [ ] **Shadow Baking:** Disable real-time shadows (`castShadow`, `receiveShadow`) on mobile. Bake lighting and shadows directly into textures using Blender.
* [ ] **Frustum Culling & Suspending:** Ensure objects outside the camera view are culled. Use R3F's `<BakeShadows>` and suspend rendering of components not in the current active "Scene" (0-14).
* [ ] **Memory Management (Disposal):** When a scene unmounts, explicitly call `.dispose()` on geometries, materials, and textures. R3F does some of this, but complex setups leak memory.

### B. JavaScript & React Execution
* [ ] **Aggressive Code Splitting:** Use `React.lazy` and `Suspense` for each of the 15 scenes. Do not load Scene 10's JavaScript until the user reaches Scene 8.
* [ ] **Dynamic Imports for Animations:** As per architecture constraints, `Anime.js` must be dynamically imported on the client-side to avoid bundle bloat and build errors.
* [ ] **Event Listener Throttling:** Lenis/GSAP scroll events fire constantly. Ensure UI updates attached to scroll (like `UIOverlay.tsx`) use `useFrame` or are heavily throttled/debounced. Avoid triggering React state updates on every frame.
* [ ] **Worker Threads:** Offload heavy math, physics, or sorting algorithms to Web Workers so the main thread (UI and R3F) doesn't stutter.

### C. CSS & DOM Overlay (Tailwind & HTML)
* [ ] **Viewport Units:** Use `svh` or `dvh` instead of `100vh` to prevent layout thrashing when the mobile browser's address bar appears/disappears.
* [ ] **Will-Change & Hardware Acceleration:** Use `will-change: transform, opacity` on heavily animated DOM elements (like `ProjectModalV2`), but remove it after the animation completes to free up GPU memory.
* [ ] **Touch Targets:** Ensure all buttons, links, and close icons are at least 48x48px (Apple/Google accessibility standard).
* [ ] **Pointer Events:** Set `pointer-events-none` on the entire 3D canvas if the user doesn't need to interact with it directly (e.g., they just scroll the DOM). This saves the browser from calculating raycasting on every touch move.

---

## 3. Key Metrics to Track (The "Performance Compass")

When optimizing for mobile, track these strictly via Chrome DevTools (using mid-tier mobile throttling) and Lighthouse:

1. **Interaction to Next Paint (INP):** Measures UI responsiveness. Crucial for custom modals like `ProjectModalV2`. Target: **< 200ms**.
2. **Largest Contentful Paint (LCP):** How fast the first scene loads. Target: **< 2.5s**.
3. **Cumulative Layout Shift (CLS):** Target: **0.1 or less**. Ensure the Canvas and UI Overlays have fixed sizes.
4. **Frames Per Second (FPS):** Target a stable **60 FPS**, but accept a stable **30 FPS** on low-end devices over fluctuating between 20-60.
5. **JS Heap Size:** Monitor in DevTools. If it consistently grows while scrolling through the 15 scenes without dropping, you have a memory leak (usually lingering GSAP tweens or undisposed WebGL contexts). Target: **< 50MB-100MB** on mobile.
6. **Draw Calls:** Track via `renderer.info.render.calls`. Target: **< 100 draw calls per frame** on mobile.
7. **Triangle Count:** Target: **< 200,000 to 300,000 triangles** active at any given time.

---

## 4. Common Mistakes & Implementation Pitfalls

### A. The "Desktop First" Trap
* **Mistake:** Designing complex GSAP camera movements for a 16:9 screen and squeezing them onto a 9:16 phone.
* **Fix:** The 3D monolithic cube might clip off-screen or look tiny on phones. Implement conditional FOV (Field of View) and camera `position.z` based on aspect ratio.

### B. Scroll Hijacking (Lenis) on Mobile
* **Mistake:** Forcing Lenis smooth scrolling on touch devices. Mobile operating systems (iOS/Android) already have highly optimized, momentum-based native scrolling. Lenis can feel "heavy", laggy, or cause touch-action conflicts.
* **Fix:** Disable Lenis smoothing on touch devices (using device detection or media queries), or drastically reduce the lerp value. Let native mobile scrolling drive the GSAP `ScrollTrigger` progress.

### C. React State in the Render Loop
* **Mistake:** Calling `setState` inside `useFrame` or a GSAP `onUpdate` callback to update HTML text (e.g., a progress counter). This triggers a React re-render of the DOM tree 60 times a second, melting the mobile CPU.
* **Fix:** Use React Refs (`useRef`) to directly mutate DOM nodes (`ref.current.innerText = value`) bypassing React's render cycle completely for high-frequency updates.

### D. WebGL Context Loss
* **Mistake:** Ignoring the `"webglcontextlost"` event. Mobile browsers will kill your WebGL context aggressively if it uses too much memory (e.g., opening a heavy Project Modal while the 3D cube is fully rendered).
* **Fix:** Handle context recovery gracefully, or better, implement a "Performance Tier" system. If a low-end device is detected, don't load the 15th high-res texture.

### E. Raycasting Overload
* **Mistake:** Leaving R3F's default raycaster running on mobile. Touch screens fire continuous events.
* **Fix:** Only enable the raycaster on specific layers or components that require interaction. Disable it during camera transitions.

---

## 5. Strategic Advice & Suggestions

### 1. Implement a Performance Tier System (Progressive Enhancement)
Do not serve the same experience to an iPhone 15 Pro and a 5-year-old budget Android.
* **High Tier:** Full DPR, post-processing (bloom/AA), complex materials, 60fps.
* **Low Tier:** DPR fixed to 1, simple standard materials, post-processing disabled, cap animations to 30fps.
* *How:* Run a quick benchmark on initial load (measure time to render 1 frame) or check `navigator.hardwareConcurrency` and `devicePixelRatio`.

### 2. The "True Focus" and UI Modals
For `ProjectModalV2` and the `TrueFocus` component (which splits text by word):
* On mobile, wrapping hundreds of words in individual `<span>` tags creates a massive DOM tree.
* **Advice:** Limit the character count of TrueFocus on mobile, or only apply the effect to Headers (H1/H2) and leave paragraph text as standard blocks to reduce DOM depth and layout calculation time.

### 3. Testing Strategy via Custom Events
Since the application uses `window.dispatchEvent(new CustomEvent('scene-change', { detail: 5 }))` to jump scenes (bypassing Lenis timing):
* Create a dedicated Mobile Debug Menu (hidden via URL parameter, e.g., `?debug=true`) that allows you to instantly teleport to any of the 1.5x scaled scenes.
* Use this in combination with Chrome DevTools **CPU Throttling (4x slowdown)** to manually test the GSAP enter/exit animations of `ProjectModalV2` under heavy load.

### 4. Thermal Management Strategy
If a user stays on the site reading project details for 5 minutes, their phone will get hot if WebGL is constantly rendering.
* **Advice:** Implement a mechanism to detect user inactivity (no scroll/touch for 2 seconds). When idle, use R3F's `invalidateFrameloop` to stop rendering frames entirely until the user interacts again. This drops CPU/GPU usage to near zero while reading.

## Summary
Scaling to 1.5x size on mobile isn't about writing *more* code, it's about writing *stricter* code. The bottleneck will not be the network (if compressed), it will be the mobile GPU trying to paint a 3D canvas and a Tailwind HTML overlay simultaneously at 60 frames per second. Prioritize memory disposal, aggressive code-splitting, and respect the hardware limits of mobile devices.
