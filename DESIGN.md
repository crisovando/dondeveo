---
name: Donde veo
description: A dark, content-first streaming availability atlas for Argentina — one answer, one tap, no noise.
colors:
  dondeveo-red: "oklch(55% 0.22 25)"
  dondeveo-red-hover: "oklch(60% 0.22 25)"
  accent-amber: "oklch(75% 0.1 35)"
  focus-blue: "oklch(65% 0.15 250)"
  focus-blue-hover: "oklch(60% 0.15 250)"
  blue-light: "oklch(80% 0.08 253)"
  background: "oklch(12% 0.01 260)"
  surface-base: "oklch(20% 0 0)"
  surface-elevated: "oklch(26% 0 0)"
  surface-container-low: "oklch(20% 0 0)"
  surface-container-low-hover: "oklch(24% 0 0)"
  nav-raisin: "oklch(15% 0.02 15)"
  nav-raisin-glass: "oklch(13% 0.025 15 / 0.72)"
  text: "oklch(85% 0 0)"
  text-bright: "oklch(90.7% 0.003 35.8)"
  text-dimmed: "oklch(75% 0.05 35)"
  text-muted: "oklch(60% 0 0)"
  border-subtle: "oklch(25% 0.01 260)"
  border-card: "oklch(100% 0 0 / 0.05)"
  border-nav: "oklch(100% 0 0 / 0.06)"
  overlay: "oklch(0% 0 0 / 0.5)"
  white: "oklch(100% 0 0)"
typography:
  display:
    fontFamily: "Epilogue, system-ui, sans-serif"
    fontSize: "clamp(32px, 8vw, 48px)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Epilogue, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.5
  title:
    fontFamily: "Epilogue, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 700
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    letterSpacing: "0.1em"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  xxs: "4px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.dondeveo-red}"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  button-primary-hover:
    backgroundColor: "{colors.dondeveo-red-hover}"
  button-pill:
    backgroundColor: "{colors.dondeveo-red}"
    textColor: "{colors.white}"
    rounded: "{rounded.full}"
    height: "2.25rem"
    padding: "0 0.875rem"
  button-pill-hover:
    backgroundColor: "{colors.dondeveo-red-hover}"
  button-secondary:
    backgroundColor: "oklch(100% 0 0 / 0.15)"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  input-search:
    backgroundColor: "{colors.surface-base}"
    rounded: "{rounded.full}"
    height: "64px"
    padding: "64px"
  card:
    backgroundColor: "{colors.surface-elevated}"
    rounded: "{rounded.lg}"
    padding: "16px"
  nav-item:
    rounded: "{rounded.md}"
    padding: "0.65rem 0.875rem"
  nav-item-active:
    backgroundColor: "oklch(55% 0.22 25 / 0.12)"
    textColor: "{colors.dondeveo-red}"
---

# Design System: Donde veo

## Overview

**Creative North Star: "Atlas personal del streaming"**

Donde veo is a map, not a storefront. The product answers one question — ¿dónde lo veo? — in seconds, and the visual system exists to make that answer feel like the user's own well-kept, night-lit guide to Argentine streaming. Dark is not a theme here; it is the viewing condition: the app assumes the sofa, the late hour, and the screen as the only source of light. Content imagery carries the interface; the chrome stays quiet, a translucent instrument floating above posters and stills.

The system is deliberately low-density in chrome and high-density in content. Cards, carousels, and the hero do the emotional work; the shell (header, 80px fixed) and navigation (a 260px glass drawer) recede until summoned. Motion is reserved and stateful — the hamburger folds into an ✕, the header blurs as you scroll, the search icon participates in the view transition. Nothing moves for decoration. The one loud voice is the action: **Rojo Dondeveo**, a warm red reserved for the decision point (instalar, ver en, buscar), appearing on small surfaces so its rarity carries the product's single answer.

Every surface is dark and calm — achromatic near-blacks that step by luminance, never by shadow — with a warm raisin tint reserved for the navigation glass. Imagery is never left naked: text always lands on a scrim, because the atlas is only legible when the map underneath is dimmed. The result is a personal, nocturnal catalog: the user's own list of where everything lives, one glowing tap away.

**Key Characteristics:**
- Dark-only, cool near-black canvas (`oklch(12% 0.01 260)`) with warm raisin navigation
- Single warm-red action voice, used sparingly and only for decisions
- Depth built from luminance steps and hairline borders; shadows only for floating moments
- Pill geometry for one-shot actions; soft rectangles for content surfaces
- Epilogue display face (800, tight leading) over Inter UI text
- The scrim as canvas: imagery dims so copy stays legible

