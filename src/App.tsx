import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import MovieList from "./components/MovieList/MovieList";
import DetailModal from "./components/MovieDetail/MovieDetail";
import Toast from "./components/Toast/Toast";
import Mypage from "./pages/mypage";
import type { Movie } from "./types/movie";
import { fetchPopularMovies } from "./apis/movieApi";
import { searchMovies } from "./apis/searchMovieApi";
import "./App.css";

function App() {
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [isDetailOpen, setDetailOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      //무한 스크롤을 위한 useInfiniteQuery
      queryKey: ["movies", submittedSearch],
      queryFn: ({ pageParam }) => {
        //api 호출하는 함수
        if (submittedSearch.trim()) {
          return searchMovies(submittedSearch, pageParam);
        }

        return fetchPopularMovies(pageParam); //검색어 없으면 인기 영화 가져오기
      },
      initialPageParam: 1, //초기값
      getNextPageParam: (lastPage) => {
        //다음 페이지 가져오는 함수
        if (lastPage.page < lastPage.total_pages) {
          return lastPage.page + 1;
        }

        return undefined;
      },
    });

  const movies = data?.pages.flatMap((page) => page.results) ?? []; //자동으로 다음 페이지 부르는 부분

  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target) {
      return;
    }

    const observer = new IntersectionObserver( //IntersectionObserver를 이용해서 스크롤 감지
      (entries) => {
        const [entry] = entries;

        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          //중복 요청 방지를 위해 확인
          fetchNextPage();
        }
      },
      {
        rootMargin: "200px",
      },
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  function handleSearch(query: string) {
    setSearch(query);
  }

  function handleSubmit() {
    setSubmittedSearch(search);
  }

  function handleMovieClick(movie: Movie) {
    setSelectedMovie(movie);
    setDetailOpen(true);
  }

  const modal =
    isDetailOpen && selectedMovie ? (
      <DetailModal movie={selectedMovie} onClose={() => setDetailOpen(false)} />
    ) : null;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header handleSearch={handleSearch} handleSubmit={handleSubmit} />
              <main className="main-content">
                <MovieList
                  movies={movies}
                  onMovieClick={handleMovieClick}
                  loadMoreRef={loadMoreRef}
                  isFetchingNextPage={isFetchingNextPage}
                />
              </main>
              {modal}
            </>
          }
        />
        <Route
          path="/mypage"
          element={
            <Mypage handleSearch={handleSearch} handleSubmit={handleSubmit} />
          }
        />
      </Routes>
      <Toast />
    </BrowserRouter>
  );
}

export default App;
