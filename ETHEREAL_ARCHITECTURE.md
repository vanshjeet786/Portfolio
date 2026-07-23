# Ethereal Network Architecture (Exiles & Leaderboard)

This document maps out the comprehensive architecture of the Ethereal Network section, which encapsulates the "Exiles" and "Leaderboard" projects within the V2 architecture of the portfolio.

## 1. Core Architecture & File Placement

The V2 architecture migrates away from continuous Z-axis scrolling in Three.js towards a strictly scene-based progression managed by a central store.

### Active V2 Files

*   **`src/components/v2/ui/EtherealNetwork.tsx`**
    *   **Role:** The core interactive DOM overlay for Scene 5 (Ethereal Network). It handles the presentation of both the Exiles and Leaderboard project panes.
    *   **Placement:** Inserted in `src/components/v2/UIOverlay.tsx` at line 421.
    *   **Key Functions/Components:**
        *   `EtherealNetwork`: The main orchestrator component.
        *   `ProjectPane`: A reusable component that renders either the Exiles or Leaderboard card, handling its active/inactive/hover states.
    *   **State Management:**
        *   Uses `useStore` to toggle the global modal state: `const setModalOpen = useStore((state) => state.setModalOpen);`.

*   **`src/components/v2/UIOverlay.tsx`**
    *   **Role:** The global UI orchestrator.
    *   **Placement:** Handles the display of `EtherealNetwork` based on the active scene.
    *   **Code Lines:**
        *   Line 5: `import { EtherealNetwork } from './ui/EtherealNetwork';`
        *   Line 419-421: Renders `<EtherealNetwork isActive={displayedScene === 5} />`.

*   **`src/stores/useStore.ts`**
    *   **Role:** Global state management for scroll progress and scene selection.
    *   **Scroll Mapping:** The scroll progress (0.0 to 1.0) is mapped to 10 distinct scenes.
    *   **Code Lines:**
        *   Line 14: `// 0: Home, 1: Compass, 2: Void, 3: Skillometer, 4: Void, 5: Ethereal Network, 6: Void, 7: Stance`
        *   Scene 5 is specifically designated for the Ethereal Network.

*   **`src/components/v2/scenes/Exiles.tsx`**
    *   **Role:** Contains the 3D logic (Three.js / React Three Fiber) for the Exiles scene.
    *   **Key Components:**
        *   Central Quantum Obelisk: A `mesh` with `boxGeometry` and a complex `meshPhysicalMaterial` (emissive crimson, high metalness/transmission).
        *   Signal Beam: An emissive `cylinderGeometry` inside the obelisk.
        *   Exiles (Glass Shards): An array of 20 orbiting shards (`tetrahedronGeometry` with glass-like `meshPhysicalMaterial`).
    *   **Animation (`useFrame`):** Rotates the main group slowly and orbits the shards based on `state.clock.elapsedTime`.

*   **`src/components/v2/CanvasContainer.tsx`**
    *   **Role:** Manages the rendering of 3D scenes.
    *   **Code Lines:**
        *   Line 46 explicitly notes: `{/* Scene 5 (Exiles/Leaderboard) is entirely DOM-based, so no 3D mesh here */}`. *Note: Even though `Exiles.tsx` exists, the V2 implementation heavily relies on the DOM-based `EtherealNetwork` for Scene 5.*

### Dead / Legacy V1 Files (To be removed)

The following files belong to the V1 continuous-scroll architecture and are deprecated:

*   `src/components/ExilesUI.tsx`: Old DOM overlay for Exiles (active between scroll 0.775 - 0.855).
*   `src/components/LeaderboardUI.tsx`: Old DOM overlay for Leaderboard (active between scroll 0.865 - 0.94).
*   `src/worlds/ExilesWorld.tsx`: Old 3D world grouping `SignalCityEnvironment` and `TheBeaconNetwork` at Z=-120.
*   `src/worlds/LeaderboardWorld.tsx`: Old 3D world grouping `TheArenaEnvironment` and `TheKineticMonolith` at Z=-160.

---

## 2. GSAP Animations & Modal Logic

All GSAP animations for the Ethereal section are contained within `src/components/v2/ui/EtherealNetwork.tsx`.

### Base Transforms
Constants dictate the resting 3D positions of the project panes to create a sense of depth:
*   `EXILES_BASE`: `{ x: -280, y: 0, z: -100, rotateY: 15, scale: 0.95, opacity: 0.6 }`
*   `LEADERBOARD_BASE`: `{ x: 280, y: 0, z: -100, rotateY: -15, scale: 0.95, opacity: 0.6 }`

### Mount / Unmount Orchestration (`useEffect` for `isActive`)
*   **Mount (Entry):**
    *   Container fades in (`opacity: 1`, duration 1.5s).
    *   Exiles pane animates from `y: 100`, `opacity: 0` to its base transform (duration 1.5s, delay 0.2s, ease `power3.out`).
    *   Leaderboard pane animates similarly but with a 0.3s delay.
*   **Unmount (Exit):**
    *   Container fades out (`opacity: 0`, duration 0.8s). On complete, resets active/hovered states and closes the modal via `setModalOpen(false)`.

