import { create } from 'zustand';

export interface InteractionStoreState {
  cursorPosition: { x: number; y: number };
  hoverTarget: string | null;
  isHovering: boolean;
  scrollProgress: number;
  keyboardFocus: string | null;
  isMouseDown: boolean;
  setCursorPosition: (x: number, y: number) => void;
  setHoverTarget: (target: string | null) => void;
  setScrollProgress: (progress: number) => void;
  setKeyboardFocus: (focus: string | null) => void;
  setMouseDown: (isDown: boolean) => void;
}

export const useInteractionStore = create<InteractionStoreState>((set) => ({
  cursorPosition: { x: 0, y: 0 },
  hoverTarget: null,
  isHovering: false,
  scrollProgress: 0,
  keyboardFocus: null,
  isMouseDown: false,
  setCursorPosition: (x, y) => set({ cursorPosition: { x, y } }),
  setHoverTarget: (hoverTarget) => set({ hoverTarget, isHovering: hoverTarget !== null }),
  setScrollProgress: (scrollProgress) => set({ scrollProgress }),
  setKeyboardFocus: (keyboardFocus) => set({ keyboardFocus }),
  setMouseDown: (isMouseDown) => set({ isMouseDown }),
}));
