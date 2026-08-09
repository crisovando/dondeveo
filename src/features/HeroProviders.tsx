import { ProviderWithType } from "@/shared/types";
import { useWatchProviders } from "@/hooks/useWatchProviders";
import { isStreamProvider } from "@/hooks/useProvidersMap";
import styles from "./HeroProviders.module.css";
import { Cast } from "lucide-preact";

interface HeroProvidersProps {
  type?: string;
  id?: number;
  title?: string;
}

const BUILTIN_LABELS: Record<string, string> = {
  Netflix: "Netflix",
  "Amazon Prime Video": "Prime Video",
  "Disney Plus": "Disney+",
  Max: "Max",
  "Apple TV Plus": "Apple TV+",
  "HBO Max": "Max",
  Paramount: "Paramount+",
  "Paramount Plus": "Paramount+",
};

function labelFor(provider: ProviderWithType): string {
  return BUILTIN_LABELS[provider.providerName] ?? provider.providerName;
}

export function HeroProviders({ type, id, title }: HeroProvidersProps) {
  const { data, loading, error } = useWatchProviders(type, id, title);

  if (error) return null;

  const providers = data?.providers.filter(isStreamProvider) ?? [];

  if (loading && providers.length === 0) {
    return (
      <p class={styles.line} aria-hidden="true">
        <span class={styles.label}>Disponible en</span>
        <span class={styles.loadingDots} />
      </p>
    );
  }

  if (providers.length === 0) return null;

  return (
    <div class={styles.line}>
      <span class={styles.label}>
        <Cast size={14} strokeWidth={2} aria-hidden="true" />
        Donde ver
      </span>
      <span class={styles.logos}>
        {providers.slice(0, 4).map((provider) => (
          <span
            class={styles.chip}
            key={provider.providerId}
            title={labelFor(provider)}
            aria-label={`Disponible en ${labelFor(provider)}`}
          >
            <img
              src={`https://image.tmdb.org/t/p/w92${provider.logoPath}`}
              alt=""
              class={styles.logo}
              loading="lazy"
              decoding="async"
            />
            <span class={styles.name}>{labelFor(provider)}</span>
          </span>
        ))}
      </span>
    </div>
  );
}