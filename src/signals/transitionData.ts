import { signal } from "@preact/signals";

export const transitionData = signal<{
  id: number;
  title: string;
  poster: string | null;
  backdrop: string;
  from: string;
} | null>(null);

// Person consumes this to paint the tapped avatar before its fetch resolves: the
// new snapshot is captured on navigation, so an empty destination morphs into
// nothing. `personId` keeps a stale signal from naming an unrelated person.
export const castTransitionData = signal<{
  personId: number;
  transitionName: string;
  photo: string | null;
  name: string;
} | null>(null);
