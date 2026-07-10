import { BASE_URL } from "../constants/movie";
import type { MovieAPIResponse, MovieAPISuccess } from "../types/movie";

const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

//api 호출 함수
export async function fetchPopularMovies(page = 1): Promise<MovieAPISuccess> {
  const response = await fetch(
    `${BASE_URL}movie/popular?language=ko-KR&page=${page}`, //쿼리 문자열
    {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        accept: "application/json",
      },
    },
  );

  const data: MovieAPIResponse = await response.json();

  if ("results" in data) {
    return data;
  }

  throw new Error(data.status_message);
}
