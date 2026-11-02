const BASE_PATH_IMG = "https://image.tmdb.org/t/p/";

export function buildTmdbSrc(path: string | null, size: string) {
  return `${BASE_PATH_IMG}${size}${path || ""}`;
}

export function buildTmdbSrcSet(path: string, sizes: string[]) {
  return sizes.map((s) => `${BASE_PATH_IMG}${s}${path} ${s.replace("w", "")}w`).join(", ");
}

export function mediaTypeLabel(mediaType?: string): string {
  if (mediaType === "movie") return "Película";
  if (mediaType === "tv") return "Serie";
  return mediaType ?? "";
}

export function formatRuntime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest} min`;
  return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`;
}

export function formatSeasonCount(count: number): string {
  return count === 1 ? "1 temporada" : `${count} temporadas`;
}

export const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);

  return new Intl.DateTimeFormat("es-AR", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })
    .format(date)
    .replace(".", "");
};
