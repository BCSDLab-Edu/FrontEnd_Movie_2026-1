import starIcon from "../../assets/star-icon.svg";
import { IMAGE_BASE_URL } from "../../constants/movie";
import type { Movie } from "../../types/movie";
import "./MovieCard.css";

interface MovieCardProps {
  movie: Movie;
  // 모달 구현 추가: MovieList에서 내려준 클릭 함수를 카드 전체에 연결합니다.
  onClick?: () => void;
}

function MovieCard({ movie, onClick }: MovieCardProps) {
  const posterSrc = movie.poster_path
    ? IMAGE_BASE_URL + movie.poster_path
    : "/favicon.svg";

  return (
    <div className="movie-card" data-movie-id={movie.id} onClick={onClick}>
      <img className="movie-card-poster" src={posterSrc} alt={movie.title} />

      <h3 className="movie-card-title">{movie.title}</h3>

      <div className="movie-card-rating">
        <span className="movie-card-rating-value">
          {movie.vote_average.toFixed(1)}
        </span>

        <img className="movie-card-star" src={starIcon} alt="별점" />
      </div>
    </div>
  );
}

export default MovieCard;
