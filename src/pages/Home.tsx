import { useHomeData, retryHomeData } from "@/hooks/useHomeData";
import { HeroHome } from "@/features/HeroHome";
import { Popular, PopularProps } from "@/features/Popular";
import { FavoritesCarousel } from "@/features/FavoritesCarousel";
import { HistoryCarousel } from "@/features/HistoryCarousel";
import { MovieSkeleton, HeroDetailSkeleton } from "@/components/Skeletons";
import { TopAnime } from "@/features/TopAnime";
import { HomeError } from "@/features/HomeError";

export function Home() {
  const { data, error } = useHomeData();

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
      <Popular title="Películas" subtitle="Las más valoradas del momento" movies={data.topRatedMovies} />
      <Series movies={data.topRatedTv} />
      <FavoritesCarousel />
      <HistoryCarousel />
      <TopAnime animes={data.topAnime} />
    </div>
  );
}

interface MoviesRowProps {
  movies: PopularProps["movies"];
}

function Series({ movies }: MoviesRowProps) {
  return <Popular title="Series" subtitle="Las series más valoradas del momento" movies={movies} />;
}