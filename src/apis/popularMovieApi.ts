import { BASE_URL } from "../constants/movie";
import type { Movie, MovieAPIResponse } from "../types/movie";

const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

export async function fetchPopularMovies(page: number = 1): Promise<Movie[]> {
  const response = await fetch(
    `${BASE_URL}movie/popular?language=ko-KR&page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        accept: "application/json",
      },
    },
  );

  const data: MovieAPIResponse = await response.json();

  if ("results" in data) {
    return data.results;
  }

  throw new Error(data.status_message);
}
