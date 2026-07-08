import type { Movie, MovieDetail } from "../types/movie";
import { getLoginCookie } from "./cookie";

const WANTED_MOVIES_KEY = "wantedMovies";
const RATED_MOVIES_KEY = "ratedMovies";

export type SavedMovie = {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  user_rating?: number;
  genres?: {
    id: number;
    name: string;
  }[];
};
type StorageMovie = Movie | MovieDetail;

function getUserStorageKey(baseKey: string) {
  const loginUser = getLoginCookie();

  if (!loginUser) {
    return baseKey;
  }

  return `${baseKey}_${loginUser}`;
}
function convertMovie(movie: StorageMovie, userRating?: number): SavedMovie {
  return {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    vote_average: movie.vote_average,
    user_rating: userRating,
    genres: "genres" in movie ? movie.genres : [],
  };
}

function getMovies(key: string): SavedMovie[] {
  const userKey = getUserStorageKey(key);
  const savedMovies = localStorage.getItem(userKey);

  if (!savedMovies) {
    return [];
  }

  return JSON.parse(savedMovies);
}

function saveMovies(key: string, movies: SavedMovie[]) {
  const userKey = getUserStorageKey(key);
  localStorage.setItem(userKey, JSON.stringify(movies));
}

export function getWantedMovies() {
  return getMovies(WANTED_MOVIES_KEY);
}

export function isWantedMovie(movieId: number) {
  return getWantedMovies().some((movie) => movie.id === movieId);
}

export function toggleWantedMovie(movie: StorageMovie) {
  const wantedMovies = getWantedMovies();
  const isAlreadyWanted = wantedMovies.some(
    (wantedMovie) => wantedMovie.id === movie.id,
  );

  if (isAlreadyWanted) {
    const filteredMovies = wantedMovies.filter(
      (wantedMovie) => wantedMovie.id !== movie.id,
    );

    saveMovies(WANTED_MOVIES_KEY, filteredMovies);
    return false;
  }

  saveMovies(WANTED_MOVIES_KEY, [...wantedMovies, convertMovie(movie)]);
  return true;
}

export function getRatedMovies() {
  return getMovies(RATED_MOVIES_KEY);
}

export function saveRatedMovie(movie: StorageMovie, userRating: number) {
  const ratedMovies = getRatedMovies();
  const filteredMovies = ratedMovies.filter(
    (ratedMovie) => ratedMovie.id !== movie.id,
  );

  saveMovies(RATED_MOVIES_KEY, [
    ...filteredMovies,
    convertMovie(movie, userRating),
  ]);
}

export function isRatedMovie(movieId: number) {
  return getRatedMovies().some((movie) => movie.id === movieId);
}

export function getMovieRating(movieId: number) {
  const ratedMovie = getRatedMovies().find((movie) => movie.id === movieId);

  return ratedMovie?.user_rating ?? 0;
}
export function removeRatedMovie(movieId: number) {
  const ratedMovies = getRatedMovies();
  const filteredMovies = ratedMovies.filter(
    (ratedMovie) => ratedMovie.id !== movieId,
  );

  saveMovies(RATED_MOVIES_KEY, filteredMovies);
}
