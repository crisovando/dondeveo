import { useLocation } from "preact-iso";
import { History } from "lucide-preact";
import { CarouselMulti } from "@/components/CarouselMulti";
import { navigateToDetail } from "@/helpers/navigation";
import { AudioVisualDto } from "@/shared/types";
import { getHistory } from "@/signals/history";
import { EmptyRow } from "@/components/EmptyRow";

export function HistoryCarousel() {
  const { route } = useLocation();
  const history = getHistory();

  const handleClickMovie = (movie: AudioVisualDto) => {
    navigateToDetail(movie, route);
  };

  const handleClickSeeAll = () => {
    route("/historical");
  };

  if (history.length === 0) {
    return (
      <EmptyRow
        title="Los que ya buscaste"
        subtitle="No los pierdas de vista"
        icon={<History size={28} strokeWidth={1.75} />}
        heading="Todavía no viste nada"
        description="Cuando entres al detalle de una película o serie, se va a guardar acá automáticamente para que la retomes."
        action="Explorar el inicio"
        onAction={() => route("/")}
      />
    );
  }

  return (
    <CarouselMulti
      title="Los que ya buscaste"
      subtitle="No los pierdas de vista"
      movies={history as AudioVisualDto[]}
      onClick={handleClickMovie}
      onSeeAll={handleClickSeeAll}
    />
  );
}