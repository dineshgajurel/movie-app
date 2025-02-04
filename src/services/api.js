import {
  getTrendingMovies as getTrendingMoviesFromAppwrite,
  updateSearchCount as updateSearchCountFromAppwrite,
} from "./appwrite";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const USE_BACKEND = import.meta.env.VITE_USE_BACKEND === "true";

const tmdbOptions = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${TMDB_API_KEY}`,
  },
};

export const movieService = {
  async searchMovies(query = "", page = 1) {
    if (USE_BACKEND) {
      const response = await fetch(
        `${API_BASE_URL}/movies/search?query=${encodeURIComponent(
          query
        )}&page=${page}`
      );
      return response.json();
    } else {
      const response = await fetch(
        `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(
          query
        )}&page=${page}`,
        tmdbOptions
      );
      return response.json();
    }
  },

  async getMovieDetails(id) {
    if (USE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/movies/${id}`);
      return response.json();
    } else {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/${id}?language=en-US&append_to_response=videos`,
        tmdbOptions
      );
      return response.json();
    }
  },

  async getAllMovies(page = 1, sort_by = "popularity.desc") {
    if (USE_BACKEND) {
      const response = await fetch(
        `${API_BASE_URL}/movies?page=${page}&sort_by=${sort_by}`
      );
      return response.json();
    } else {
      const response = await fetch(
        `${TMDB_BASE_URL}/discover/movie?sort_by=${sort_by}&page=${page}`,
        tmdbOptions
      );
      return response.json();
    }
  },

  async updateSearchCount(searchTerm, movie) {
    if (USE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/search/update-count`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchTerm, movie }),
      });
      return response.json();
    } else {
      return updateSearchCountFromAppwrite(searchTerm, movie);
    }
  },

  async getTrendingMovies() {
    if (USE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/search/trending`);
      return response.json();
    } else {
      return getTrendingMoviesFromAppwrite();
    }
  },
};
