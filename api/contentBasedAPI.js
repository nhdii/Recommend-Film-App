import axios from 'axios';
import { fetchMovieDetails } from './moviedb';

const apiRecommendUrl = "http://192.168.1.101:50100/api/receive-favorites";

const getRecommendedMovies = async (favorites) => {
    try {
        const movieNames = await Promise.all(favorites.map(async (movieId) => {
            try {
                const movieName = await getMovieNameById(movieId);
                return movieName;
            } catch (error) {
                console.error('Error fetching movie name:', error);
                return null;
            }
        }));

        const favoritesResponse = await axios.post(apiRecommendUrl, {
            favorites: movieNames.filter(movieName => movieName !== null),
        });

        const data = favoritesResponse.data;
        if (data && data.recommended_movies) {
            return data.recommended_movies;
        }
        return [];
    } catch (error) {
        console.error('Error fetching recommended movies:', error);
        return [];
    }
};

const getMovieNameById = async (movieId) => {
    try {
        const movieDetails = await fetchMovieDetails(movieId);
        
        if (movieDetails) {
            return movieDetails.title;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching movie details:', error);
        throw error;
    }
};

export {getRecommendedMovies};
