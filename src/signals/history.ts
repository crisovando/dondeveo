import { signal } from "@preact/signals";
import type { DetailItem } from "../shared/types";

const LOCAL_STORAGE_KEY = "dv_history";
const CACHE_EXPIRATION_TIME = 4 * 7 * 24 * 60 * 60 * 1000;

export type HistoryItem = DetailItem & { timestamp?: number };

export const historySignal = signal<HistoryItem[] | null>(null);

export const loadHistory = () => {
  if (historySignal.value) return;
  if (typeof window === "undefined") return;

  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (saved) {
    try {
      const { data } = JSON.parse(saved);

      if (Array.isArray(data)) {
        const now = Date.now();
        const filtered = data.filter((item: HistoryItem) => {
          if (!item.timestamp) return true;
          return now - item.timestamp < CACHE_EXPIRATION_TIME;
        });
        historySignal.value = filtered;
      } else {
        historySignal.value = [];
      }
    } catch (e) {
      console.error("Error parsing history from localStorage", e);
      historySignal.value = [];
    }
  } else {
    historySignal.value = [];
  }
};

export const getHistory = (): HistoryItem[] => {
  return historySignal.value || [];
};

const saveToLocalStorage = (data: HistoryItem[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ data }));
};

export const addToHistory = (item: DetailItem) => {
  if (!historySignal.value) loadHistory();

  const history = historySignal.value || [];
  const filteredHistory = history.filter((h) => h.id !== item.id);

  const newItem: HistoryItem = { ...item, timestamp: Date.now() };
  const updatedHistory = [newItem, ...filteredHistory];

  historySignal.value = updatedHistory;
  saveToLocalStorage(updatedHistory);
};

export const removeFromHistory = (id: number) => {
  if (!historySignal.value) loadHistory();

  const updatedHistory = (historySignal.value || []).filter((g) => g.id !== id);
  historySignal.value = updatedHistory;
  saveToLocalStorage(updatedHistory);
};
