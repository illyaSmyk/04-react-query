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

import { useQuery, keepPreviousData } from "@tanstack/react-query";

function App() {
  const [query, setQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [page, setPage] = useState(1); // состояние текущей страницы

  const { data, isLoading, isError, isSuccess, } = useQuery({
    queryKey: ["movieskey", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: !!query,
    placeholderData: keepPreviousData, // убираю мерцания при пагинации
  });

  const movies = useMemo(() => data?.results ?? [], [data?.results]);
  const totalPages = data?.total_pages ?? 0;

  useEffect(() => {
    if (isSuccess && query && movies.length === 0) {
      toast("No movies for your request.");
    }
  }, [isSuccess, movies, query]);

  const handleSearchBar = (value: string) => {
    if (!value.trim()) {
      toast.error("Please enter your search query.");
      return;
    }
    setQuery(value);
    setPage(1);
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  const handlePageChange = (selectedItem: { selected: number }) => {
    setPage(selectedItem.selected + 1); // react-paginate считает страницы с 0
  };

  return (
    <div>
      <SearchBar onSubmit={handleSearchBar} />
      <Toaster position="top-center" />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {isSuccess && movies.length > 0 && (
        <>
          {totalPages > 1 && (
            <ReactPagination
              pageCount={totalPages}
              forcePage={page - 1} // текущая страница (индекс 0)
              onPageChange={handlePageChange}
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