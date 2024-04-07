import { getDoc, doc, collection, setDoc } from 'firebase/firestore';
import { fetchTrendingMovies, fetchPopularMovies } from '../api/moviedb';
import { firestore } from '../config/firebase';

// Hàm để kiểm tra xem một bộ phim đã tồn tại trong Firestore hay chưa
async function movieExists(movieId) {
    const movieRef = doc(firestore, 'movies', movieId);
    const snapshot = await getDoc(movieRef);
    return snapshot.exists();
}

// Hàm để lưu thông tin bộ phim vào Firestore (nếu chưa tồn tại)
async function saveMovieToFirestore(movieData) {
    try {
        // Kiểm tra xem bộ phim đã tồn tại trong Firestore chưa
        const exists = await movieExists(movieData.id);
        if (!exists) {
            // Nếu bộ phim chưa tồn tại, thêm mới vào Firestore
            const moviesCollection = collection(firestore, 'movies');
            await setDoc(doc(moviesCollection, movieData.id), movieData);
            console.log('Movie added to Firestore successfully');
        } else {
            console.log('Movie already exists in Firestore');
        }
    } catch (error) {
        console.error('Error adding movie to Firestore: ', error);
    }
}

// Hàm xử lý dữ liệu từ API và lưu vào Firestore
export const handleMovieData = async () => {
    try {
        // Gọi các hàm fetch để lấy thông tin về các bộ phim
        const trendingMovies = await fetchTrendingMovies();
        const popularMovies = await fetchPopularMovies();
        
        // Xử lý và lưu thông tin của mỗi bộ phim vào Firestore
        trendingMovies.results.forEach(async movie => {
            const movieData = {
                id: movie.id,
                title: movie.title,
                overview: movie.overview,
                release_date: movie.release_date,
                poster_path: movie.poster_path,
                genre_ids: movie.genre_ids,
                vote_average: movie.vote_average,
                //Thêm các thông tin khác nếu cần
            };
            await saveMovieToFirestore(movieData);
        });
        
        // Tương tự, xử lý và lưu thông tin của các bộ phim khác (popularMovies, vv.)
    } catch (error) {
        console.error('Error fetching and saving movie data: ', error);
    }
}
