import { ProviderWithType } from "@/shared/types";
import { isStreamProvider } from "@/hooks/useProvidersMap";
import styles from "./CardProviders.module.css";

interface CardProvidersProps {
  providers: ProviderWithType[];
}

const MAX_VISIBLE = 3;

export function CardProviders({ providers }: CardProvidersProps) {
  const stream = providers.filter(isStreamProvider);
  const visible = stream.slice(0, MAX_VISIBLE);
  const extra = stream.length - visible.length;

  if (stream.length === 0) return null;

  return (
    <div class={styles.line} title={stream.map((p) => p.providerName).join(", ")}>
      <span class={styles.logos}>
        {visible.map((provider) => (
          <img
            key={provider.providerId}
            src={`https://image.tmdb.org/t/p/w45${provider.logoPath}`}
            alt=""
            class={styles.logo}
            loading="lazy"
            decoding="async"
          />
        ))}
        {extra > 0 && <span class={styles.extra}>+{extra}</span>}
      </span>
    </div>
  );
}