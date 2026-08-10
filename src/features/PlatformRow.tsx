import { useLocation } from "preact-iso";
import { CarouselMulti } from "@/components/CarouselMulti";
import { navigateToDetail } from "@/helpers/navigation";
import { AudioVisualDto, PlatformRow as PlatformRowData } from "@/shared/types";

interface PlatformRowProps {
  row: PlatformRowData;
}

export function PlatformRow({ row }: PlatformRowProps) {
  const { route } = useLocation();

  const handleClickItem = (item: AudioVisualDto) => {
    navigateToDetail(item, route);
  };

  const hasMovies = row.movies.length > 0;
  const hasTv = row.tv.length > 0;

  if (!hasMovies && !hasTv) return null;

  const logo = {
    src: row.logoPath,
    alt: `Logo de ${row.providerName}`,
  };

  const handleSeeAll = () => {
    route(`/platform/${row.providerId}`);
  };

  return (
    <>
      {hasMovies && (
        <CarouselMulti
          title={`Solo en ${row.providerName}`}
          subtitle="Películas"
          movies={row.movies}
          logo={logo}
          onClick={handleClickItem}
          onSeeAll={handleSeeAll}
          showProviders={false}
        />
      )}
      {hasTv && (
        <CarouselMulti
          title={`Solo en ${row.providerName}`}
          subtitle="Series"
          movies={row.tv}
          logo={logo}
          onClick={handleClickItem}
          onSeeAll={handleSeeAll}
          showProviders={false}
        />
      )}
    </>
  );
}
