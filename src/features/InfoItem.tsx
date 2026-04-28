import { CardWidget } from "@/components/CardWidget";
import styles from "./InfoItem.module.css";
import { DetailItem } from "@/shared/types";

interface InfoItemProps {
  item: DetailItem;
}

export function InfoItem({ item }: InfoItemProps) {
  return (
    <CardWidget className={styles.card}>
      <h3 class={styles.title}>Detalles técnicos</h3>
      <div class={styles.tecnicalDetailContainer}>
        {item.createdBy && item.createdBy.length > 0 && (
          <div>
            <div class={styles.label}>Creado por</div>
            {item.createdBy.map((creator) => (
              <div class={styles.value}>{creator.name}</div>
            ))}
          </div>
        )}
        <div>
          <div class={styles.label}>Director</div>
          <div class={styles.value}>
            {item.credits?.crew
              ?.filter((crew) => crew.job === "Director")
              .map((crew) => crew.name)
              .join(", ")}
          </div>
        </div>
        <div>
          <div class={styles.label}>Estudios</div>
          <div class={styles.value}>
            {item.productionCompanies?.map((company) => company.name).join(", ")}
          </div>
        </div>
        <div>
          <div class={styles.label}>Clasificación</div>
          <div class={styles.value}>{item.contentRating}</div>
        </div>
      </div>
    </CardWidget>
  );
}
