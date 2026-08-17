# ♿ Ionity Design System & Accessibility

## 📌 Design Principles: Modern Structure & 8-Bit Accents

MojaMind’s visual design system, engineered by **Johan Wilhelm van Antwerp** at **IONITY Global**, combines a high-contrast dark aesthetic, crisp geometric card layouts, and subtle 8-bit retro accents.

---

## 🎨 Color Palette Tokens

```
┌────────────────────────────────────────────────────────────────────────┐
│                        IONITY DESIGN PALETTE                           │
├──────────────────────────┬─────────────────────────┬───────────────────┤
│ Background: #1A1A1A      │ Primary Accent: #3366FF │ Text: #FFFFFF     │
│ (Deep Obsidian Card)     │ (Ion Electric Cobalt)   │ (Pure High-White) │
├──────────────────────────┼─────────────────────────┼───────────────────┤
│ SHOUT Teal: #00A896      │ Stellenbosch: #801B2A   │ Sunburst: #FFD166 │
│ (Growth & Vitality)      │ (Academic Heritage)     │ (Milestones/Gold) │
└──────────────────────────┴─────────────────────────┴───────────────────┘
```

---

## 📐 Layout & Visual Architecture

1. **Structured Geometric Grids**:
   * Crisp 1px borders with subtle dark elevation.
   * Eliminates cluttered visual noise to reduce cognitive load for users experiencing emotional distress.
2. **8-Bit Retro Gamification Elements**:
   * Pixel-art flower sprites in Moja Meadow.
   * Retro achievement badges and tactile chime sounds upon milestone completion.
3. **Collapsible Navigation Rail**:
   * Secondary wellness tools (Soundscapes, Meadow, Bubble Pop, Games) are consolidated behind the Settings Gear icon (`#vs-gear`), keeping the primary intervention pathway clean and prominent.

---

## ♿ Accessibility (WCAG 2.1 AA Compliance)

1. **Screen Reader Optimizations**:
   * Complete ARIA role modeling (`role="region"`, `aria-expanded`, `aria-live="polite"`, `aria-label`).
   * Semantic heading hierarchy (`h1` through `h4`) on every view.
2. **Low-Literacy & Cognitive Accessibility**:
   * Multi-modal instructions (spoken audio narration, animated walkthroughs, and clear visual iconography accompany all text).
3. **Motor & Visual Impairment Accommodations**:
   * Large touch targets ($\ge 48 \times 48\,\text{px}$).
   * Full keyboard navigation and visible focus rings.
   * Dynamic support for `prefers-reduced-motion` to disable particle bursts and auto-animations for users prone to vestibular discomfort.

---

*© 2026 IONITY Global (Pty) Ltd · Solutionist: Johan Wilhelm van Antwerp*
