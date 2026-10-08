import { useEffect, useState } from "preact/hooks";
import { Cast } from "@/features/Cast";
import { BackButton } from "@/features/BackButton";
import { HeroDetail } from "@/features/HeroDetail";
import { InfoItem } from "@/features/InfoItem";
import { Review } from "@/features/Review";
import { Synopsis } from "@/features/Synopsis";
import { WatchProviders } from "@/features/WatchProviders";
import { useDetailData } from "@/hooks/useDetailItem";
import { transitionData } from "@/signals/transitionData";
import { HeroDetailSkeleton } from "@/components/Skeletons";
import { addToHistory } from "@/signals/history";
import "@/styles/pages.css";

interface DetailProps {
  type: string;
  id: string;
}

export function Detail({ type, id }: DetailProps) {
  const preloaded = transitionData.value || {};
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
      <BackButton from={transitionData.value?.from} />
      {hasData ? <HeroDetail movie={finalData} /> : <HeroDetailSkeleton />}
      <article class="content-detail" data-reveal={revealed ? "in" : "out"}>
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
    </div>
  );
}
