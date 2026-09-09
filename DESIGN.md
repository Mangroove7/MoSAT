# MoSAT Design Direction (DESIGN.md)

This document establishes the deliberate design direction, brand identity, and UI constraints for **MoSAT** to ensure adherence to Anti-Slop standards.

---

## 🎯 Product Identity & Audience
- **Product**: MoSAT (Digital SAT Lab & Prep Engine)
- **Target Audience**: High-performing Digital SAT students targeting top-tier scores (1500–1600).
- **Tone**: Focused, rigorous, analytical, honest, and distraction-free.

---

## 🎨 Color Palette & Contrast (WCAG AA Compliant)
MoSAT adopts the **DSAT16** signature colorway:
- **Primary Accent**: Electric Orange (#f97316 / 
gb(249, 115, 22))
- **Secondary Accent**: Warm Amber / Gold (#f59e0b / #d97706)
- **Dark Surfaces**: Zinc-950 (#09090b), Zinc-900 (#18181b), Zinc-800 (#27272a)
- **Light Surfaces**: Clean White (#ffffff), Stone-50 (#fafaf9), Zinc-100 (#f4f4f5)
- **Feedback Accents**:
  - Correct / Mastery: Emerald-600 (#059669), Emerald-50 background
  - Mistake / Alert: Rose-600 (#e11d48), Rose-50 background
- **Contrast Lock**: All text must maintain minimum 4.5:1 contrast against its background. No faint gray text on white or dark-on-dark unreadable labels.

---

## 🎛️ Anti-Slop Dials
- **ENERGY: 2** (Focused academic intensity, high signal-to-noise ratio, zero cartoonish animations)
- **RHYTHM: 2** (Strict SAT module layout, clear grid alignment, purpose-driven whitespace)
- **MOTION: 1** (Snappy, utilitarian state transitions <= 150ms; no gratuitous floating or bouncing elements)

---

## 🚫 Slop Prevention Locks
1. **Zero Fictional Claims**: All metrics reflect genuine database records (2,881 official College Board questions, 70 authentic SAT vocab words, real student answer timestamps).
2. **Zero Dead Buttons**: Every button, pill, tab, and toggle must execute a real handler, open a modal, or transition state.
3. **No Decorative Clutter**: Icons (Lucide) are used solely for informational clarity (e.g. calculator for Desmos, flame for streak, book for vocab). No generic sparkles, orbs, or floating decorative blobs.
4. **Authentic Official Testing Environment**: Test and drill sessions mirror the official Bluebook interface (split-pane reading passage, elimination strike-through, mark for review, and draggable non-modal floating Desmos calculator).
