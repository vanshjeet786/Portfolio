# 🗺️ The Complete Scroll Progress Map (0.0 to 1.0)

The scroll progress is centrally managed by `ScrollManager.tsx` which manipulates a `progress` value (from 0.0 to 1.0) in the global `useStore`. This progress dictates the camera movement, the active 3D scene (0 through 9), and the UI displayed over it in `UIOverlay.tsx`.

The website is divided into **10 distinct scenes**, uniformly spaced across the 0.0 to 1.0 progress range (each scene center represents roughly an 11.1% increment).

## 🎬 Scene 0: Home (Progress: 0.00)
*   **3D Scene:** `IntroScene` (A floating monolithic structure)
*   **UI Components:** `TrueFocus` (rendering your name), basic intro text ("Full-stack Software Engineer", etc.)
*   **Texts:**
    *   "VANSHJEET"
    *   "Vanshjeet Singh"
    *   "Full-stack Software Engineer"
    *   "Specializing in highly scalable distributed systems..."
*   **Interactions:** Hovering over the text triggers a glitch effect and sound.

## 🚶‍♂️ Transition Void 1 (Progress: ~0.11)
*   **3D Scene:** The camera moves through empty space towards the next scene.
*   **Narrative Text Event:** (Fades in center screen)
    *   **Range:** `0.15` - `0.25`
    *   **Texts:**
        *   "You're lost. Maybe?"
        *   "I DEVELOPED a 6-LAYER AI Career Counsellor"
        *   "The priority was to ensure it doesn't assess"
        *   "Using RIASEC, Big 5, MBTI, Multiple Presonality"
        *   "And a few open ended questions to undertsnad someone better"

## 🧭 Scene 1: Compass (Progress: ~0.22)
*   **3D Scene:** `CareerCompass` (A wireframe geometric shape)
*   **UI Components:** A glowing "Inspect" trigger button that opens a large modal.
*   **Texts:** Modal includes project details for "Career Compass", "Graph-based skill progression system...", etc.
*   **Interactions:** Clicking the trigger opens the compass detail modal.

## 🚶‍♂️ Transition Void 2 (Progress: ~0.33)
*   **3D Scene:** The camera moves through empty space towards the next scene.
*   **Narrative Text Event:** (Fades in center screen)
    *   **Range:** `0.35` - `0.45`
    *   **Texts:**
        *   "This one Judges"
        *   "I built a 4-layer soft skills assessment test"
        *   "The priority here was to ensure the accuracy"
        *   "Most of the questions do not have an incorrect answer"
        *   "It just evaluates the thinking of a person"

## 📊 Scene 3: Skillometer (Progress: ~0.44)
*   *(Note: The scene index is 3, skipping 2 in the DOM rendering logic, likely due to a previous architectural change).*
*   **3D Scene:** `Skillometer` (An abstract representation of skills)
*   **UI Components:** An "Evaluate" trigger button that opens the Skillometer modal.
*   **Texts:** Modal includes "Skillometer", "Real-time competency tracking matrix...", "Protocol: A 3D SPINE MODEL", "SUPPORT: Uptime".
*   **Interactions:** Clicking the trigger opens the Skillometer detail modal.

## 🚶‍♂️ Transition Void 3 (Progress: ~0.55)
*   **3D Scene:** The camera moves through empty space towards the next scene.
*   **Narrative Text Event:** (Fades in center screen)
    *   **Range:** `0.58` - `0.68`
    *   **Texts:**
        *   "I designed a chat app and a Leaderboard Platform"
        *   "As a project  for a company."
        *   "Priority was Database design, idempotency and api functions"
        *   "Idempotency"
        *   "And API functions calls using CURL"

## 🕸️ Scene 5: Ethereal Network (Mini Projects) (Progress: ~0.66)
*   *(Note: The scene index is 5, skipping 4 in the DOM rendering logic).*
*   **3D Scene:** There is **no 3D mesh** for this scene (`CanvasContainer.tsx` explicitly notes this). It is entirely DOM-based.
*   **UI Components:** `EtherealNetwork` (A dual-pane interactive glass layout).
*   **Texts:** Features two interactive project panes:
    *   **Exiles** (Real-time Communication Infrastructure)
    *   **Leaderboard** (High-frequency Event Processing)
