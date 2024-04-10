import { addDoc, doc, collection, setDoc  } from 'firebase/firestore';
import { fetchTrendingMovies, fetchPopularMovies, fetchUpcomingMovies, fetchTopRatedMovies, fetchMovieDetails, fetchMovieCredits, fetchMovieSimilar } from '../api/moviedb';
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

// Hàm để lưu thông tin movie details của bộ phim vào Firestore
const saveMovieDetailsToFirestore = async (movieDetails) => {
    try {
        const movieDetailsRef = doc(firestore, "movieDetails", String(movieDetails.id));
        await setDoc(movieDetailsRef, movieDetails);
        console.log('Movie details added to Firestore successfully');
    } catch (error) {
        console.error('Error adding movie details to Firestore: ', error);
    }
}

// Hàm để lưu thông tin credits của bộ phim vào Firestore
const saveMovieCreditsToFirestore = async (movieId, creditsData) => {
    try {
        const movieCreditsRef = doc(firestore, "movieCredits", String(movieId));
        await setDoc(movieCreditsRef, creditsData);
        console.log('Movie credits added to Firestore successfully');
    } catch (error) {
        console.error('Error adding movie credits to Firestore: ', error);
    }
}

// Hàm để lưu thông tin các bộ phim tương tự vào Firestore
const saveSimilarMoviesToFirestore = async (movieId, similarMoviesData) => {
    try {
        const similarMoviesRef = doc(firestore, "similarMovies", String(movieId));
        await setDoc(similarMoviesRef, similarMoviesData);
        console.log('Similar movies added to Firestore successfully');
    } catch (error) {
        console.error('Error adding similar movies to Firestore: ', error);
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

                // Lấy thông tin chi tiết của bộ phim và lưu vào Firestore
                const detailedMovieData = await fetchMovieDetails(movie.id);
                await saveMovieDetailsToFirestore(detailedMovieData);

                // Lấy thông tin credits của bộ phim và lưu vào Firestore
                const creditsData = await fetchMovieCredits(movie.id);
                await saveMovieCreditsToFirestore(movie.id, creditsData);

                // Lấy thông tin các bộ phim tương tự và lưu vào Firestore
                const similarMoviesData = await fetchMovieSimilar(movie.id);
                await saveSimilarMoviesToFirestore(movie.id, similarMoviesData);
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