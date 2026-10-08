import { signal } from "@preact/signals";

export const transitionData = signal<{
  id: number;
  title: string;
  poster: string | null;
  backdrop: string;
  from: string;
} | null>(null);

// Painted by Person before its fetch resolves; `personId` rejects a stale signal.
export const castTransitionData = signal<{
  personId: number;
  photo: string | null;
  name: string;
  from: string;
} | null>(null);
