# Phase-4-Interaction-Language/11_PERFORMANCE_GUIDELINES.md

# Performance Guidelines

Version 1.0

---

# Philosophy

Performance is part of the experience.

Smoothness creates trust.

Lag creates doubt.

Visitors should never notice optimisation.

Only responsiveness.

---

# Performance Targets

Desktop

60 FPS

Tablet

55–60 FPS

Mobile

50–60 FPS

Loading

Perceived instant.

---

# Loading Strategy

Initial shell.

↓

Critical assets.

↓

Current world.

↓

Next world.

↓

Remaining assets.

Never load everything immediately.

---

# Three.js

Reuse geometry.

Reuse materials.

Reuse shaders.

Dispose resources.

Avoid unnecessary draw calls.

Compress textures.

---

# React

Lazy routes.

Memoisation where meaningful.

Virtualisation if required.

Avoid unnecessary renders.

---

# Images

AVIF

WebP

Responsive sizes.

Lazy loading.

Blur placeholders.

---

# Animation

Prefer transforms.

Avoid layout recalculation.

Avoid expensive filters.

Limit simultaneous timelines.

---

# Fonts

Subset.

Preload.

Avoid layout shifts.

Maximum two families.

---

# Video

Avoid autoplay.

Only load when entering relevant world.

Provide static fallback.

---

# Lighthouse Goals

Performance

95+

Accessibility

100

Best Practices

100

SEO

100

---

# Review Checklist

Can this asset be smaller?

Can this animation be simpler?

Can this component be deferred?

Can this render be skipped?

Every feature should justify its cost.

---

# Success

The visitor remembers the experience.

Not the loading.
