---
target: search
total_score: 17
max_score: 36
na_heuristics: 10
p0_count: 3
p1_count: 3
timestamp: 2026-08-09T18-08-29Z
slug: src-pages-search-tsx
---
# Critique — Search surface (src/pages/Search.tsx)

Method: dual-agent (A: general/review · B: general/detector)

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 1 | Silent 1000ms debounce with zero feedback; items===undefined renders empty h3 |
| 2 | Match System / Real World | 3 | Spanish ok but placeholder missing accents; movie/TV/person indistinguishable |
| 3 | User Control and Freedom | 2 | Clear (X) empties input but not results; no Escape, no cancel, no back to previous query |
| 4 | Consistency and Standards | 2 | X always visible even when empty; people cards look clickable but are dead |
| 5 | Error Prevention | 1 | Race in useSearchData can overwrite fresh search with stale results |
| 6 | Recognition Rather Than Recall | 3 | Posters strong; title clamp broken; no prior search seeding on blank state |
| 7 | Flexibility and Efficiency | 2 | No Enter-to-search, no arrow-key nav, no type filter, 1000ms debounce penalizes fast typists |
| 8 | Aesthetic and Minimalist Design | 3 | Clean token-consistent dark surface; emptiness reads as absent not minimal |
| 9 | Error Recovery | 0 | No error state, no .catch anywhere, no retry, no toast; failed fetch looks like empty search |
| 10 | Help and Documentation | n/a | Only guidance is the placeholder |
| **Total** | | **17/36** | **Poor** |

## Design Specificity Verdict

Not product-grounded. Generic poster-gallery search any TMDB clone could ship unchanged. The app is named "donde veo" but results expose only poster+title; no provider/platform, rating, year, or mediaType — ProviderWithType lives in shared/types.ts:36-42 but never reaches the grid.

Deterministic scan: 0 findings on the 4 TSX files (CSS Modules + regex engine invisible to CSS). Positive control probe confirmed the engine works — clean is genuine clean within scope. Browser/render pass not run (no browser automation available).

## Overall Impression

Best-engineered plumbing on the app (ImgTmdb, tokens, debounce architecture) wrapped around the surface with the least product soul. Works, but answers "is it here" not "dónde verlo".

## What's Working

1. ImgTmdb: real srcset/sizes, aspect-ratio-locked containers prevent CLS, lazy+async, skeleton, graceful fallback.
2. Token-consistent 64px pill input with etched icon + focus pulse.
3. Correct debounce architecture (ref-stable + memoized timer) and uncontrolled input — cheap, leak-free.

## Priority Issues

- [P0] Race condition inverts "fresh data wins" — useSearchData.ts:15-28; stale late response overwrites newer query and rolls currentQuery back.
- [P0] currentPage never resets on new query — useSearchData.ts:11,31-34; after pagination a new search skips page 2.
- [P0] No loading/empty/error states — SearchResults.tsx:26-34 empty h3 for whole debounce+fetch; 1000ms dead air reads as broken app.
- [P1] Clear button is a lie — SearchInput.tsx:17-19,35 clears DOM only, results persist, pending debounce can re-fire.
- [P1] People results: dead end with fake affordance — SearchResults.tsx:20-24, cursor:pointer + hover scale on non-clickable cards.
- [P1] Product soul absent: no provider/rating/year/mediaType on cards — SearchResults.tsx:44-56.
- [P2] Results grid not keyboard-reachable — article onClick, no tabIndex/role/aria-live (SearchResults.tsx:45).
- [P2] Broken line-clamp:2 — SearchResults.module.css:35-37 lacks -webkit-box stack.

## Persona Red Flags

- Alex: 1000ms debounce no feedback; no Enter/shortcuts/filter; P0 race + un-reset currentPage lose a page.
- Jordan: full second of dead air then blank screen; X leaves stale grid under empty bar.
- Sam: no label/aria-label on the input; unnamed X; outline:none suppresses focus-visible ring; result cards unreachable; no aria-live.

## Minor Observations

fethMore typo; empty h3 in undefined branch; heading order flips h3->h2 across states; type="text" not "search"; no-op transparent focus ring layer; scale:1.05 reflows title text; key={item.id} not type-scoped; ImgTmdb loading then {...props} redundancy; duplicate aspect-ratio source.

## Questions to Consider

1. If provider chips on cards (or "no disponible aún") are the product soul, why isn't a pixel of them on the grid?
2. Was the X behavior ever tested by a human?
3. Do you have a test that types two queries faster than the slowest network response?
4. Is the 1000ms delay protecting quota or punishing the user?
5. What IS the intended interaction for people cards?
6. If you stripped the orange accent, could anyone guess which streaming app this is?
