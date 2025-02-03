import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Spinner from "./Spinner";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/movie/${id}?language=en-US&append_to_response=videos`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${API_KEY}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Movie not found");
        }
        const data = await response.json();
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovieDetails();
  }, [id]);

  if (isLoading)
    return (
      <div className="text-center mt-10 text-white">
        <Spinner />
      </div>
    );
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!movie) return null;

  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const trailer = movie.videos?.results.find(
    (video) => video.type === "Trailer" && video.site === "YouTube"
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1117] to-[#1A1B26] p-8">
      <div className="max-w-[1200px] mx-auto bg-[#161827] rounded-3xl p-8 shadow-xl">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Movies
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-white text-4xl font-bold mb-4">
                {movie.title}
              </h1>
              {/* Year and Duration */}
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <span>{new Date(movie.release_date).getFullYear()}</span>
                <span>•</span>
                <span>{movie.adult ? "18+" : "PG-13"}</span>
                <span>•</span>
                <span>{formatRuntime(movie.runtime)}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-[#252836] px-3 py-1.5 rounded-lg">
                <span className="text-yellow-400 mr-1.5">★</span>
                <span className="text-white">
                  {movie.vote_average?.toFixed(1)}
                </span>
                <span className="text-gray-400 text-sm ml-1">
                  /10 ({movie.vote_count})
                </span>
              </div>
              {/* <div className="bg-[#252836] px-3 py-1.5 rounded-lg text-white">
                1
              </div> */}
            </div>
          </div>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-12 gap-4 mb-8">
          <div className="col-span-3 h-[400px]">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-full object-cover rounded-2xl shadow-lg"
            />
          </div>
          <div className="col-span-9 h-[400px]">
            <div className="relative h-full rounded-2xl overflow-hidden">
              {showTrailer && trailer ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                  title="Movie Trailer"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <>
                  <img
                    src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                  {trailer && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={() => setShowTrailer(true)}
                        className="group relative cursor-pointer"
                      >
                        <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:bg-white/30 transition-colors"></div>
                        <div className="relative bg-white/20 p-4 rounded-full group-hover:bg-white/30 transition-colors backdrop-blur-sm">
                          <svg
                            className="w-8 h-8"
                            viewBox="0 0 24 24"
                            fill="white"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </button>
                      <div className="absolute bottom-4 left-4 flex items-center gap-2">
                        <span className="bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white">
                          Trailer • {trailer.size || "00:31"}
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Visit Homepage */}
        {movie.homepage && (
          <div className="flex justify-end mb-8">
            <a
              href={movie.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#879bf0] hover:bg-[#2D3348] px-4 py-2 rounded-lg text-white transition-colors"
            >
              Visit Homepage
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        )}

        {/* Movie Metadata */}
        <div className="space-y-3">
          {/* Genres */}
          <div className="flex">
            <span className="text-gray-400 w-36">Genres</span>
            <div className="flex flex-wrap gap-2">
              {movie.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="bg-[#252836] px-4 py-1 rounded text-sm text-white"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>

          {/* Overview */}
          <div className="flex">
            <span className="text-gray-400 w-36">Overview</span>
            <p className="text-white leading-relaxed flex-1">
              {movie.overview}
            </p>
          </div>

          {/* Release date */}
          <div className="flex">
            <span className="text-gray-400 w-36">Release date</span>
            <span className="text-white">
              {new Date(movie.release_date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}{" "}
              (Worldwide)
            </span>
          </div>

          {/* Countries */}
          <div className="flex">
            <span className="text-gray-400 w-36">Countries</span>
            <span className="text-white">
              {movie.production_countries
                ?.map((country) => country.name)
                .join(" · ")}
            </span>
          </div>

          {/* Status */}
          <div className="flex">
            <span className="text-gray-400 w-36">Status</span>
            <span className="text-white">{movie.status}</span>
          </div>

          {/* Language */}
          <div className="flex">
            <span className="text-gray-400 w-36">Language</span>
            <span className="text-white">
              {movie.spoken_languages
                ?.map((lang) => lang.english_name)
                .join(" · ")}
            </span>
          </div>

          {/* Budget */}
          <div className="flex">
            <span className="text-gray-400 w-36">Budget</span>
            <span className="text-white">
              ${(movie.budget / 1000000).toFixed(1)} million
            </span>
          </div>

          {/* Revenue */}
          <div className="flex">
            <span className="text-gray-400 w-36">Revenue</span>
            <span className="text-white">
              ${(movie.revenue / 1000000).toFixed(1)} Million
            </span>
          </div>

          {/* Tagline */}
          <div className="flex">
            <span className="text-gray-400 w-36">Tagline</span>
            <span className="text-white">{movie.tagline || "N/A"}</span>
          </div>

          {/* Production */}
          <div className="flex">
            <span className="text-gray-400 w-36">Production Companies</span>
            <span className="text-white">
              {movie.production_companies
                ?.map((company) => company.name)
                .join(" · ")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
