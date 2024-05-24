import axios from 'axios';
import { fetchMovieDetails } from './moviedb';

const apiCollabFilterUrl = "http://192.168.1.101:50100/api/collab_filtering";

const getRecommendedMovies = async (favorites) => {
    try {
        const ratings = await Promise.all(favorites.map(async (movieId) => {
            try {
                const movieDetails = await fetchMovieDetails(movieId);
                return { movieId, rating: movieDetails.vote_average };
            } catch (error) {
                console.error('Error fetching movie details:', error);
                return null;
            }
        }));

        const filteredRatings = ratings.filter(rating => rating !== null);

        const response = await axios.post(apiCollabFilterUrl, {
            ratings: filteredRatings,
        });

        const data = response.data;
        if (data && data.recommended_movies) {
            return data.recommended_movies;
        }
        return [];
    } catch (error) {
        console.error('Error fetching recommended movies:', error);
        return [];
    }
};

export { getRecommendedMovies };
