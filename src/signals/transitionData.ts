import { signal } from "@preact/signals";

export const transitionData = signal<{
  id: number;
  title: string;
  poster: string | null;
  backdrop: string;
  from: string;
} | null>(null);
