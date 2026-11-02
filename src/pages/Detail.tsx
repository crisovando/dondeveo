import { useEffect, useState } from "preact/hooks";
import { useLocation } from "preact-iso";
import { Cast } from "@/features/Cast";
import { BackButton } from "@/features/BackButton";
import { HeroDetail } from "@/features/HeroDetail";
import { InfoItem } from "@/features/InfoItem";
import { MediaRail } from "@/features/MediaRail";
import { Review } from "@/features/Review";
import { SeasonsRail } from "@/features/SeasonsRail";
import { Synopsis } from "@/features/Synopsis";
import { WatchProviders } from "@/features/WatchProviders";
import { useDetailData } from "@/hooks/useDetailItem";
import { navigateToDetail } from "@/helpers/navigation";
import type { DetailItem } from "@/shared/types";
import { transitionData } from "@/signals/transitionData";
import { HeroDetailSkeleton } from "@/components/Skeletons";
import { addToHistory } from "@/signals/history";
import "@/styles/pages.css";

interface DetailProps {
  type: string;
  id: string;
}

export function Detail({ type, id }: DetailProps) {
  const { route } = useLocation();
  const preload = transitionData.value;
  // The snapshot is only valid for the title that painted it; a stale signal
  // (back navigation, detail-to-detail) must not leak another title's poster.
  const preloaded: Partial<DetailItem> & { from?: string } =
    preload && String(preload.id) === id ? preload : {};
  const { data } = useDetailData(type, id);

  useEffect(() => {
    if (!data?.id) return;
    addToHistory(data);
  }, [data]);

  const [revealed, setRevealed] = useState(false);

  // The single frame after mount commits the shared hero snapshot; the reveal
  // itself is delayed in CSS so the content lands after the poster has expanded.
  useEffect(() => {
    setRevealed(false);
    const frame = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(frame);
  }, [id]);

  const finalData = {
    ...preloaded,
    ...data,
  };

  const hasData = !!finalData.id;

  return (
    <div class="details">
      <BackButton from={preloaded.from} />
      {hasData ? <HeroDetail movie={finalData} /> : <HeroDetailSkeleton />}
      <div class="detail-body" data-reveal={revealed ? "in" : "out"}>
        <article class="content-detail">
          <div class="left-column">
            <WatchProviders providers={finalData.providers} />
            <Synopsis text={finalData.overview || ""} />
            <Cast cast={finalData.credits?.cast || []} />
          </div>
          <div class="right-column">
            <InfoItem item={finalData} />
            <Review
              review={finalData.review?.content}
              author={finalData.review?.author}
              rating={finalData.review?.rating}
            />
          </div>
        </article>

        <MediaRail
          title="Recomendados"
          subtitle="Si te gustó esta, mirá estas"
          items={finalData.recommendations ?? []}
          onSelect={(item) => navigateToDetail(item, route)}
        />

        <SeasonsRail seasons={finalData.seasons ?? []} />
      </div>
    </div>
  );
}
