import { CarouselMulti } from "@/components/CarouselMulti";
import { navigateToDetail } from "@/helpers/navigation";
import { AudioVisualDto } from "@/shared/types";
import { useLocation } from "preact-iso";

export interface PopularProps {
  title?: string;
  subtitle?: string;
  movies: AudioVisualDto[];
}

export function Popular({ title = "Populares", subtitle = "Las películas más populares del momento", movies }: PopularProps) {
  const { route } = useLocation();

  const handleClickMovie = (movie: AudioVisualDto) => {
    navigateToDetail(movie, route);
  };

  return (
    <CarouselMulti
      title={title}
      subtitle={subtitle}
      movies={movies}
      onClick={handleClickMovie}
    />
  );
}