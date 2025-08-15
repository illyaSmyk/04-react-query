import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { fetchMovies } from "../../services/movieService";
import { type Movie } from "../../types/movie";


function App() {
  const [movies, setMovies] = useState<Movie[]>([]);   //список фильмов
  const [loading, setLoading] = useState(false);       // лоадер - продвинутый не использовал
  const [error, setError] = useState<string | null>(null); // при ощибке запроса
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null); // фильм для модалки
  

  // Функция обработки поиска
  const handleSearchBar = async (query: string) => {
    if (!query.trim()) {
      setMovies([]);   // очищаю фильмы
      toast.error("Please enter your search query."); //  если пустой запрос
      return; // прерываю выполнение
    }
   
    setLoading(true); // показываем лоадер
    setError(null);   // очищаю ошибки

    try {
      const data = await fetchMovies(query);   // ждем результат поиска
      if (data.results.length === 0) {
        toast.error("No movies found for your query"); // ничего нет - сообщение
      }
      setMovies(data.results);  // записываю найденные фильмы в состояние
    } catch {
      setError("There was an error, please try again...");    // обновляю ошибку в сосотояние
      toast.error("There was an error, please try again...");  // сообщение с оштбклй
      setMovies([]);                                           // очищаю фильмы
    } finally {
      setLoading(false);                                       // убираю лоадер - посик end
    }
  };
     
// Функция работы с модалкой

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);       // выбран фильм - показываю модалку
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);         // закрываю модалку
  };

  return (
    <div>
      <SearchBar onSubmit={handleSearchBar} />
      <Toaster position="top-center" /> 

      {loading && <Loader />}          
      {error && <ErrorMessage />}
      
      {!loading && !error && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelectMovie} />
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default App;