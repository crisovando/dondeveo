import { CSSProperties, ImgHTMLAttributes } from "preact";
import { useState } from "preact/hooks";

const BASE_PATH_IMG = "https://image.tmdb.org/t/p/";

const TMDB_SIZES = {
  poster: ["w185", "w342", "w500", "w780"],
  backdrop: ["w300", "w780", "w1280"],
  profile: ["w185", "w342", "w500"],
  still: ["w185", "w300"],
};

export type sizeType = "w185" | "w300" | "w342" | "w500" | "w780" | "w1280" | "original";

type Layout = "poster-grid" | "poster-carousel" | "backdrop-hero" | "poster-detail";

export interface ImgTmdbProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "style"> {
  style?: CSSProperties;
  size?: sizeType;
  type?: keyof typeof TMDB_SIZES;
  layout?: Layout;
  withSkeleton?: boolean;
  disableAspectRadio?: boolean;
}

function getSizes(layout?: Layout) {
  switch (layout) {
    case "poster-grid":
      return "(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 200px";

    case "poster-carousel":
      return "(max-width: 640px) 60vw, 250px";

    case "backdrop-hero":
      return "100vw";

    case "poster-detail":
      return "(max-width: 768px) 80vw, 300px";

    default:
      return "100vw";
  }
}

function getAspectRatio(type?: string) {
  switch (type) {
    case "poster":
      return "2 / 3";
    case "backdrop":
      return "16 / 9";
    case "profile":
      return "1 / 1";
    default:
      return undefined;
  }
}

export function ImgTmdb({
  size = "w500",
  src,
  type,
  layout,
  style,
  alt,
  withSkeleton,
  ...props
}: ImgTmdbProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const srcUrl = `${BASE_PATH_IMG}${size}${src}`;

  let srcSet: string | undefined;

  if (type) {
    srcSet = TMDB_SIZES[type]
      .map((s) => {
        const width = s.replace("w", "");
        return `${BASE_PATH_IMG}${s}${src} ${width}w`;
      })
      .join(", ");
  }

  const sizes = getSizes(layout);
  const aspectRatio = getAspectRatio(type);

  if (!src || error) {
    return (
      <div
        style={{
          aspectRatio,
          background: "#222",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#888",
          fontSize: "12px",
        }}
      >
        {alt || "No image"}
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        aspectRatio,
        overflow: "hidden",
      }}
    >
      {withSkeleton && loading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, #222 25%, #333 37%, #222 63%)",
            backgroundSize: "400% 100%",
            animation: "skeleton 1.4s ease infinite",
          }}
        />
      )}
      <img
        src={srcUrl}
        srcSet={srcSet}
        sizes={sizes}
        loading={props.loading ?? "lazy"}
        decoding="async"
        onLoad={() => setLoading(false)}
        onError={() => setError(true)}
        style={{
          width: "100%",
          height: "auto",
          aspectRatio,
          objectFit: "cover",
          ...style,
        }}
        {...props}
      />
    </div>
  );
}
