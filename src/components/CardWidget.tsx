import type { ComponentChildren } from "preact";
import styles from "./CardWidget.module.css";
import clsx from "clsx";

interface CardWidgetProps {
  children: ComponentChildren;
  className?: string;
}

export function CardWidget({ children, className }: CardWidgetProps) {
  return <div class={clsx(styles.cardWidget, className)}>{children}</div>;
}
