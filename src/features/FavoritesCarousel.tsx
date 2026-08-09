import { useLocation } from "preact-iso";
import { CalendarHeart } from "lucide-preact";
import { CarouselMulti } from "@/components/CarouselMulti";
import { navigateToDetail } from "@/helpers/navigation";
import { AudioVisualDto } from "@/shared/types";
import { getFavorites } from "@/signals/favorites";
import { EmptyRow } from "@/components/EmptyRow";

export function FavoritesCarousel() {
  const { route } = useLocation();
  const favorites = getFavorites();

  const handleClickMovie = (movie: AudioVisualDto) => {
    navigateToDetail(movie, route);
  };

  const handleClickSeeAll = () => {
    route("/favorites");
  };

  if (favorites.length === 0) {
    return (
      <EmptyRow
        title="Mis favoritos"
        subtitle="Tus próximas citas"
        icon={<CalendarHeart size={28} strokeWidth={1.75} />}
        heading="Todavía no agendaste ninguna cita"
        description="Guardá una peli que quieras ver y poné fecha, lugar y con quién. Así no se te escapa ninguna."
        action="Descubrí películas y series"
        onAction={() => route("/")}
      />
    );
  }

  return (
    <CarouselMulti
      title="Mis favoritos"
      subtitle="Tus próximas citas"
      movies={favorites}
      onClick={handleClickMovie}
      onSeeAll={handleClickSeeAll}
    />
  );
}