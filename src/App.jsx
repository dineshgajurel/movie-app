import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { getTrendingMovies, updateSearchCount } from "./appwrite";
import { Pagination } from "./components/Pagination";

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [trendingMovies, setTrendingMovies] = useState([]);
  const [errorMessageTrending, setErrorMessageTrending] = useState("");
  const [isLoadingTrending, setIsLoadingTrending] = useState(false);


  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useDebounce(
    () => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1);
    },
    500,
    [searchTerm]
  );

  const fetchMovies = async (query = "",page=1) => {
    setIsLoading(true);
    setErrorMessage("");

    console.log(query,page);
    
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${query}&page=${page}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}`;
      const response = await fetch(endpoint, API_OPTIONS);
      console.log(response);

      if (!response.ok) {
        throw new Error("error while fetching movies");
      }
      const data = await response.json();
      if (data.response === false) {
        setErrorMessage(data.Error || "Error fetching movies");
        setMovieList([]);
        return;
      }
      setMovieList(data.results || []);
      setTotalPages(data.total_pages);
      setPage(data.page);

      if (query && data.results.length > 0) {
        console.log(data.results[0]);
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Error fetching movies");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTrendingMovies = async () => {
    setIsLoadingTrending(true);
    setErrorMessageTrending("");
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error(error);
      setErrorMessageTrending("Error fetching trending movies");
    } finally {
      setIsLoadingTrending(false);
    }
  };


  useEffect(() => {
    fetchMovies(debouncedSearchTerm,page);
  }, [debouncedSearchTerm, page]);

  useEffect(() => {
    fetchTrendingMovies();
  }, []);


  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./logo.png" alt="logo" className="w-[5%]" />

          <img src="./hero.png" alt="Hero Banner" />

          <h1>
            Find <span className="text-gradient">Movies</span> You&apos;ll Enjoy
            Without the Hassle
          </h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>

            {isLoadingTrending ? (
              <Spinner />
            ) : errorMessageTrending ? (
              <p className="text-red-500">{errorMessageTrending}</p>
            ) : (
              <ul>
                {trendingMovies.map((movie, index) => (
                  <li key={movie.$id}>
                    <p>{index + 1}</p>
                    <div className="flex flex-col">
                      <img src={movie.poster_url} alt={movie.movie_title}/>
                      <h3 className="text-white font-bold text-base line-clamp-1 mt-4">{movie.movie_title}</h3>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        <section className="all-movies">
          <h2>All Movies</h2>
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>

      
      <section className="pagination">
        <Pagination page={page} totalPages={totalPages}  onPageChange={setPage} />
      </section>
  
      </div>
    </main>
  );
};

export default App;
