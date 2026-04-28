const BASE_PATH_IMG = "https://image.tmdb.org/t/p/";

export function buildTmdbSrc(path: string | null, size: string) {
  return `${BASE_PATH_IMG}${size}${path || ""}`;
}

export function buildTmdbSrcSet(path: string, sizes: string[]) {
  return sizes.map((s) => `${BASE_PATH_IMG}${s}${path} ${s.replace("w", "")}w`).join(", ");
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
