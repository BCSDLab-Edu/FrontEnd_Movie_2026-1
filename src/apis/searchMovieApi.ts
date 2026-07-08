import { BASE_URL } from "../constants/movie";
import type { Movie, MovieAPIResponse } from "../types/movie";

const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

export async function searchMovies(query: string, page = 1): Promise<Movie[]> {
  const params = new URLSearchParams({
    query,
    language: "ko-KR",
    page: String(page),
  });
  const response = await fetch(`${BASE_URL}search/movie?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      accept: "application/json",
    },
  });

  const data: MovieAPIResponse = await response.json();

  if ("results" in data) {
    return data.results;
  }
  throw new Error(data.status_message);
}
