import { BASE_URL } from "../constants/movie";
import type { MovieDetail } from "../types/movie";

const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

// 모달 구현 추가: 영화 카드를 클릭했을 때 해당 영화의 상세 정보를 가져오는 API 함수입니다.
export async function fetchMovieDetail(movieId: number): Promise<MovieDetail> {
  const response = await fetch(`${BASE_URL}movie/${movieId}?language=ko-KR`, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("영화 상세 정보를 불러오지 못했습니다.");
  }

  return response.json();
}