### Parallax & Hover Orchestration (`useEffect` for mouse interaction)
Tracks mouse movement via `handleMouseMove` (setting `mouseRotX` and `mouseRotY`).
*   **Hovering Exiles:**
    *   Exiles pane pushes forward (`z: 50`, `scale: 1`, `opacity: 1`) and tracks mouse rotation (duration 0.6s).
    *   Leaderboard pane pushes back (`z: -200`, `scale: 0.8`, `opacity: 0.3`) and applies a `blur(8px)` filter.
*   **Hovering Leaderboard:** Inverts the logic applied during Exiles hover.
*   **Rest:** Returns both panes to base transforms + mouse rotation tracking.

### Click / Modal Orchestration (`useEffect` for `activeProject`)
*   **Activating Exiles:**
    *   Exiles pane centers and scales up (`x: 0, y: 0, z: 200, rotateX: 0, rotateY: 0, scale: 1`).
    *   Leaderboard pane pushes far right and back (`x: 300, z: -500`, `opacity: 0`, `blur(20px)`).
    *   Toggles global modal state: `setModalOpen(true)`.
*   **Activating Leaderboard:**
    *   Leaderboard pane centers and scales up.
    *   Exiles pane pushes far left and back (`x: -300, z: -500`).
*   **Deactivating (Escape key or clicking background):**
    *   Returns both to base transforms.
    *   Toggles global modal state: `setModalOpen(false)`.

---

## 3. Scroll Progress & State Mapping

*   **Store:** `src/stores/useStore.ts`
*   **Logic:** The application does not use absolute Z-axis positions for scenes anymore. Instead, scroll progress (`0.0` to `1.0`) maps directly to an index of active scenes (0 to 9, for a total of 10 scenes).
*   **Scene 5:** Ethereal Network is hardcoded as Scene 5.
*   **Trigger:** In `UIOverlay.tsx`, `<EtherealNetwork isActive={displayedScene === 5} />` listens to `displayedScene` (which is derived from `useStore((s) => s.activeScene)`). When the user scrolls to the portion of the page corresponding to index 5, `isActive` becomes true, triggering the GSAP mount animations.

---

## 4. 3D and Shader Configurations

While the Ethereal UI is heavily DOM-based, the architectural legacy includes 3D elements (mostly in `src/components/v2/scenes/Exiles.tsx`):

*   **Lighting:**
    *   Intense Crimson/Copper core light (`<pointLight color="#e11d48" intensity={4} />`).
*   **Central Quantum Obelisk:**
    *   Geometry: `boxGeometry args={[1.5, 12, 1.5]}`
    *   Material: `meshPhysicalMaterial` with deep black color (`#050505`), crimson emissive (`#220000`), high metalness (`0.9`), high transmission (`0.95`), and Index of Refraction (IOR) of `1.6`.
*   **The Signal Beam:**
    *   Geometry: `cylinderGeometry args={[0.05, 0.05, 12, 16]}`
    *   Material: Solid emissive standard material (`#e11d48` with intensity 5).
*   **Orbiting Shards:**
    *   Geometry: `tetrahedronGeometry args={[1, 0]}`
    *   Material: Glass-like `meshPhysicalMaterial` (`metalness={0.8}`, `transmission={1}`, `ior={1.3}`).
    *   Animation: Calculated per frame in `useFrame` using sine/cosine functions mapped to `state.clock.elapsedTime` and a predefined speed/scale configuration.

---

## 5. Deprecated 3D Environments (V1 Architecture Details)

These files represent the physical 3D spaces of the original continuous scroll architecture.

### `src/worlds/SignalCityEnvironment.tsx`
*   **Role:** The 3D architectural volume for the Exiles World ("The Signal City").
*   **Design Philosophy:** "Physical First Concept: Imagine a vast, abandoned signal relay city — massive graphite towers connected by suspended walkways of dark walnut and steel cable. Warm amber windows glow from within."
*   **Materials:** Steel, Graphite, Dark Walnut, Amber Glass, Concrete. Strictly avoids sci-fi/holograms/blue neon.
*   **Key Geometries & Lighting:**
    *   **Towers:** 9 hand-placed asymmetrical towers made of `MeshStandardMaterial` (graphite).
    *   **Bridges:** Walnut planks connecting the towers, complete with steel cables and handrails.
    *   **Lighting:** Warm amber directional light (`#e8a050`), a central point light (`#d06020`), and deep ambient light (`#1a1510`).

### `src/worlds/TheArenaEnvironment.tsx`
*   **Role:** The 3D environment for the Leaderboard project ("The Arena").
*   **Concept:** A monumental, cold, competitive space. (Specific details are found within the file, likely utilizing brutalist geometry and stark lighting).

### `src/worlds/TheBeaconNetwork.tsx`
*   **Role:** Likely handles the specific 3D signal/network visualizations within the Exiles (Signal City) environment.

### `src/worlds/TheKineticMonolith.tsx`
*   **Role:** A central 3D feature within The Arena (Leaderboard), representing competition or status.

*Note: These files are preserved in the repository but have been removed from the main `RenderCanvas` rendering loop as part of the V2 migration.*
