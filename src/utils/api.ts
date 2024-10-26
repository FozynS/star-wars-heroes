import axios from 'axios';

const CORS_PROXY = 'http://localhost:8080/';
const API_URL = 'https://sw-api.starnavi.io';
const BASE_URLS = {
  films: `${CORS_PROXY}https://sw-api.starnavi.io/films/`,
  starships: `${CORS_PROXY}https://sw-api.starnavi.io/starships/`,
};

export const fetchHeroes = async (page: number = 1) => {
  const response = await axios.get(`${CORS_PROXY}${API_URL}/people?page=${page}`);
  return response.data;
};

export const fetchHeroDetails = async (heroId: string) => {
  const response = await axios.get(`${CORS_PROXY}${API_URL}/people/${heroId}`);
  return response.data;
};

export const fetchFilms = async (filmIds: string[]) => {
  const filmUrls = filmIds.map(id => `${BASE_URLS.films}${id}/`);
  const filmPromises = filmUrls.map(url => axios.get(url));
  const films = await Promise.all(filmPromises);
  return films.map(film => film.data);
};

export const fetchStarships = async (starshipIds: string[]) => {
  const starshipUrls = starshipIds.map(id => `${BASE_URLS.starships}${id}/`);
  const starshipPromises = starshipUrls.map(url => axios.get(url));
  const starships = await Promise.all(starshipPromises);
  return starships.map(starship => starship.data);
};
