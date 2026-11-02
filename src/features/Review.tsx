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

  const hasRating = typeof rating === "number" && rating > 0;

  return (
    <CardWidget>
      <h3 class={styles.title}>Críticas</h3>
      <p class={styles.review}>{review}</p>
      {(author || hasRating) && (
        <div class={styles.reviewInfo}>
          {author && <span class={styles.author}>{author}</span>}
          {hasRating && (
            <span class={styles.ratingGroup}>
              <Star class={styles.icon} fill="currentColor" size={16} aria-hidden="true" />
              <span class={styles.rating}>{rating}</span>
            </span>
          )}
        </div>
      )}
    </CardWidget>
  );
}
