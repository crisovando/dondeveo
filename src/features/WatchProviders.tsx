import { ProviderWithType } from "@/shared/types";
import styles from "./WatchProviders.module.css";
import { Img } from "@/components/Img";
import { Cast, VideoOff } from "lucide-preact";
import { CardWidget } from "@/components/CardWidget";
import { WatchProvidersSkeleton } from "@/components/Skeletons";

interface WatchProvidersProps {
  providers?: ProviderWithType[];
}

function getProviderTypeText(type: string, providerName: string): string {
  const upperType = type.toUpperCase();
  if (upperType === "FLATRATE") {
    if (providerName.toLowerCase().includes("prime")) return "INCLUDED";
    return "SUBSCRIPCIÓN";
  }
  if (upperType === "FREE") return "GRATIS";
  if (upperType === "ADS") return "CON ANUNCIOS";
  if (upperType === "RENT") return "ALQUILER";
  if (upperType === "BUY") return "COMPRAR";
  return upperType;
}

function EmptyProviders() {
  return (
    <CardWidget className={styles.cardWidget}>
      <VideoOff size={24} strokeWidth={1.5} class={styles.icon} />
      <h3 class={styles.emptyHeader}>Disponibilidad no encontrada</h3>
      <div class={styles.emptyDescription}>
        <span class="">
          No hemos podido encontrar plataformas de streaming para este título en tu región en este
          momento
        </span>
      </div>
    </CardWidget>
  );
}

function WatchProvidersList({ providers }: WatchProvidersProps) {
  return (
    <div class={styles.containerCard}>
      {providers.map((provider) => (
        <div class={styles.card} key={`${provider.providerId}-${provider.type}`}>
          <Img src={provider.logoPath} class={styles.logo} />
          <span class={styles.typeText}>
            {getProviderTypeText(provider.type, provider.providerName)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function WatchProviders({ providers }: WatchProvidersProps) {
  const isLoading = providers === undefined;

  return (
    <section class={styles.section}>
      <h2 class={styles.title}>
        <Cast class={styles.icon} size={24} strokeWidth={2.5} />
        Donde mirar
      </h2>
      {isLoading ? (
        <WatchProvidersSkeleton />
      ) : providers.length === 0 ? (
        <EmptyProviders />
      ) : (
        <WatchProvidersList providers={providers} />
      )}
    </section>
  );
}
