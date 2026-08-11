---
target: critique + Home
total_score: 20
max_score: 36
na_heuristics: 10
p0_count: 1
p1_count: 3
p2_count: 1
timestamp: 2026-08-09T16-49-07Z
slug: src-pages-home-tsx
---

Method: dual-agent (A: ses_0189a822fffedK5JKgmK8oECWh · B: ses_0189a6f6bffe64ooqUe44O86Nb)

# Critique — Home surface (`src/pages/Home.tsx`)

## Design Health Score

| #         | Heuristic                       | Score     | Key Issue                                                                                          |
| --------- | ------------------------------- | --------- | -------------------------------------------------------------------------------------------------- |
| 1         | Visibility of System Status     | 2         | Scrollbars hidden + no arrows on rows → overflow content invisible; hero lacks dot/count indicator |
| 2         | Match System / Real World       | 3         | Natural Spanish microcopy, but `▶ Ver más` emoji mixes icon languages with lucide                  |
| 3         | User Control and Freedom        | 2         | Favorite removal happens instantly with no undo/confirm; desktop rows have no mouse navigation     |
| 4         | Consistency and Standards       | 3         | Hero (h1+desc) vs cards (h4+meta) are two dialects on one page                                     |
| 5         | Error Prevention                | 2         | No confirm/undo on destructive action; modal validation is genuinely good                          |
| 6         | Recognition Rather Than Recall  | 3         | Empty rows vanish (recall replaces recognition); nav persistent but passive                        |
| 7         | Flexibility and Efficiency      | 1         | No keyboard nav, no desktop arrows, no "Ver todo", no jump-to-top, no sort/filter                  |
| 8         | Aesthetic and Minimalist Design | 3         | Clean oklch dark system + Epilogue/Inter, but 5 stacked sections + hue mixing dilute it            |
| 9         | Error Recovery                  | 1         | API failure → infinite spinner; empty rows vanish without explanation; no retry                    |
| 10        | Help and Documentation          | n/a       | Entertainment browse surface; no help/docs expectation                                             |
| **Total** |                                 | **20/36** | **Acceptable**                                                                                     |

