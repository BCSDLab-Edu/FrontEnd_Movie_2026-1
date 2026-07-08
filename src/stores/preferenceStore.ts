import { create } from "zustand";
import { getWantedMovies } from "../utils/storage";

type PreferenceState = {
  favoriteGenres: string[];
  updateFavoriteGenres: () => void;
};

export const usePreferenceStore = create<PreferenceState>((set) => ({
  favoriteGenres: [],

  updateFavoriteGenres: () => {
    const wantedMovies = getWantedMovies();

    const genreCount = wantedMovies.reduce<Record<string, number>>(
      (acc, movie) => {
        movie.genres?.forEach((genre) => {
          acc[genre.name] = (acc[genre.name] || 0) + 1;
        });

        return acc;
      },
      {},
    );

    const favoriteGenres = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([genreName]) => genreName);

    set({ favoriteGenres });
  },
}));