## Colors

One action red, one informational amber, one focus blue, and a warm-tinted black ladder. The palette character is "night with a single ember": nearly everything is a neutral near-black, and the few chroma moments are functional, not decorative.

### Primary
- **Rojo Dondeveo** (`oklch(55% 0.22 25)`): the action color. Install buttons, the pill call-to-actions, active navigation state, hero badges. Used at small, decision-sized surfaces — it signals the answer to "¿dónde?".
- **Rojo Dondeveo Hover** (`oklch(60% 0.22 25)`): lightens the red by raising lightness only; chroma and hue stay fixed.

### Secondary
- **Ámbar Atributo** (`oklch(75% 0.1 35)`): informational accent for title attributes — uppercase metadata eyebrows in the hero (year, rating, runtime) and similar attribute text. It annotates; it never acts.

### Tertiary
- **Azul Foco** (`oklch(65% 0.15 250)`): the focus and link family. `:focus-visible` rings, links, and tertiary text. Hover lightens (`oklch(60% 0.15 250)`); **Blue Light** (`oklch(80% 0.08 253)`) is the tertiary text tone.

### Neutral
- **Fondo** (`oklch(12% 0.01 260)`): global page background — a cool, nearly black canvas.
- **Surface Base** (`oklch(20% 0 0)`): resting input fields (`SearchInput`) and the ring color for avatar medallions.
- **Surface Elevated** (`oklch(26% 0 0)`): card and widget background — one luminance step above base.
- **Surface Container Low** (`oklch(20% 0 0)`): list/surface rows; **Hover** (`oklch(24% 0 0)`).
- **Nav Raisin** (`oklch(15% 0.02 15)`): navigation surface and its glass form (`oklch(13% 0.025 15 / 0.72)` + `blur(24px) saturate(160%)`). The only warm tint in the neutral ladder.
- **Text** (`oklch(85% 0 0)`): primary copy. **Text Bright** (`oklch(90.7% 0.003 35.8)`) for emphasis; **Text Dimmed** (`oklch(75% 0.05 35)`) for placeholders; **Text Muted** (`oklch(60% 0 0)`) for secondary meta.
- **Border Subtle** (`oklch(25% 0.01 260)`): structural hairlines; **Border Card** (`oklch(100% 0 0 / 0.05)`) and **Border Nav** (`oklch(100% 0 0 / 0.06)`): low-alpha white hairlines on surfaces.
- **Overlay** (`oklch(0% 0 0 / 0.5)`): modal and header-scroll tint; **White** (`oklch(100% 0 0)`): text on red and inverted surfaces.

### Named Rules
**The Ember-Only Rule.** Chroma exists in three jobs only: Rojo Dondeveo acts, Ámbar Atributo annotates, Azul Foco focuses. Any other saturated color on a screen is drift. The red is a decision, used on ≤10% of any given screen — its rarity is the point.

## Typography

**Display Font:** Epilogue (600/700/800, with system-ui fallback)
**Body Font:** Inter (400/500/600, with system-ui fallback)
**Label Font:** Inter (600, uppercase where noted)

**Character:** Epilogue is the confident, slightly theatrical narrator — tight leading, high weight, cinematic scale — and Inter is the calm, practical cabin crew. Epilogue makes the title feel like an event worth staying for; Inter keeps the interface invisible. The pairing is "marquee over ticket counter": the title sells it, the UI never gets in the way.

### Hierarchy
- **Display** (Epilogue 800, `clamp(32px, 8vw, 48px)`, line-height 0.95, tracking −0.01em): the hero title. Big, tight, editorial; it sits directly on the scrimmed backdrop.
- **Headline** (Epilogue 600, 24px, line-height 1.5): section titles across the app — Cast, Synopsis, Watch Providers, carousel and history headers.
- **Title** (Epilogue 700, 14px): compact card and widget titles.
- **Body** (Inter 400, 14–16px, line-height 1.5): description text; hero description runs 14px mobile / 16px desktop with line-height 1.4 and 85% opacity.
- **Label** (Inter 600, 12px, tracking 0.1em, uppercase): attribute eyebrows, nav section labels, metadata markers. Confidence via restraint: small, wide, caps.

### Named Rules
**The Marquee Rule.** Epilogue carries hero and section titles only; everything clickable or scannable is Inter. The display face never types UI text, and UI text never pretends to be the marquee.

## Layout

Mobile-first PWA, laid out for the phone where the decision happens, scaling up to a calm 12-column desktop.

