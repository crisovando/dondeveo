---
target: rails de la home (CarouselMulti) - mejor forma/tamano de carrusel
total_score: 26
max_score: 40
na_heuristics:
p0_count: 1
p1_count: 3
p2_count: 1
timestamp: 2026-08-10T16-21-14Z
slug: src-components-carouselmulti-tsx
---

# Critique — Rails de la home (CarouselMulti)

Method: dual-agent (A: ses_01392e779ffegH1UTwekCvXT3l · B: ses_0138cd655ffe06thdBpO6ZJ5BE)

## Verdicto de especificidad de diseño

Hoy el rail podría estar en cualquier app de streaming: póster 2:3 → título 18px → géneros · año → medallones. La única señal realmente de "Donde veo" — el medallón que responde "¿dónde lo veo?" — está relegada a un footer de 22px, el elemento visualmente más débil. Lo que te hace único es lo que menos se lee. Las filas `Popular`/`Series`/`Animé` son el mismo `<CarouselMulti>` con otra prop: intercambiables entre plataformas. Lo más específico hoy son las `PlatformRow` (responden la pregunta a nivel de fila).

## Detector (Assessment B)

Exit code 2: 3 findings en `CarouselMulti.module.css` — color `oklch(20% 0.02 260 / 0.9)` fuera de DESIGN.md (l.137), `font-size: 1.125rem` fuera de ramp (l.194), `font-size: 0.65rem` fuera de ramp (l.206). Sin findings en Carousel.tsx, Home.tsx ni PlatformRow.tsx. Además: cero tokens de spacing/typography en todo el set de carruseles; todas las medidas son literales.

## Informe

### Overall Impression

El carrusel funciona, pero su tamaño fijo de 280px está matando la densidad en móvil: a 360px ves ~1.1 cards (una y un hilo de la segunda). Ocho filas iguales = home de ~5.400px. La mayor oportunidad no es el componente, es el sistema: bajar la card, romper la monotonía de formato y hacer que la respuesta "¿dónde?" se lea primero.

### What's Working

- Scroll snap + nav 44px accesibles (aria-labels correctos).
- El header de fila suma; el logo en PlatformRow es la dirección correcta.
- Degradación correcta: filas vacías no rompen la home.

### Priority Issues

1. **P0 — Card fija 280px matando densidad** (CarouselMulti.module.css:155). ~1.1 cards visibles a 360px, raíl de ~500px, 8-10 filas = home eterna. Fix: card 120-132px móvil, gap 0.875rem, snap `start`, fuente w342, margin de sección 2.5rem.
2. **P1 — Monotonía + overlap de datasets**: trending ↔ mostPopularAR ↔ platforms ordenan por popularity global → el mismo título aparece 3 veces en la home. newReleases/topRated/anime son los únicos datasets conceptualmente distintos. Fix: deduplicar entre filas + diferenciar formatos (top-10 landscape numerado, grid 2-col con MediaGrid, spotlight editorial).
3. **P1 — Medallones redundantes en filas "Solo en X"**: la fila ya declara la plataforma; el logo 22px + ring en cada card es ruido y viola la Ember-Only Rule. Fix: prop `showProviders` y `false` en PlatformRow; mantener en filas mixtas donde sí responde la pregunta del producto.
4. **P1 — "Ver todo" promesa rota en 6 de 8 filas**: el prop existe pero estrenos/plataformas/más visto/Series/Animé no tienen a dónde ir. Fix: cablear página de lista por provider, o quitar el affordance.
5. **P2 — Shadow en reposo viola la Luminance-Depth Rule** (l.175) + 3 findings del detector + cero tokens de spacing. Fix: quitar shadow en reposo, tokenizar gap/padding/radius, corregir los 2 font-size fuera de ramp.

### Observaciones menores

- `<h2>` a 700 cuando DESIGN.md headline es 600.
- Título de card 18px cuando el token `title` es 14px (libera un renglón por card).
- Logo 32px compite con headline 24px; `alt="Logo de Netflix"` duplica el título para lectores de pantalla.
- Dos componentes de carrusel (Carousel vs CarouselMulti) con nav de distinto tamaño (40 vs 44px), scrollBy distinto (100% vs 80%) y bg de nav distinto.

### Preguntas provocativas

1. ¿Hero de 90svh ocultando cada raíl bajo el fold en cada visita? ¿Bajar a ~60svh?
2. ¿Por qué el medallón (el shape más reconocible) es el footer y no la primera meta de cada card?
3. ¿Querés que "Ver todo" exista como verbo o es decisión de producto dejarlo solo en search?

### Persona Red Flags

- **Casey (móvil)**: raíles de 500px de alto, ~1 card visible → thumb fatigue y scroll interminable; 8 filas idénticas para decidir en segundos.
- **Alex (power user)**: sin "Ver todo" en 6 filas → callejón sin salida, no puede explorar una plataforma entera.
- **Jordan (first-timer)**: subtítulos que repiten el título ("Estrenos de la semana / Lo nuevo que ya podés ver") suman ruido sin dato nuevo.
