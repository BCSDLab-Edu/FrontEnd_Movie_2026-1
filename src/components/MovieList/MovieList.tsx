import MovieCard from "../MovieCard/MovieCard";
import type { Movie } from "../../types/movie";

import "./MovieList.css";

interface MovieListProps {
  movies: Movie[];
  onMovieClick?: (movieId: number) => void;
  title?: string;
}

function MovieList({
  movies,
  onMovieClick,
  title = "지금 인기있는 영화",
}: MovieListProps) {
  return (
    <section className="movie-list">
      <h2 className="movie-list-title">{title}</h2>

      <div className="movies">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onClick={() => onMovieClick?.(movie.id)}
          />
        ))}
      </div>
    </section>
  );
}

export default MovieList;
