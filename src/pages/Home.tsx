import { useHomeData } from "@/hooks/useHomeData";
import { HeroHome } from "@/features/HeroHome";
import { Popular } from "@/features/Popular";
import { FavoritesCarousel } from "@/features/FavoritesCarousel";
import { HistoryCarousel } from "@/features/HistoryCarousel";
import { Spinner } from "@/components/Spinner";

export function Home() {
  const { data } = useHomeData();

  return (
    <div class="home">
      {!data && <Spinner />}
      <HeroHome movies={data?.trending ?? []} />
      <Popular movies={data?.trending ?? []} />
      <FavoritesCarousel />
      <HistoryCarousel />
    </div>
  );
}
