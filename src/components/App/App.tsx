import { useState, useMemo, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import ReactPagination from "../ReactPaginate/ReactPagination"; 

import { fetchMovies } from "../../services/movieService";
import { type Movie } from "../../types/movie";

import { useQuery } from "@tanstack/react-query";

function App() {
  const [query, setQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [page, setPage] = useState(1); // состояние текущей страницы

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movieskey", query, page], // добавил page в ключ
    queryFn: () => fetchMovies(query, page), // передаю страницу в fetchMovies
    enabled: !!query,
  });

  const movies = useMemo(() => data?.results ?? [], [data?.results]);
  const totalPages = data?.total_pages ?? 0; // количество страниц

  useEffect(() => {
    if (!isLoading && !isError && query && movies.length === 0) {
      toast("No movies for your request.");
    }
  }, [isLoading, isError, movies, query]);

  const handleSearchBar = (value: string) => {
    if (!value.trim()) {
      toast.error("Please enter your search query.");
      return;
    }
    setQuery(value);
    setPage(1); //  сброс страницы на 1 при новом поиске
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  const handlePageChange = (selectedPage: number) => {
    setPage(selectedPage); //  функция смены страницы
  };

  return (
    <div>
      <SearchBar onSubmit={handleSearchBar} />
      <Toaster position="top-center" />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {!isLoading && !isError && movies.length > 0 && (
        <>
             {/*  пагинация: отображается только если страниц > 1 */}
          {totalPages > 1 && (
            <ReactPagination
              totalPages={totalPages}
              page={page}
              setPage={handlePageChange}
            />
          )}
          <MovieGrid movies={movies} onSelect={handleSelectMovie} />
        </>
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default App;