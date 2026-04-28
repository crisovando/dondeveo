import { CarouselMulti } from "@/components/CarouselMulti";
import { navigateToDetail } from "@/helpers/navigation";
import { AudioVisualDto } from "@/shared/types";
import { useLocation } from "preact-iso";

interface PopularProps {
  movies: AudioVisualDto[];
}

export function Popular({ movies }: PopularProps) {
  const { route } = useLocation();

  const handleClickMovie = (movie: AudioVisualDto) => {
    navigateToDetail(movie, route);
  };

  return (
    <CarouselMulti
      title="Populares"
      subtitle="Las películas más populares del momento"
      movies={movies}
      onClick={handleClickMovie}
    />
  );
}
