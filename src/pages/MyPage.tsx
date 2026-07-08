import { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../components/Header/Header";
import MovieModal from "../components/MovieModal/MovieModal";
import { fetchMovieDetail } from "../apis/movieDetailApi";
import { IMAGE_BASE_URL } from "../constants/movie";
import type { MovieDetail } from "../types/movie";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/userStore";
import {
  getRatedMovies,
  getWantedMovies,
  type SavedMovie,
} from "../utils/storage";
import { usePreferenceStore } from "../stores/preferenceStore";
import "./MyPage.css";

type ActiveTab = "rated" | "wanted";

function MyPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ActiveTab>("rated");
  const [ratedMovies, setRatedMovies] = useState<SavedMovie[]>([]);
  const [wantedMovies, setWantedMovies] = useState<SavedMovie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MovieDetail | null>(null);
  const nickname = useUserStore((state) => state.nickname);
  const initializeUser = useUserStore((state) => state.initializeUser);

  /*const { nickname, initializeUser } = useUserStore((state) => ({
  nickname: state.nickname,
  initializeUser: state.initializeUser,
}));

둘중 하나만 변경되어도 연관된 부분의 리랜더링이 발생가능 
그래서 나눴을 때는 방지 가능
이를 방지하고싶으면 useShallow라는 훅이 따로 있어서 이를 사용하면 둘중 하나가 바뀌었을 때 
바뀐 것만 적용하는게 있음

*/

  const favoriteGenres = usePreferenceStore((state) => state.favoriteGenres);
  const updateFavoriteGenres = usePreferenceStore(
    (state) => state.updateFavoriteGenres,
  );
  useEffect(() => {
    initializeUser();

    const loginUser = useUserStore.getState().isLoggedIn;

    if (!loginUser) {
      alert("로그인이 필요한 페이지입니다.");
      navigate("/login");
      return;
    }

    setRatedMovies(getRatedMovies());
    setWantedMovies(getWantedMovies());
    updateFavoriteGenres();
  }, [initializeUser, navigate, updateFavoriteGenres]);
  const currentMovies = activeTab === "rated" ? ratedMovies : wantedMovies;

  async function handleMovieClick(movieId: number) {
    const movieDetail = await fetchMovieDetail(movieId);
    setSelectedMovie(movieDetail);
  }

  function handleCloseModal() {
    setSelectedMovie(null);

    setRatedMovies(getRatedMovies());
    setWantedMovies(getWantedMovies());
    updateFavoriteGenres();
  }
  return (
    <>
      <Header
        searchValue=""
        onSearchValueChange={() => {}}
        onSearchSubmit={() => {}}
      />

      <main className="mypage">
        <section className="profile-card">
          <div className="profile-image">개인 사진</div>

          <div className="profile-info">
            <PageTitle>{nickname}</PageTitle>
            <p>
              평가 영화 수 :{" "}
              <span className="highlight">{ratedMovies.length}</span>
            </p>
            <p>
              선호 장르 :{" "}
              {favoriteGenres.length > 0
                ? favoriteGenres.join(", ")
                : "좋아요한 영화가 아직 없습니다"}
            </p>
          </div>
        </section>

        <section className="movie-section">
          <div className="tab-menu">
            <button
              type="button"
              className={activeTab === "rated" ? "tab active" : "tab"}
              onClick={() => setActiveTab("rated")}
            >
              평가한 영화
            </button>

            <button
              type="button"
              className={activeTab === "wanted" ? "tab active" : "tab"}
              onClick={() => setActiveTab("wanted")}
            >
              보고싶은 영화
            </button>
          </div>

          {currentMovies.length === 0 ? (
            <p className="empty-text">
              {activeTab === "rated"
                ? "아직 평가한 영화가 없습니다."
                : "아직 보고싶은 영화가 없습니다."}
            </p>
          ) : (
            <div className="mypage-movie-grid">
              {currentMovies.map((movie) => (
                <article
                  key={movie.id}
                  className="mypage-movie-card"
                  onClick={() => handleMovieClick(movie.id)}
                >
                  {movie.poster_path ? (
                    <img
                      src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                      alt={movie.title}
                      className="mypage-movie-poster"
                    />
                  ) : (
                    <div className="empty-poster">No Image</div>
                  )}

                  <strong className="mypage-movie-title">{movie.title}</strong>

                  <p className="mypage-movie-rating">
                    {activeTab === "rated" && movie.user_rating
                      ? `${movie.user_rating * 2}점`
                      : movie.vote_average.toFixed(1)}
                    <span className="star">★</span>
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </>
  );
}

export default MyPage;

const PageTitle = styled.h1`
  margin: 0 0 14px;
  color: #ffffff;
  font-size: 24px;
`;
