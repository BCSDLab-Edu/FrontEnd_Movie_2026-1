import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import { fetchPopularMovies } from "../apis/popularMovieApi";
import { searchMovies } from "../apis/searchMovieApi";
import { fetchMovieDetail } from "../apis/movieDetailApi";
import Header from "../components/Header/Header";
import MovieList from "../components/MovieList/MovieList";
import MovieModal from "../components/MovieModal/MovieModal";
import type { Movie, MovieDetail } from "../types/movie";

import "../App.css";

function HomePage() {
  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<MovieDetail | null>(null);
  const observerTargetRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    isPending,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["movies", searchKeyword || "popular"],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      searchKeyword
        ? searchMovies(searchKeyword, pageParam)
        : fetchPopularMovies(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) {
        return undefined;
      }

      return allPages.length + 1;
    },
  });

  useEffect(() => {
    const observerTarget = observerTargetRef.current;

    if (!observerTarget || !hasNextPage || isFetchingNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (firstEntry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0,
      },
    );

    observer.observe(observerTarget);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);
  function handleSearchSubmit() {
    const trimmedKeyword = searchInput.trim();
    setSearchKeyword(trimmedKeyword);
  }

  async function handleMovieClick(movieId: number) {
    const movieDetail = await fetchMovieDetail(movieId);
    setSelectedMovie(movieDetail);
  }

  function handleCloseModal() {
    setSelectedMovie(null);
  }

  const movies =
    data?.pages
      .flat()
      .filter(
        (movie, index, array) =>
          array.findIndex((item) => item.id === movie.id) === index,
      ) ?? [];
  const movieListTitle = searchKeyword
    ? `"${searchKeyword}" 검색 결과`
    : "지금 인기있는 영화";

  if (isPending) {
    return <p>영화 목록을 불러오는 중입니다...</p>;
  }

  if (isError) {
    return <p>에러가 발생했습니다: {error.message}</p>;
  }

  return (
    <>
      <Header
        searchValue={searchInput}
        onSearchValueChange={setSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      <main className="main-content">
        <MovieList
          movies={movies}
          title={movieListTitle}
          onMovieClick={handleMovieClick}
        />

        <div ref={observerTargetRef} className="infinite-scroll-target" />
        {isFetchingNextPage && (
          <p className="loading-message">영화를 더 불러오는 중입니다...</p>
        )}
      </main>

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </>
  );
}

export default HomePage;
