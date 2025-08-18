import axios from "axios";
import { type Movie } from "../types/movie";


const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_API_KEY; // ключ из .env


interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export const fetchMovies = async (
  query: string,
  page: number = 1 // по умолчанию страница 1
): Promise<MoviesResponse> => {
  console.log("Search query:", query);
  console.log("Page:", page);
  console.log("API Key:", API_KEY);

  const response = await axios.get<MoviesResponse>(
    `${API_BASE_URL}/search/movie`,
    {
      params: {
        api_key: API_KEY,
        query,
        page, // добавляю страницу
      },
    }
  );

  return response.data;
};