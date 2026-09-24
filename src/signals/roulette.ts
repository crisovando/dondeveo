import { signal } from "@preact/signals";
import type { RouletteEntry } from "../shared/types";

const LOCAL_STORAGE_KEY = "dv_roulette";

export const MAX_ROULETTE_ENTRIES = 10;

export const rouletteSignal = signal<RouletteEntry[] | null>(null);

export const loadRoulette = () => {
  if (rouletteSignal.value) return;
  if (typeof window === "undefined") return;

  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!saved) {
    rouletteSignal.value = [];
    return;
  }

  try {
    const { data } = JSON.parse(saved);
    rouletteSignal.value = data;
  } catch (e) {
    console.error("Error parsing roulette from localStorage", e);
    rouletteSignal.value = [];
  }
};

export const getRoulette = (): RouletteEntry[] => {
  return rouletteSignal.value || [];
};

export const isInRoulette = (id: number) => {
  return getRoulette().some((entry) => entry.id === id);
};

export const getRouletteCount = (): number => {
  return getRoulette().length;
};

export const isRouletteFull = (): boolean => {
  return getRouletteCount() >= MAX_ROULETTE_ENTRIES;
};

const saveToLocalStorage = (data: RouletteEntry[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ data }));
};

export const addToRoulette = (entry: RouletteEntry): "added" | "duplicate" | "full" => {
  if (isInRoulette(entry.id)) return "duplicate";
  if (isRouletteFull()) return "full";

  const updated = [...getRoulette(), entry];
  rouletteSignal.value = updated;
  saveToLocalStorage(updated);

  return "added";
};

export const removeFromRoulette = (id: number) => {
  const updated = getRoulette().filter((entry) => entry.id !== id);
  rouletteSignal.value = updated;
  saveToLocalStorage(updated);
};

export const toggleRoulette = (entry: RouletteEntry) => {
  if (isInRoulette(entry.id)) {
    removeFromRoulette(entry.id);
    return;
  }

  addToRoulette(entry);
};

export const clearRoulette = () => {
  rouletteSignal.value = [];
  saveToLocalStorage([]);
};

export const pickRandomRouletteIndex = (): number => {
  const count = getRouletteCount();
  if (count === 0) return -1;

  return Math.floor(Math.random() * count);
};
