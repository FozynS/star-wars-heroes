import axios from 'axios';

const CORS_PROXY = 'http://localhost:8080/';
const API_URL = 'https://sw-api.starnavi.io';
const BASE_URLS = {
  films: `${CORS_PROXY}https://sw-api.starnavi.io/films/`,
  starships: `${CORS_PROXY}https://sw-api.starnavi.io/starships/`,
};

export const fetchHeroes = async (page: number = 1) => {
  try {
    const response = await axios.get(`${API_URL}/people?page=${page}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching heroes:', error);
    throw error;
  }
};

export const fetchHeroDetails = async (heroId: string) => {
  try {
    const response = await axios.get(`${API_URL}/people/${heroId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching hero details:', error);
    throw error;
  }
};

export const fetchFilms = async (filmIds: string[]) => {
  const filmPromises = filmIds.map(id => axios.get(`${BASE_URLS.films}${id}/`));
  try {
    const films = await Promise.all(filmPromises);
    return films.map(film => film.data);
  } catch (error) {
    console.error('Error fetching films:', error);
    throw error; 
  }
};

export const fetchStarships = async (starshipIds: string[]) => {
  const starshipPromises = starshipIds.map(id => axios.get(`${BASE_URLS.starships}${id}/`));
  try {
    const starships = await Promise.all(starshipPromises);
    return starships.map(starship => starship.data);
  } catch (error) {
    console.error('Error fetching starships:', error);
    throw error;
  }
};
