import { useLocation } from "preact-iso";
import { CarouselMulti } from "@/components/CarouselMulti";
import { navigateToDetail } from "@/helpers/navigation";
import { AudioVisualDto } from "@/shared/types";
import { getFavorites } from "@/signals/favorites";

export function FavoritesCarousel() {
  const { route } = useLocation();
  const favorites = getFavorites();

  const handleClickMovie = (movie: AudioVisualDto) => {
    navigateToDetail(movie, route);
  };

  const handleClickSeeAll = () => {
    route("/favorites");
  };

  return (
    <CarouselMulti
      title="Mis favoritos"
      subtitle="Lo que te queda por ver"
      movies={favorites}
      onClick={handleClickMovie}
      onSeeAll={handleClickSeeAll}
    />
  );
}