- **App shell:** column flex, `min-height: 100svh`; `main` sits below a fixed 80px header (`margin-top: var(--header-height)`) with 2rem bottom padding.
- **Gutters and rhythm:** 1.5rem page gutters; a 4/8/12/16/24/32px spacing scale (`xxs/xs/sm/md/lg/xl`); 2rem section gaps; cards breathe at 16px padding and 0.75rem internal gap.
- **Hero:** mobile `height: calc(90svh - 80px)` (min 520px), desktop 85vh; overlay content bottom-anchored on mobile, center-anchored at 60px padding on desktop, capped at 600px max-width — like a movie title card.
- **Detail page:** centered grid, `max-width: 1200px`, 3rem column gap; collapses from 12 columns (8/4 content/sidebar split) below 1024px. Right column stacks use 3rem spacing.
- **Responsive:** `768px` (typography scale-up, hero full-size treatments, hover states enabled) and `1024px` (12-column grid, hamburger hidden, install button hidden below 1023.98px). Fluid sizing is used only where it matters — the hero title `clamp()`.
- **Navigation:** 260px off-canvas drawer, right-anchored, `height: 100dvh`, opening on `translate` with a 0.35s `cubic-bezier(0.4, 0, 0.2, 1)` ease.

## Elevation & Depth

This system is **elevated by luminance, not by shadow**. Depth comes from a ladder of nearly-black surfaces — Fondo (12%) → Base (20%) → Container Low hover (24%) → Elevated (26%) — plus low-alpha white hairlines that edge each step. Resting cards are flat on purpose: the contrast between surface tones is the elevation.

Shadows exist only for **floating moments**: elements that hover above the page or demand attention, never for resting content.

### Shadow Vocabulary
- **Resting field glow** (`0 10px 15px rgba(0,0,0,0.2)`): anchors the search input as a floating stage, with a `transition: all 0.2s`.
- **Float** (`0 8px 24px oklch(0% 0 0 / 0.4)`): install banner and iOS install hint — panels that float above content.
- **Drawer cast** (`-8px 0 32px oklch(0% 0 0 / 0.4)` plus `inset 1px 0 0 oklch(100% 0 0 / 0.04)`): left-side shadow + hairline edge on the navigation drawer.
- **Focus ring** (`0 0 0 4px oklch(60% 0.22 25)` — Rojo Dondeveo Hover): the search input's focus speaks in the product's accent, not in blue.

Backdrop translucency is the depth partner: the nav drawer glass blurs at `24px saturate(160%)`, the header gains a `blur(10px)` tint over an `0.5` black overlay as it scrolls, and modal overlays blur at `2px` over full-black 55%.

### Named Rules
**The Luminance-Depth Rule.** Surface hierarchy is declared with lightness steps and hairlines, not with drop shadows. A resting card carries no shadow; float is a state, not a default.
**The Float-Honesty Rule.** When something casts a shadow, it must be visibly floating — a banner, a drawer, a focused field. Shadows never decorate content that sits in the page flow.

## Shapes

**Pills for action, rectangles for content.** The form language is a deliberate split: the one-shot, high-frequency gestures are full pills (search, install, badges), and the surfaces that hold information are soft rectangles (8–12px).

- **Scale:** 4px (sm) / 8px (md) / 12px (lg) / 16px (xl) / 9999px (full pill), centered on the token palette.
- **Inside a pill:** the 64px search field, the 2.25rem install button, install-banner actions, hero badges — interactive or statusful by nature.
- **Inside a rectangle:** content surfaces at 12px (cards, modals), navigation and menu items and the hamburger at 8px, and the skip link at 8px.
- **The medallion:** circular crops — 22px provider logos with a 2px ring in Surface Base, and the 40px circular clear button inside the search field. Circles mean "identity"; pills mean "action"; rectangles mean "content".
- **A signature silhouette:** the overlapping provider avatar stack — negative `margin-right: 0.35rem` on successive 22px medallions — reads as a tiny human-portrait strip of platforms ("quiénes lo tienen") and is the system's most recognizable recurring shape.

## Components

### Buttons
- **Shape:** two dialects — the editorial block (8px radius, 12px × 16px padding) for hero-scale actions, and the pill (9999px, 2.25rem height, 0.875rem side padding) for chrome and banner actions.
- **Primary:** Rojo Dondeveo background, white text, 600 weight (18px hero / 0.8125rem pill), inline-flex with 8px gap for icons.
- **Hover / Focus:** the red lightens one luminance step (Hover). Active scale is reserved for the pill (`transform: scale(0.96)`); focus-visible uses a 2px Azul Foco ring with 2px offset.
- **Secondary:** `oklch(100% 0 0 / 0.15)` translucent white, white text, same geometry as primary; hover raises translucency to 25%. It accompanies, never competes with, the red.

