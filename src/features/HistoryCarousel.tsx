import { useLocation } from "preact-iso";
import { CarouselMulti } from "@/components/CarouselMulti";
import { navigateToDetail } from "@/helpers/navigation";
import { AudioVisualDto } from "@/shared/types";
import { getHistory } from "@/signals/history";

export function HistoryCarousel() {
  const { route } = useLocation();
  const history = getHistory();

  const handleClickMovie = (movie: AudioVisualDto) => {
    navigateToDetail(movie, route);
  };

  const handleClickSeeAll = () => {
    route("/history");
  };

  return (
    <CarouselMulti
      title="Los que ya buscaste"
      subtitle="No los pierdas de vista"
      movies={history}
      onClick={handleClickMovie}
      onSeeAll={handleClickSeeAll}
    />
  );
}
