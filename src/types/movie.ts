export interface MovieAPISuccess {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface MovieAPIFailure {
  status_message: string;
  status_code: number;
  success?: boolean;
}

export type MovieAPIResponse = MovieAPISuccess | MovieAPIFailure;

export interface Movie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

// 모달 구현 추가: 영화 상세 API에서 장르 이름 분리하여 받아오기 위한 타입입니다.
export interface MovieDetail extends Omit<Movie, "genre_ids"> {
  genres: {
    id: number;
    name: string;
  }[];
}
