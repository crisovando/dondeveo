import { AudioVisualDto } from "@/shared/types";

export function addFavorite(item: Partial<AudioVisualDto>) {
  const datosActuales = JSON.parse(localStorage.getItem("favorites") || "[]") || [];
  datosActuales.push(item);
  localStorage.setItem("favorites", JSON.stringify(datosActuales));
}

export function deleteFavorite(id: number) {
  const favorites = getFavorites();
  localStorage.setItem("favorites", JSON.stringify(favorites.filter((f) => f.id !== id)));
}

export function getFavorites(): Partial<AudioVisualDto>[] {
  return JSON.parse(localStorage.getItem("favorites") || "[]") || [];
}

export function isFavorite(id: number) {
  const favorites = getFavorites();
  return favorites.some((f: Partial<AudioVisualDto>) => f.id === id);
}