*   **Interactions:** Mouse movement creates a 3D parallax effect on the cards. Clicking a card expands it to show detailed specs (Architecture, Scale, Role, Stack).

## 🚶‍♂️ Transition Void 4 (Progress: ~0.77)
*   **3D Scene:** The camera moves through empty space towards the next scene.
*   **Narrative Text Event:** (Fades in center screen)
    *   **Range:** `0.70` - `0.81`
    *   **Texts:**
        *   "Designed set of web pages"
        *   "" *(Empty string to clear the text)*
        *   "Priority was SEO"

## 🛡️ Scene 7: Stance (Progress: ~0.88)
*   *(Note: The scene index is 7, skipping 6 in the DOM rendering logic).*
*   **3D Scene:** `StanceScene` (A rigid structural representation)
*   **UI Components:** An "Analyze" crosshair trigger that opens the Stance modal.
*   **Texts:** Modal includes "Stance", "Stance was built to ensure perfect alignment in highly rigid, structured data pipelines..."
*   **Interactions:** Clicking the trigger opens the Stance detail modal.

## 🚶‍♂️ Final Transition (Progress: ~0.94)
*   **Narrative Text Event:** (Fades in center screen)
    *   **Range:** `0.85` - `0.95`
    *   **Texts:**
        *   "Hello!!!"
        *   "I am Vansh"
        *   "Would love to connect!"

## 🔚 Scene 9: The Terminal (Outro) (Progress: 1.00)
*   *(Note: The scene index is 9, skipping 8 in the DOM rendering logic).*
*   **3D Scene:** `OutroScene` (The final destination)
*   **UI Components:** A "Connect" pulse trigger that opens the final links modal.
*   **Texts:** "That's it. For Now....", followed by links to GitHub, LinkedIn, and Mail.

---

### 🕵️‍♂️ Investigation: `LeaderboardUI.tsx` and `ExilesUI.tsx`

You asked specifically about the narrative texts inside `LeaderboardUI.tsx` and `ExilesUI.tsx`, noting the following code block:

```javascript
  if (scrollProgress >= 0.865 && scrollProgress < 0.875) {
    narrativeText = 'Practice.';
  } else if (scrollProgress >= 0.875 && scrollProgress < 0.885) {
    narrativeText = 'Iteration.';
  // ... etc ...
```

**Do they actually exist? When and where do they exist?**

**Answer: No, they do not exist anywhere in the active application.**

**Here is exactly what is happening:**
1.  **They are Dead Code:** Both `LeaderboardUI.tsx` and `ExilesUI.tsx` are completely unused legacy files. Neither file is imported or rendered anywhere in the application (not in `App.tsx`, not in `CanvasContainer.tsx`, and not in `UIOverlay.tsx`).
2.  **The V2 Architecture Shift:** The architecture was recently migrated to a central "V2" system (everything inside `src/components/v2/`). In this new V2 architecture, the Exiles and Leaderboard projects were combined into a single interactive component called `EtherealNetwork` (rendered during Scene 5).
3.  **The New Narrative System:** The old scroll-based narrative logic inside those legacy UI files (e.g., checking `scrollProgress >= 0.865`) was completely replaced by a new, centralized `activeNarrativeText` engine located inside `src/components/v2/UIOverlay.tsx`.

Because those files are never imported, the dramatic "Practice. Iteration. Improvement. Competition. Recognition." sequence from `LeaderboardUI.tsx` and the "Distance is a feeling, not a distance." sequence from `ExilesUI.tsx` **will never be seen by the user.**

If you want those dramatic texts to appear, you would need to add them into the `NARRATIVE_TEXTS_X` arrays inside `src/components/v2/UIOverlay.tsx` and adjust the scroll progress timing logic there.
