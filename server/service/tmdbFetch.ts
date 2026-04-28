const TMDB_URL = "https://api.themoviedb.org/3/";

export async function fetchTMDB<T>(path: string, params?: URLSearchParams): Promise<T> {
  if (!params) {
    params = new URLSearchParams();
  }

  params.append("language", "es-AR");

  try {
    const response = await fetch(`${TMDB_URL}${path}?${params}`, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      },
    });

    const res = await response.json();

    return res;
  } catch (error) {
    console.error(JSON.stringify(error));
    throw new Error("Error en TMDb");
  }
}
