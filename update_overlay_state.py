import re

with open('src/components/v2/UIOverlay.tsx', 'r') as f:
    content = f.read()

# Make sure setModalOpen is imported from useStore
if 'setModalOpen' not in content:
    content = content.replace('const activeScene = useStore((state) => state.activeScene);', 'const activeScene = useStore((state) => state.activeScene);\n  const setModalOpen = useStore((state) => state.setModalOpen);')

# Update setIsCompassOpen
content = content.replace('setIsCompassOpen(true)', '{ setIsCompassOpen(true); setModalOpen(true); }')
content = content.replace('setIsCompassOpen(false)', '{ setIsCompassOpen(false); setModalOpen(false); }')

# Update setIsSkillometerOpen
content = content.replace('setIsSkillometerOpen(true)', '{ setIsSkillometerOpen(true); setModalOpen(true); }')
content = content.replace('setIsSkillometerOpen(false)', '{ setIsSkillometerOpen(false); setModalOpen(false); }')

# Update setIsStanceOpen
content = content.replace('setIsStanceOpen(true)', '{ setIsStanceOpen(true); setModalOpen(true); }')
content = content.replace('setIsStanceOpen(false)', '{ setIsStanceOpen(false); setModalOpen(false); }')

# Update setIsTerminalOpen
content = content.replace('setIsTerminalOpen(true)', '{ setIsTerminalOpen(true); setModalOpen(true); }')
content = content.replace('setIsTerminalOpen(false)', '{ setIsTerminalOpen(false); setModalOpen(false); }')


# The replacement above might result in nested braces if they were already inside a block or if there were multiple calls.
# Let's clean up manually using regex to be safe.

with open('src/components/v2/UIOverlay.tsx', 'w') as f:
    f.write(content)
