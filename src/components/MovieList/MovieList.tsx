import type { Movie } from "../../types/movie";
import MovieCard from "../MovieCard/MovieCard";

interface MovieListProps {
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
  loadMoreRef: (node?: Element | null) => void;
  isFetchingNextPage: boolean;
}

function MovieList({
  movies,
  onMovieClick,
  loadMoreRef,
  isFetchingNextPage,
}: MovieListProps) {
  return (
    <section className="flex flex-col gap-[48px] w-[920px] max-w-full">
      <h2 className="m-0 text-[34px] font-semibold leading-[36px] text-[rgba(255,_255,_255,_0.87)]">
        지금 인기있는 영화
      </h2>
      <div
        className="grid grid-cols-[repeat(4,_182px)] gap-[64px]"
        data-movie-count={movies.length}
      >
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
        ))}
      </div>
      <div ref={loadMoreRef} className="h-[40px] text-center text-[#ffffff]">
        {isFetchingNextPage ? "불러오는 중..." : ""}
      </div>
    </section>
  );
}

export default MovieList;
