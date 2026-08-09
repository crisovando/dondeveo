import { CarouselMulti } from "@/components/CarouselMulti";
import { navigateToDetail } from "@/helpers/navigation";
import { AudioVisualDto } from "@/shared/types";
import { useLocation } from "preact-iso";

interface TopAnimeProps {
  animes: AudioVisualDto[];
}

export function TopAnime({ animes }: TopAnimeProps) {
  const { route } = useLocation();

  const handleClickAnime = (anime: AudioVisualDto) => {
    navigateToDetail(anime, route);
  };

  return (
    <CarouselMulti
      title="Animé"
      subtitle="Los animés más populares del momento"
      movies={animes}
      onClick={handleClickAnime}
    />
  );
}
