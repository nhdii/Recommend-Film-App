import { addDoc, doc, collection, setDoc  } from 'firebase/firestore';
import { fetchTrendingMovies, fetchPopularMovies, fetchUpcomingMovies, fetchTopRatedMovies } from '../api/moviedb';
import { firestore } from '../config/firebase';

// Hàm để lưu thông tin bộ phim vào Firestore
const saveMovieToFirestore = async (movieData, source) => {
    try {
        const movieRef = doc(firestore, "movies", String(movieData.id));
        await setDoc(movieRef, { ...movieData, source });
        console.log('Movie added to Firestore successfully');
    } catch (error) {
        console.error('Error adding movie to Firestore: ', error);
    }
}

export const handleMovieData = async () => {
    try {
        const [trendingMovies, popularMovies, upcomingMovies, topRatedMovies] = await Promise.all([
            fetchTrendingMovies(),
            fetchPopularMovies(),
            fetchUpcomingMovies(),
            fetchTopRatedMovies()
        ]);

        const saveMovies = async (movies, source) => {
            for (const movie of movies.results) {
                const movieData = {
                    id: String(movie.id),
                    title: movie.title,
                    overview: movie.overview,
                    release_date: movie.release_date,
                    poster_path: movie.poster_path,
                    genre_ids: movie.genre_ids,
                    vote_average: movie.vote_average,
                };
                await saveMovieToFirestore(movieData, source);
            }
        };

        await saveMovies(trendingMovies, 'trending');
        await saveMovies(popularMovies, 'popular');
        await saveMovies(upcomingMovies, 'upcoming');
        await saveMovies(topRatedMovies, 'top_rated');

    } catch (error) {
        console.error('Error fetching and saving movie data: ', error);
    }
}