import { signal } from "@preact/signals";
import type { AudioVisualDto, FavoriteEntry } from "../shared/types";

const LOCAL_STORAGE_KEY = "dv_favorites";

export const favoritesSignal = signal<FavoriteEntry[] | null>(null);

export const loadFavorites = () => {
  if (favoritesSignal.value) return;
  if (typeof window === "undefined") return;

  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (saved) {
    try {
      const { data } = JSON.parse(saved);
      favoritesSignal.value = data;
    } catch (e) {
      console.error("Error parsing favorites from localStorage", e);
    }
  }
};

export const isFavorite = (id: number) => {
  return favoritesSignal.value?.some((g) => g.id === id);
};

export const getFavorites = (): FavoriteEntry[] => {
  return favoritesSignal.value || [];
};

export const addToFavorites = (entry: FavoriteEntry) => {
  favoritesSignal.value = [...(favoritesSignal.value || []), entry];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ data: favoritesSignal.value }));
};

export const removeFromFavorites = (id: number) => {
  favoritesSignal.value = favoritesSignal.value?.filter((g) => g.id !== id) || [];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ data: favoritesSignal.value }));
};

export const toggleFavorite = (favorite: AudioVisualDto) => {
  if (isFavorite(favorite.id)) {
    removeFromFavorites(favorite.id);
  }
};
