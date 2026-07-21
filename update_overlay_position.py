import re

with open('src/components/v2/UIOverlay.tsx', 'r') as f:
    content = f.read()

# Change narrative position to top-[75%]
content = content.replace('className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center w-full max-w-4xl px-8 z-10"', 'className="absolute top-[75%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center w-full max-w-4xl px-8 z-10"')

with open('src/components/v2/UIOverlay.tsx', 'w') as f:
    f.write(content)
