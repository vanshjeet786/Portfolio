import re

with open('src/components/v2/UIOverlay.tsx', 'r') as f:
    content = f.read()

# Update Compass Modal
content = re.sub(
    r'className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-\[90vw\] md:w-\[80vw\] max-w-6xl h-\[80vh\].*?"',
    r'className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] md:w-[80vw] max-w-4xl h-[80vh] flex flex-col bg-[#050505]/95 backdrop-blur-3xl border border-white/10 rounded-2xl p-8 md:p-16 overflow-y-auto custom-scrollbar shadow-[0_30px_100px_rgba(255,255,255,0.05)]"',
    content,
    count=1
)

# Update Skillometer Modal
content = re.sub(
    r'className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-\[90vw\] md:w-\[80vw\] max-w-7xl h-\[80vh\].*?shadow-\[0_30px_100px_rgba\(255,215,0,0.1\)\]"',
    r'className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] md:w-[80vw] max-w-4xl h-[80vh] flex flex-col bg-[#050505]/95 backdrop-blur-3xl border border-white/10 rounded-2xl p-8 md:p-16 overflow-y-auto custom-scrollbar shadow-[0_30px_100px_rgba(255,215,0,0.1)]"',
    content,
    count=1
)

# Update Stance Modal
content = re.sub(
    r'className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-\[90vw\] md:w-\[80vw\] max-w-7xl h-\[80vh\].*?shadow-\[0_30px_100px_rgba\(225,29,72,0.1\)\]"',
    r'className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] md:w-[80vw] max-w-4xl h-[80vh] flex flex-col items-center bg-[#050505]/95 backdrop-blur-3xl border border-white/10 rounded-2xl p-8 md:p-16 overflow-y-auto custom-scrollbar shadow-[0_30px_100px_rgba(225,29,72,0.1)]"',
    content,
    count=1
)

# Update Terminal Modal
content = re.sub(
    r'className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-\[90vw\] md:w-\[80vw\] max-w-7xl h-\[80vh\].*?shadow-\[0_30px_100px_rgba\(0,240,255,0.1\)\]"',
    r'className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] md:w-[80vw] max-w-4xl h-[80vh] z-30 flex-col items-center justify-center bg-[#050505]/95 backdrop-blur-3xl border border-white/10 rounded-2xl p-8 md:p-16 overflow-y-auto custom-scrollbar shadow-[0_30px_100px_rgba(0,240,255,0.1)]"',
    content,
    count=1
)

with open('src/components/v2/UIOverlay.tsx', 'w') as f:
    f.write(content)
