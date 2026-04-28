import styles from "./MediaGrid.module.css";
import type { ComponentChildren } from "preact";

interface MediaGridProps {
  children: ComponentChildren;
}

export function MediaGrid({ children }: MediaGridProps) {
  return <section class={styles.container}>{children}</section>;
}
