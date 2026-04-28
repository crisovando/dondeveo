import { ImgHTMLAttributes } from "preact";

const BASE_PATH_IMG = "https://image.tmdb.org/t/p/";

const TMDB_SIZES = {
  poster: ["w185", "w342", "w500", "w780"],
  backdrop: ["w300", "w780", "w1280"],
  profile: ["w185", "w342", "w500"],
  still: ["w185", "w300"],
};

export type sizeType = "w185" | "w300" | "w342" | "w500" | "w780" | "w1280" | "original";

export interface ImgTmdbProps extends ImgHTMLAttributes<HTMLImageElement> {
  size?: sizeType;
  type?: keyof typeof TMDB_SIZES;
}

export function Img({ size = "w500", src, type, loading = "lazy", ...props }: ImgTmdbProps) {
  if (!src) return null;

  const pathImage = `${BASE_PATH_IMG}${size}${src}`;

  let srcSet;
  if (type) {
    srcSet = TMDB_SIZES[type]
      .map((s) => `${BASE_PATH_IMG}${s}${src} ${s.replace("w", "")}w`)
      .join(", ");
  }

  return <img src={pathImage} srcSet={srcSet || props.srcSet} loading={loading} {...props} />;
}
