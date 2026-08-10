---
target: search
total_score: 23
max_score: 40
na_heuristics:
p0_count: 1
p1_count: 2
timestamp: 2026-08-10T18-57-48Z
slug: src-pages-search-tsx
---

# Critique — Search surface (src/pages/Search.tsx + SearchInput/SearchResults/useSearchData)

Method: dual-agent (A: general/review · B: general/detector)

| #         | Heuristic                      | Score     | Key Issue                                                                                                                    |
| --------- | ------------------------------ | --------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 1         | Visibility of System Status    | 2         | Load-more pages are silent: skeleton only on first page, no aria-busy, no sentinel                                           |
| 2         | Match System / Real World      | 3         | Good voseo Spanish; "personas" promised in placeholder then dropped; "Revisá tu conexión" misattributes TMDB/service outages |
| 3         | User Control and Freedom       | 3         | Clear button ✓, meta-key preserved ✓, seq guard ✓; clear is 350ms lagged, error state has no exit                            |
| 4         | Consistency and Standards      | 3         | Shared MediaGrid + tokens; broken by undefined `--text-secondary` token and hardcoded #222/#333 skeletons                    |
| 5         | Error Prevention               | 2         | seq guard is excellent; but page-2 failure wipes page-1 results, server converts outages into "no results"                   |
| 6         | Recognition Rather Than Recall | 3         | Posters aid recognition; cold start forces recall, no recents/history priming                                                |
| 7         | Flexibility and Efficiency     | 2         | Debounce + infinite scroll + scroll restore; no autofocus, Enter dead, no / shortcut, no availability in list                |
| 8         | Aesthetic and Minimalist       | 3         | Restrained and on-system; hover scale(1.03) is decoration the DESIGN.md says never to move                                   |
| 9         | Error Recovery                 | 1         | Error box exists but NO retry action; `retry()` is dead code never wired to UI                                               |
| 10        | Help and Documentation         | 1         | Only the one-line placeholder hint; nothing guides toward the product question                                               |
| **Total** |                                | **23/40** | **Acceptable**                                                                                                               |

## Design Specificity Verdict

Not product-grounded. A TMDB clone could ship this surface unchanged: poster + title + type eyebrow + rating + year is generic browse. The product's signature shape — the overlapping provider medallion stack (DESIGN.md) that answers "quiénes lo tienen" — is absent from the one screen where comparison happens. `ProviderWithType` exists only on DetailItem (shared/types.ts:57); search forces a full detail round-trip before the user learns "dónde lo veo". The server already exposes `/api/providers/batch` (api/index.ts:29) — the plumbing exists and nothing connects it.

Deterministic scan: exit 0, `[]` — genuinely clean markup. Engine proven working via positive control (`index.html` → `overused-font`; `header.css`/`base.css` → 9 advisory findings; `Hero.tsx:55` → `broken-image` false positive on `<Img>`). Browser pass not run (no browser automation available in this session).

## Overall Impression

The plumbing is now excellent — race hygiene, session restore, real links with meta-key support, proper states. But the surface still confirms _existence_, not _availability_. It works; it doesn't answer the question the app is named after.

## What's Working

1. **Race-condition hygiene**: `seq` counter guards every write (useSearchData.ts:16,44,59) — type-ahead storms collapse into the latest query. Correct live-search core.
2. **Session continuity**: query + results + scrollY persist across detail visits (signals/search.ts, Search.tsx:19-25) — the right foundation for browse-compare-decide.
3. **Native-grade card interaction**: real `<a href>` with meta-key detection and view-transition poster handoff (SearchResults.tsx:105-112).

## Priority Issues

- [P0] **The surface doesn't answer "¿dónde lo veo?"**: zero availability on results (no medallions, no "en 3 plataformas", no per-tile shortcut). Decision forces a full detail fetch per title. Fix: fuse availability via the existing `/api/providers/batch` into `/api/search`; render the medallion stack on cards. → `/impeccable shape` (product decision) then `/impeccable craft`
- [P1] **Pagination failure destroys the whole list + error dead-end**: `catch { setData(null) }` (useSearchData.ts:55) wipes page-1 results on any page-2 failure; error box has no retry — `retry()` exists but is never wired (Search.tsx:13). Fix: only wipe on page===1, keep data on page>1 with non-destructive toast; add "Reintentar" button. → `/impeccable harden`
- [P1] **Silent infinite scroll**: page-2+ appends show no indicator, no aria-busy. Fix: sentinel spinner row (Spinner.tsx exists) when hasMore && loading; announce "se cargaron más resultados". → `/impeccable polish`
- [P2] **People promised then dropped — and the count lies**: placeholder advertises "y personas"; people filtered out of render (SearchResults.tsx:48) but `total` and `hasMore` still count them. Fix: surface people or drop at the API and make total honest. → `/impeccable harden`
- [P2] **False "Sin resultados" on service failure**: server converts TMDB outages into empty SearchData (server/service/search.ts:27-30), so the client's error UI is unreachable; users blame themselves. Fix: propagate non-200 or typed error. → `/impeccable harden`
- [P2] **Cold start has no magnetism**: one muted hint; no recents (history exists in app state), no examples. Fix: recent titles as chips on initial state. → `/impeccable onboard`
- [P3] **Mechanical defects**: undefined `--text-secondary` token (SearchInput.module.css:48); no singular "1 resultado"; `fethMore` typo; duplicate `view-transition-name: search-icon` (input + header); IntersectionObserver recreated every render. → `/impeccable polish`

## Persona Red Flags

- **Alex (power user)**: No autofocus into the input, `/` does nothing, Enter is inert, and availability isn't in the list — can't skim "dónde" without a per-card detail visit. The meta-key copy affordance exists but the content worth copying doesn't.
- **Sam (screen reader)**: One giant `aria-live="polite"` wraps skeleton→list swaps AND page-appended cards — a narrating firehose of "Póster de X"; `role="alert"` nests inside the polite region (two competing announcement modes); no aria-busy during loads; focus not restored to input on return.
- **Riley (stress tester)**: Loses the entire list on a page-2 blip (P1 wipe); hits the server-originated false empty (P2) and doubts their own query. Safe from rapid-fire races — that one is genuinely handled.
- **Casey (distracted mobile)**: 2-up poster grid is thumb-gracious, but 11px eyebrow and hidden availability mean a thumb-to-detail roundtrip on every card to learn the one fact they came for.

## Minor Observations

- Skeleton grid hardcodes 10 cards regardless of viewport.
- Poster fallback prints "Póster de X" as visible text (ImgTmdb.tsx:100).
- `releaseDate.slice(0,4)` — safe but consider locale formatter.
- Hover scale(1.03) is the one decorative motion on a surface DESIGN.md says shouldn't move for decoration.
- No page-level `<h1>`; heading order depends on the header logo — confirm with Sam.

## Questions to Consider

1. What if the search result _was_ the answer — "tenés que ver: Netflix, Disney+" per tile? Does the detail page stay in the critical path?
2. Is search _retrieval_ or _arbitration_ here? If arbitration, should the grid sort by "platforms you actually have" (guessable from favorites/history)?
3. Why does a persona that doesn't exist in the result set appear in the placeholder? Inherited TMDB `/search/multi` shape leaking into the product?
4. On a failed search — is "probá con otro título" the best the Atlas can say, or should it already know what the user watched last Tuesday and offer its cast's availability?