_(#10 scored n/a; applicable max = 36. 20/36 ≈ 56% → Acceptable band.)_

## Design Specificity Verdict

**LLM assessment**: Visually competent but _structurally auditioning for another product_. The offer reads as a polished TMDB-informed streaming template, not as "Donde veo" — a product whose premise is answering "¿dónde lo veo?". The defining miss is existential: **the product's reason to exist never renders on Home.** The platform/provider discovery promise lives only in `<meta name="description">` (`index.html:14`), yet the hero offers `▶ Ver más` + `Favoritos` and cards expose poster/genre/year. No "Disponible en Netflix/Prime/Max" chip anywhere. The one thing that could make this not-a-clone is invisible.

Evidence of sameness: `Home.tsx:15-16` hands `data?.trending` to BOTH Hero and Popular → `trending[0]` appears twice on first paint; `topRatedMovies`/`topRatedTv` are fetched (`useHomeData.ts:26-33`) and discarded; "Populares" says _"Las películas más populares del momento"_ while TMDB trending mixes series; four editorial rows are the same horizontal strip with zero personal-vs-world distinction; tokens mix four hue families (bg 260 / primary 25 / accent 250 / nav 340) — borrowed, not authored.

**Deterministic scan**: Clean — `detect.mjs` returned zero findings (exit 0) across all 10 Home-surface files. The static/text engine found no rule violations; no false positives to adjudicate.

**Visual overlays**: Not available. No browser automation tool is exposed in this environment, so the rendered-pixel pass (real contrast, stacking, layout) and user-visible overlay were skipped. Synthetic judgment from source tokens/structure only. A visual pass in a real browser is still owed before shipping Home.

## Overall Impression

A competent dark streaming template with serious craft underneath (real image pipeline, a genuinely distinctive "cita" idea buried in a modal) — but the surface never tells you what the product is for, and its end state (empty rows vanish, API failure spins forever) undercuts everything. The single biggest opportunity: put the "dónde se ve" answer — and the "cita" idea — on every card and let that differentiate the page.

## What's Working

1. **A real image pipeline.** `HeroMedia` (`Hero.tsx:45-58`) uses `picture` + `srcSet` w780/w1280 with w342 fallback, `sizes="100vw"`, `fetchPriority="high"` on the first slide, lazy elsewhere. Authored performance thinking, not template output. Same for the IntersectionObserver→`activeId` sys driving per-slide `viewTransitionName` — a genuinely designed, non-clone motion system.
2. **The favorite modal is product soul.** _"Agendar la cita"_, datetime-local with `min`, 140-char comment ("Ver con Laura el sábado a la noche"), validation + hint copy (`AddFavoriteModal.tsx:17-41,86`). The one interaction that couldn't belong to any other app. It should be the Home's thesis.
3. **Craft-level cohesion.** Consistent oklch dark system, Epilogue/Inter contrast, glass nav with real layering, 4–9999px radius scale, `overscroll-behavior-y: contain`. Architecturally sound foundation.

## Priority Issues

### [P0] The product's core promise never renders

- **What**: No provider/platform ("dónde verlo") surface anywhere on Home — no chips in hero, no badges on cards, no row about platforms.
- **Why it matters**: An entertainment surface that can't answer its own name can't convert a visitor whose single question is "where can I watch this?".
- **Fix**: Compact "Disponible en: Netflix | Prime | Max" line on cards and hero (data already exists in Detail's `providers`); make the hero's secondary action reflect the platform answer.
- **Suggested command**: `/impeccable layout`

### [P1] Desktop overflow is unreachable

- **What**: `CarouselMulti.module.css:58-64` hides scrollbars and no prev/next buttons exist on that component (only `Carousel.tsx` has them, ≥768px).
- **Why it matters**: On desktop the tail of Populares/Animé/Favoritos/Historial cannot be discovered or reached with a mouse — a working-memory trap (must remember it's scrollable).
- **Fix**: Add nav arrows on `CarouselMulti` ≥768px (reuse the `Carousel` pattern) and/or restore a visible scrollbar + edge-fade gradient.
- **Suggested command**: `/impeccable adapt`

### [P1] Cards are not keyboard-interactive

- **What**: `<article onClick>` (`CarouselMulti.tsx:37`) — no tabindex, role, Enter/Space, or focus style.
- **Why it matters**: Fails keyboard-only users; the entire middle of the page is a keyboard dead zone.
- **Fix**: Render cards as real `<a href="/detail/...">` (link semantics, free keyboard + middle-click) or focusable buttons with `:focus-visible` ring.
- **Suggested command**: `/impeccable audit` → `/impeccable harden`

### [P1] Curation and duplication betray the architecture

- **What**: `topRatedMovies`/`topRatedTv` fetched but discarded; "Populares" copies trending under _"películas"_ copy while mixing TV; hero + Popular duplicate `trending[0]` on first paint.
- **Why it matters**: The page reads as authored without regard for real geometry; wasted server payload on every load.
- **Fix**: Distinct source per editorial row (Novedades→trending, Películas→topRatedMovies, Series→topRatedTv, Animé→topAnime), keep hero ≠ first row, fix subtitle copy.
- **Suggested command**: `/impeccable distill`

### [P2] No empty, no error, no skeleton

- **What**: Empty favorites/history vanish silently; API failure = permanent `<Spinner/>` (`Home.tsx:14`, `useHomeData.ts:15-39`); `Skeletons.module.css` exists but is unused.
- **Why it matters**: Coldest possible moment for a returning user; a slow/failed connection produces an infinite spinner with no retry path.
- **Fix**: Friendly empty states ("Guardá una peli y agendá tu próxima cita"), error state with retry, skeleton rows while `data` is null.
- **Suggested command**: `/impeccable onboard`

## Persona Red Flags

**Jordan (first-timer)**

- The answer to "where can I watch this?" never exists on screen; the tagline is only in `<meta>`.
- "Mis favoritos" and "Historial" don't render for new users (`CarouselMulti.tsx:19`) → can't even discover those features; "Lo que te queda por ver" echoes back history they don't have.
- Tapping "+ Favoritos" opens a _scheduling modal_ (datetime + comment) with no prior explanation of the "cita" concept.

**Sam (a11y / keyboard)**

- Zero cards focusable (`article onClick`) — the middle of the page is a keyboard dead zone.
- Header search icon is a naked lucide `<svg onClick>` (`Header.tsx:81`), logo is `<span onClick>` (`Header.tsx:77`) — everything except the hamburger is keyboard-invisible.
- `HeroHome` emits one `<h1>` per slide (`Hero.tsx:73`) → ~20 competing H1s; `activeId` changes with no `aria-live`/`aria-current`.
- Modal: `role="dialog"` but no focus trap, no ESC, no focus restore; error text is a bare `<p>` without `aria-invalid`/`role="alert"`.
- No skip-to-content link.

**Riley (stress tester)**

- `/api/home` failure → infinite spinner, no retry, no cached/fallback content despite a registered service worker.
- Four rows × ~20 posters ≈ 80 TMDB w500 requests on one Home — no `decoding="async"`, no batching, zero skeleton → content shift on slow networks.

## Minor Observations

- `base.css:53` — `@media (min-with: 768px)` typo (inert, but signals drift).
- `Hero.module.css:6` — `backdrop-filter: blur(4px)` on the hero blurs essentially nothing; dead cost.
- Verb/noun inconsistency across buttons: "Ver más" vs "Ver todo" vs "Favoritos"/"Mis favoritos".
- "Inicio" nav item checks `path === "/home"` only → inactive at the real root `/`.
- `--color-nav-bg` (hue 340) conflicts with the blue/primary hues in `tokens.css` — chromatic noise.
- `"/placeholder-poster.png"` (`CarouselMulti.tsx:43`) — unverified asset path.
- Hero favorite removal shows no confirmation on Home.

## Questions to Consider

1. If "donde veo" is the promise, why is the hero's second button "Favoritos" instead of the platform answer?
2. What would Home look like if "Mis favoritos" became _upcoming movie-dates_ (with who you'll watch them with) — turning an empty state into the most persuasive onboarding the app could run?
3. Why does a page with 5 horizontal strips need vertical scroll at all — what breaks if it's a single taller hero + two rows (your stuff / the world's stuff)?
