# Mobile Optimization Execution Prompt

**Role:** You are an elite Frontend Performance & UX Engineer specializing in WebGL and highly interactive React applications.

**Task:** Execute a comprehensive mobile optimization pass on our codebase (React, Three.js/R3F, GSAP, Anime.js, Tailwind CSS v4).

**Core Directives:**
1. **Experience Preservation is Paramount:** Do not blindly strip features. If a 3D effect or animation is too heavy, find a graceful degradation (e.g., simpler shaders, CSS fallbacks, or baked assets) that maintains our brand's "quiet confidence, craftsmanship, and timeless design."
2. **Impeccable UX & Spacing:** Mobile is not just a squished desktop. Great emphasis must be placed on typography scaling, generous breathing room (spacing), and ergonomic component placement (e.g., accessible touch targets).
3. **Execution Protocol:** You must execute this in distinct phases. **STOP** and request user review and approval at the checkpoint at the end of each phase before proceeding to the next.

---

## Phase 1: Foundation & Viewport Adaptation
**Objective:** Fix structural layout issues and prepare the environment for touch interactions.
*   **Tasks:**
    *   Audit and replace any `100vh` usages with Tailwind's dynamic viewport height (`h-dvh` or `min-h-dvh`) to prevent layout jumping when mobile browser UI elements appear/disappear.
    *   Implement fluid typography using CSS `clamp()` for primary headers and text, ensuring elegant readability without harsh breakpoint jumps.
    *   Ensure a global configuration for touch interactions (e.g., disabling native pull-to-refresh if it conflicts with our scroll-jacking, configuring Lenis smooth scroll specifically for touch devices).
*   **Checkpoint 1:** Review structural layout stability. Verify no vertical jumping on mobile scroll. Confirm typography feels proportionate on narrow screens. **[WAIT FOR USER APPROVAL]**

## Phase 2: UI/UX, Spacing & Touch Ergonomics
**Objective:** Adapt the user interface components for mobile ergonomics while maintaining aesthetic breathing room.
*   **Tasks:**
    *   **Touch Targets:** Ensure all interactive elements (buttons, navigation, links) have a minimum touch target area of 44x44px. Use padding (`p-3`, `p-4`) rather than hard width/height to preserve visual design while expanding tap zones.
    *   **Spacing:** Audit `ProjectModalV2.tsx` and other global modals. Constrain max-widths, ensure perfect centering, and significantly increase padding on mobile to prevent content from feeling claustrophobic.
    *   **Placement:** Move critical interactive elements to the lower third of the screen if they are currently unreachable with one-handed use, or ensure persistent top-right navigation is highly prominent but unobtrusive.
    *   **Hover States:** Identify critical information hidden behind hover states (as mobile has no hover) and redesign components to surface this information persistently or via tap.
*   **Checkpoint 2:** Review UI ergonomics on a mobile emulator/device. Test touch targets and verify that modal spacing feels premium and uncrowded. **[WAIT FOR USER APPROVAL]**

## Phase 3: 3D/WebGL Performance Optimization (Three.js & R3F)
**Objective:** Prevent thermal throttling and crashes by drastically reducing the GPU/Memory footprint of the 3D scene (the central monolithic cube, etc.) on mobile.
*   **Tasks:**
    *   **DPR Capping:** Implement a hard cap on the Device Pixel Ratio in the `<Canvas>` component for mobile devices (e.g., `dpr={[1, 1.5]}`) so we do not render native 3x or 4x resolutions.
    *   **Adaptive Degradation:** Implement `@react-three/drei`'s `AdaptiveDpr` and `AdaptiveEvents` to degrade visual fidelity dynamically during camera movement.
    *   **Asset & Material Downgrades:** For mobile breakpoints, swap out heavy textures for lower-res versions, or downgrade materials (e.g., `meshStandardMaterial` to `meshBasicMaterial`) where hyper-realistic lighting is unnecessary.
    *   **Shadows & Post-processing:** Disable real-time shadows and expensive post-processing (like heavy bloom or ambient occlusion) on mobile, replacing them with baked contact shadows if necessary.
*   **Checkpoint 3:** Review 3D performance using `r3f-perf`. Verify GPU load and memory allocation are significantly reduced on mobile devices. **[WAIT FOR USER APPROVAL]**

## Phase 4: Animation & Interaction Refinement (GSAP, Anime.js)
**Objective:** Ensure animations are buttery smooth on mobile CPUs without blocking the main thread.
*   **Tasks:**
    *   **GSAP MatchMedia:** Wrap existing complex GSAP timelines in `gsap.matchMedia()`. Simplify or completely remove heavy staggered animations for screens under 768px.
    *   **Compositor-Only Animations:** Audit all animations to ensure *only* `transform` and `opacity` are being animated. Remove any animations affecting layout (width, margin, top/left).
    *   **Off-screen Pausing:** Use `IntersectionObserver` to aggressively pause any R3F `useFrame` loops or GSAP timelines that are not currently in the mobile viewport.
    *   **Glassmorphism Limit:** Drastically reduce the use of `backdrop-filter: blur()` (e.g., Glass Surfaces). Replace with semi-transparent solid colors (Slate/Clay) on mobile to save GPU cycles.
*   **Checkpoint 4:** Review scrolling and animation smoothness. Confirm INP (Interaction to Next Paint) feels instantaneous. **[WAIT FOR USER APPROVAL]**

## Phase 5: Final Polish & Experience Preservation
**Objective:** A holistic review to ensure the "timeless design" essence is intact despite optimizations.
*   **Tasks:**
    *   Verify the `TrueFocus` component uses `splitBy="word"` instead of "letter" to avoid overloading the mobile DOM.
    *   Ensure the Anime.js dynamic import strategy is functioning correctly and not blocking initial page load.
    *   Conduct a final pass on copywriting presentation, ensuring texts in `UIOverlay.tsx` orchestrate beautifully with the 10-scene scroll progress on a small screen.
*   **Final Checkpoint:** Complete end-to-end user journey test on a mobile device. Verify that despite performance downgrades, the experience still feels premium, intentional, and highly crafted. **[WAIT FOR USER APPROVAL TO CONCLUDE]**
