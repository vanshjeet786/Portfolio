import re

with open('src/stores/useStore.ts', 'r') as f:
    content = f.read()

# Add isModalOpen to the interface
interface_replacement = """interface StoreState {
  progress: number;
  setProgress: (progress: number) => void;
  activeScene: number;
  setActiveScene: (index: number) => void;
  isModalOpen: boolean;
  setModalOpen: (isOpen: boolean) => void;
}"""

content = re.sub(r'interface StoreState \{.*?\}', interface_replacement, content, flags=re.DOTALL)

# Add isModalOpen to the initial state and setter
state_replacement = """export const useStore = create<StoreState>((set) => ({
  progress: 0,
  setProgress: (progress) => set({ progress: Math.max(0, Math.min(1, progress)) }),
  activeScene: 0,
  setActiveScene: (activeScene) => set({ activeScene }),
  isModalOpen: false,
  setModalOpen: (isModalOpen) => set({ isModalOpen }),
}));"""

content = re.sub(r'export const useStore = create<StoreState>\(\(set\) => \(\{.*?\}\)\);', state_replacement, content, flags=re.DOTALL)

with open('src/stores/useStore.ts', 'w') as f:
    f.write(content)
