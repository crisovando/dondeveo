# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary user: the Argentine general public deciding what to watch. They are on their phone, usually at the moment of choosing: they search (or already know) a movie or series and need to know which of the streaming platforms available in Argentina carries it. Secondary audiences are not confirmed.

## Product Purpose

"Donde veo?" answers one question: where can I watch this title, right now. It surfaces the streaming platforms (Netflix, Prime Video, Disney+, Max, Flow and similar AR-available services) where a movie or series is available, in a fast, low-friction way. Success means the viewer reaches a confident decision quickly and the availability shown is correct and current.

## Positioning

What a neighboring product could not truthfully copy: up-to-date availability for Argentine streaming platforms as the core truth of the product, delivered as a single focused answer ("dónde ver") within seconds — no login, no noise, no detours into trailers, ratings or editorial content. Favorites and history exist as local, no-account conveniences; they are not the positioning.

## Operating Context

- PWA on Vercel, mobile-first, dark theme; feels like an installed app on the phone.
- Core flow: search → detail page → provider chips ("Ver en Netflix / Prime…", "Comprar" for transactional platforms).
- Carousels by genre/trending on the home page.
- Favorites and history are stored locally (no user accounts, no server-side state).
- App shell and API responses work offline for previously viewed content; installability is a first-class concern (manifest, iOS icon, update prompt).
- Metadata comes from TMDB; provider/availability mapping is app-owned, region AR (language es-AR, provider priority AR/BR/ES/MX/US).

## Capabilities and Constraints

- Search movies and series; detail pages with provider availability chips for the AR region.
- Home carousels (genre, trending, popular); favorites, history.
- PWA: installable, offline shell + cached API, update prompt.
- No authentication; all user state is local.
- TMDB is the metadata source: availability depends on TMDB data and the app's provider mapping, not on direct deals with platforms.
- UI copy is Spanish, lightly voseo-flavored ("Explorá qué ver"), neutral/professional in tone.

## Brand Commitments

- Name: "Donde veo?" (favicon/manifest); "Donde veo" in the logo wordmark.
- Assets: logo.svg, logo-text.svg, icon set (maskable/any), apple-touch-icon, manifest screenshots in public/screenshots/.
- Dark scheme #060607, Epilogue (display) + Inter (body), rounded radii and primary accent tokens in src/styles/tokens.css.
- Spanish UI copy; accessibility basics present (focus-visible, aria labels, skip link) and kept.

## Evidence on Hand

- Live deployment: dondeveo.vercel.app.
- Real TMDB data renders across home, search and detail; provider chips working for AR region.
- Manifest screenshots captured from the live app (public/screenshots/).
- No testimonials, press, or case studies exist; future work must not fabricate them.

## Product Principles

1. Answer the one question — "¿dónde lo veo?" — and trim everything that does not serve that decision.
2. Availability truth for Argentine platforms is the product: freshness and correctness outrank breadth.
3. Zero friction: no account, no login, decision in seconds.
4. Mobile-first PWA: it should feel native on the phone where the decision happens.
5. It is a public product: polish and correctness are commitments, not extras.