### Chips
- **Provider stack (medallions):** 22px circular logos, 2px ring in Surface Base, negative-overlap 0.35rem, up to 3 visible with a muted `+N` label in 0.7rem/600. Identity chips; there is no selected-state vocabulary — they annotate which platforms carry the title.
- **Hero badge:** full pill, Rojo Dondeveo background, 12px/600 white with 0.3px tracking. A status seal, not a control.

### Cards / Containers
- **Corner Style:** 12px (`--radius-lg`).
- **Background:** Surface Elevated (`oklch(26% 0 0)`).
- **Shadow Strategy:** none at rest — see The Luminance-Depth Rule.
- **Border:** 1px low-alpha white hairline (`oklch(100% 0 0 / 0.05)`).
- **Internal Padding:** 16px with 0.75rem internal gaps.

### Inputs / Fields
- **Search input:** full-width 64px pill on Surface Base, 18px/500 text, 64px horizontal padding for the leading icon and trailing clear button; placeholder in Text Dimmed. Resting shadow anchors it as the floating stage.
- **Focus:** a 4px ring of Rojo Dondeveo Hover (`0 0 0 4px`) around a transparent 2px buffer — the input's focus speaks in the action accent, not in blue, because search *is* the action.
- **Clear button:** 40px circle, transparent, hover fills Surface Elevated. WebKit's native cancel control is suppressed; the circle is the native-affordance replacement.

### Navigation
- **Style:** 260px off-canvas right drawer, nav-raisin glass (`blur(24px) saturate(160%)`), 1px white-hairline left edge, 5rem top padding, 2rem item gaps; overlay dims the page at black 55% with 2px blur.
- **Typography:** section labels are uppercase Inter 600 at 0.625rem with widest tracking; menu links are Inter 500 at 0.9375rem.
- **States:** idle links in cool `oklch(82% 0.01 260)`; hover raises to white on a `oklch(100% 0 0 / 0.06)` wash; active state is Rojo Dondeveo text on a 12% red wash — the red's second sanctioned appearance, marking "you are here" on the map.
- **Mobile treatment:** a 2rem hamburger (8px radius, four 2px bars) morphs into a ✕ (rotating bars 1 and 4, fading 2 and 3), hover scales to 1.1 before opening. The drawer slides on `translate` (0.35s standard ease).

### Signature Component — the Scrim Canvas (hero)
The hero is the system's relationship with imagery made explicit: a full-bleed `object-fit: cover` backdrop under layered gradients — bottom-heavy black on mobile (`92% → transparent`), a left-to-right diagonal on desktop — with a flex column of copy overlaid at the bottom (mobile) or center-left (desktop). **The scrim is the canvas:** imagery is the product's richness, and the gradient is how the system keeps it legible without covering it. Above the scrim live the Ámbar attribute eyebrow, the Epilogue display title, description, and the action buttons that answer "¿dónde?".

## Do's and Don'ts

### Do:
- **Do** build depth with luminance steps (Fondo 12% → Base 20% → Elevated 26%) and hairline borders; resting cards stay shadow-free.
- **Do** use pills for one-shot actions (search, install) and 8–12px rectangles for content surfaces.
- **Do** keep Rojo Dondeveo as the action voice, used sparingly on decision-sized surfaces; give the active nav item its red by all means — it's the map's "you are here".
- **Do** let Epilogue own hero and section titles at 800 weight with tight 0.95 leading, and keep every interactive label in Inter.
- **Do** dim imagery before placing text on it; the scrim is the legibility mechanism, never a decorative overlay.
- **Do** keep chroma to the three jobs — red acts, amber annotates, blue focuses.
- **Do** keep the dark-only scheme; `color-scheme: dark` and the 12% canvas are the viewing condition, not a style choice.

### Don't:
- **Don't** add drop shadows to resting content — floating shadows belong to banners, drawers, and the focused field only.
- **Don't** introduce light-mode, high-chroma surfaces, or decorative gradients; the palette is a ladder of near-blacks with one ember.
- **Don't** use the red for informational or meta text — it is a decision, and text in red reads as a button that does not exist.
- **Don't** break the provider medallion stack's negative overlap or shrink the 2px avatar ring; the tiny portrait strip is the system's signature.
- **Don't** let Epilogue typeset UI copy, and don't let Inter typeset the marquee; the voice split is the hierarchy.
- **Don't** replace the 4px red focus ring on the search input with a blue ring — search is the product's one action.
- **Don't** raise the header beyond 80px or widen the drawer beyond 260px; the chrome is an instrument, not a resident.