import { signal } from "@preact/signals";

export const transitionData = signal<{
  id: number;
  title: string;
  poster: string;
  backdrop: string;
} | null>(null);
