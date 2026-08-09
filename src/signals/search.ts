import { signal } from "@preact/signals";
import type { SearchData } from "@/shared/types";

export interface SearchSession {
  query: string;
  data: SearchData | null;
  scrollY: number;
}

export const searchSession = signal<SearchSession>({
  query: "",
  data: null,
  scrollY: 0,
});
