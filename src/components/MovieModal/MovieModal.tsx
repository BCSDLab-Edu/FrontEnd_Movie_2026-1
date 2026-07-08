import { useState } from "react";
import heartFilledIcon from "../../assets/heart-filled.svg";
import heartOutlineIcon from "../../assets/heart-outline.svg";
import starIcon from "../../assets/star-icon.svg";
import { IMAGE_BASE_URL } from "../../constants/movie";
import { usePreferenceStore } from "../../stores/preferenceStore";
import type { MovieDetail } from "../../types/movie";
import {
  getMovieRating,
  isWantedMovie,
  removeRatedMovie,
  saveRatedMovie,
  toggleWantedMovie,
} from "../../utils/storage";
import "./MovieModal.css";
import { useToastStore } from "../../stores/toastStore";

interface MovieModalProps {
  movie: MovieDetail;
  onClose: () => void;
}

function MovieModal({ movie, onClose }: MovieModalProps) {
  const [userRating, setUserRating] = useState(getMovieRating(movie.id));
  const [isFavorite, setIsFavorite] = useState(isWantedMovie(movie.id));
  const updateFavoriteGenres = usePreferenceStore(
    (state) => state.updateFavoriteGenres,
  );
  const showToast = useToastStore((state) => state.showToast);
  const genreText = movie.genres.map((genre) => genre.name).join(", ");
  const posterSrc = movie.poster_path
    ? IMAGE_BASE_URL + movie.poster_path
    : "/favicon.svg";

  const ratingMessage =
    userRating === 0
      ? "평가해주세요"
      : `${userRating * 2} ${
          ["", "별로예요", "아쉬워요", "보통이에요", "좋아요", "최고예요"][
            userRating
          ]
        }`;

  function handleFavoriteClick() {
    const nextIsFavorite = toggleWantedMovie(movie);
    setIsFavorite(nextIsFavorite);
    updateFavoriteGenres();

    showToast(
      nextIsFavorite ? "좋아요를 눌렀어요!" : "좋아요를 취소했어요!",
      "favorite",
    );
  }
  function handleRatingClick(starNumber: number) {
    if (userRating === starNumber) {
      setUserRating(0);
      removeRatedMovie(movie.id);
      showToast("별점을 취소했어요!", "review");
      return;
    }

    setUserRating(starNumber);
    saveRatedMovie(movie, starNumber);
    showToast("별점을 남겼어요!", "review");
  }
  return (
    <div className="movie-modal-backdrop">
      <section className="movie-modal">
        <header className="movie-modal-header">
          <h2>{movie.title}</h2>
          <button
            className="movie-modal-close"
            type="button"
            onClick={onClose}
            aria-label="모달 닫기"
          >
            X
          </button>
        </header>

        <div className="movie-modal-content">
          <img
            className="movie-modal-poster"
            src={posterSrc}
            alt={movie.title}
          />

          <div className="movie-modal-info">
            <div className="movie-modal-top-line">
              <p className="movie-modal-meta">
                {genreText}
                <img src={starIcon} alt="별점" />
                <span>{movie.vote_average.toFixed(1)}</span>
              </p>

              <button
                className="movie-modal-favorite"
                type="button"
                onClick={handleFavoriteClick}
                aria-label={isFavorite ? "찜 취소" : "찜하기"}
              >
                <img
                  src={isFavorite ? heartFilledIcon : heartOutlineIcon}
                  alt=""
                />
              </button>
            </div>

            <p className="movie-modal-overview">
              {movie.overview || "영화 소개가 아직 없습니다."}
            </p>

            <div className="movie-modal-rating-box">
              <span>내 별점</span>

              <div className="movie-modal-stars" aria-label="내 별점 선택">
                {[1, 2, 3, 4, 5].map((starNumber) => (
                  <button
                    key={starNumber}
                    className="movie-modal-star-button"
                    type="button"
                    onClick={() => handleRatingClick(starNumber)}
                    aria-label={`${starNumber * 2}점`}
                  >
                    {starNumber <= userRating ? "★" : "☆"}
                  </button>
                ))}
              </div>

              <span>{ratingMessage}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default MovieModal;
