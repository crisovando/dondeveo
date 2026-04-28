import { CardWidget } from "@/components/CardWidget";
import styles from "./Review.module.css";
import { Star } from "lucide-preact";

interface ReviewProps {
  review?: string;
  author?: string;
  rating?: number;
}

export function Review({ review, author, rating }: ReviewProps) {
  if (!review) return null;

  return (
    <CardWidget>
      <h3 class={styles.title}>Críticas</h3>
      <p class={styles.review}>{review}</p>
      <div class={styles.reviewInfo}>
        <span class={styles.author}>{author}</span>
        <span class={styles.ratingGroup}>
          <Star class={styles.icon} fill="yellow" size={16} />
          <span class={styles.rating}>{rating}</span>
        </span>
      </div>
    </CardWidget>
  );
}
