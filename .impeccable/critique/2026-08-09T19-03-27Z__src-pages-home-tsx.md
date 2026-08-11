---
target: re-critique Home
total_score: 23
max_score: 36
na_heuristics: 10
p0_count: 2
p1_count: 2
timestamp: 2026-08-09T19-03-27Z
slug: src-pages-home-tsx
---

# Critique (r2) — Home surface (src/pages/Home.tsx)

Method: dual-agent (A: general/review · B: general/detector)

| #         | Heuristic                       | Score     | Key Issue                                                                  |
| --------- | ------------------------------- | --------- | -------------------------------------------------------------------------- |
| 1         | Visibility of System Status     | 3         | No slide-position indicator in hero; provider status only via pulsing dots |
| 2         | Match System / Real World       | 3         | Chips say where to watch but are dead spans — the answer leads nowhere     |
| 3         | User Control and Freedom        | 3         | Modal Escape/backdrop OK; no keyboard paging on carousels                  |
| 4         | Consistency and Standards       | 2         | Two divergent carousels; amber/blue accent split                           |
| 5         | Error Prevention                | 2         | Provider fetch errors silently swallowed (if error return null)            |
| 6         | Recognition Rather Than Recall  | 3         | "cita" metaphor only taught in empty states                                |
| 7         | Flexibility and Efficiency      | 2         | No shortcuts/arrow-key nav; "Ver todo" on only 2 of 5 rows                 |
| 8         | Aesthetic and Minimalist Design | 2         | First-run = 6 sections incl. 2 tall empty cards                            |
| 9         | Error Recovery                  | 3         | HomeError alert+retry good; provider failures invisible                    |
| 10        | Help and Documentation          | n/a       | Content-first app; not scored                                              |
| **Total** |                                 | **23/36** | **Good**                                                                   |

## Design Specificity Verdict

Partially grounded, still drift-prone. Hero is now product-specific (Donde ver chips with real provider logos answer the core question; curation rows are genuinely distinct). But the answer stops at the hero — the 4 rows (~40 items) carry zero where-to-watch data. The strongest product signal (the "cita" shared-watch plan) is buried in an empty state and a modal.

Deterministic scan: 1 finding (Hero.tsx:55 broken-image) — confirmed FALSE POSITIVE (Img.tsx guards `if (!src) return null`). All 18 files otherwise clean. Browser pass not run (no browser automation).

## Overall Impression

The surface now announces the product once (hero), then forgets it. Chips answered the core question; next the answer must reach the rows and become actionable.

## What's Working

1. Hero chips = irreplaceable asset: filtered flatrate/free/ads, visually refined, finally about availability.
2. A11y backbone real: skip-link, labeled search <a>, isHome covers "/", single h1, inert inactive slides, real <a> cards with modifier-aware clicks.
3. Genuinely distinct curation + human copy ("Tus próximas citas", "Ver con Laura el sábado").

## Priority Issues

- [P0] Where-to-watch exists only on the hero; 4 rows (~40 cards) answer nothing about "donde veo".
- [P0] No provider caching; chips flash per slide change (useWatchProviders refetches per activeId change, no cache; quick swiping rarely renders them).
- [P1] aria-current fix is a no-show — zero matches in src/; active slide only distinguished by inert.
- [P1] Split accent system (amber hero / blue "Ver todo") + two divergent carousel patterns.
- [P2] First-run layout dead weight: two stacked empty-state cards; no fade/reveal on slide change; hidden scrollbars leave no affordance hint on touch.
- [P2] "0.0" ratings render for trending items with vote_average 0.

## Persona Red Flags

- Alex: curated rows have no provider data; chips non-interactive; "Ver todo" missing on 3 of 5 rows.
- Jordan: every swipe fires a network request and flashes dots→chips.
- Riley: aria-live announces on every threshold crossing during a swipe (chatty); provider dots aria-hidden.
- Sam: lands on two "empty" planning cards before reaching Animé.

## Minor Observations

Dead code: Slide component in Carousel.tsx never imported; useHomeData never refreshes after first success; hero nav arrows lack hover affordance; backdrop srcSet loads w780/w1280 for all slides while img stays lazy.

## Questions to Consider

1. Why does ~5/6 of Home show zero availability data? What if rows were curated by availability ("En Netflix ahora", "Gratis en Pluto")?
2. The provider chip is the moment users want to act ("open it on Prime") — it's an unclickable span. What's the action model?
3. Why isn't the hero a "make a cita" surface instead of a generic "Favoritos" button?
4. Batched provider request for all slides vs per-slide fetch + TTL cache?
