import { ButtonHTMLAttributes, VNode } from "preact";
import styles from "./ButtonHero.module.css";
import clsx from "clsx";

interface ButtonHeroProps extends ButtonHTMLAttributes {
  variant: "primary" | "secondary";
  icon?: VNode;
}

export function ButtonHero({ variant, icon, children, ...props }: ButtonHeroProps) {
  return (
    <button class={clsx(styles[variant], styles.button)} {...props}>
      {icon}
      {children}
    </button>
  );
}
