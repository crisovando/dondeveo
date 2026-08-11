import { useHomeData, retryHomeData } from "@/hooks/useHomeData";
import { HeroHome } from "@/features/HeroHome";
import { Popular } from "@/features/Popular";
import { FavoritesCarousel } from "@/features/FavoritesCarousel";
import { HistoryCarousel } from "@/features/HistoryCarousel";
import { PlatformRow } from "@/features/PlatformRow";
import { MovieSkeleton, HeroDetailSkeleton } from "@/components/Skeletons";
import { TopAnime } from "@/features/TopAnime";
import { TopTenRow } from "@/features/TopTenRow";
import { GridRow } from "@/features/GridRow";
import { HomeError } from "@/features/HomeError";
import { favoritesSignal } from "@/signals/favorites";
import { historySignal } from "@/signals/history";

export function Home() {
  const { data, error } = useHomeData();
  // Read the signals directly (never trigger a synchronous localStorage load):
  // on the server they are always empty, and the client's FIRST render must
  // produce the same tree so hydration stays in sync. loadFavorites/loadHistory
  // run in an effect after mount, so returning users still get their rows.
  const hasFavorites = (favoritesSignal.value?.length ?? 0) > 0;
  const hasHistory = (historySignal.value?.length ?? 0) > 0;

  if (error) {
    return <HomeError message={error} onRetry={retryHomeData} />;
  }

  if (!data) {
    return (
      <div class="home home--loading" aria-busy="true" aria-label="Cargando el inicio">
        <HeroDetailSkeleton />
        <MovieSkeleton />
        <MovieSkeleton />
        <MovieSkeleton />
      </div>
    );
  }

  return (
    <div class="home">
      <HeroHome movies={data.trending} />
      {hasFavorites && <FavoritesCarousel />}
      {hasHistory && <HistoryCarousel />}
      <Popular title="Estrenos de la semana" subtitle="Lo nuevo que ya podés ver" movies={data.newReleases} />
      {data.platforms.map((platform) => (
        <PlatformRow key={platform.providerId} row={platform} />
      ))}
      <TopTenRow title="Lo más visto en Argentina" subtitle="Lo que más se ve en tus plataformas" movies={data.mostPopularAR} />
      <GridRow title="Películas" subtitle="Las más valoradas del momento" movies={data.topRatedMovies} />
      <GridRow title="Series" subtitle="Las series más valoradas del momento" movies={data.topRatedTv} />
      {!hasHistory && <HistoryCarousel />}
      {!hasFavorites && <FavoritesCarousel />}
      <TopAnime animes={data.topAnime} />
    </div>
  );
}
