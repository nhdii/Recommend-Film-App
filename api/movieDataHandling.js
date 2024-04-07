import { addDoc, doc, collection  } from 'firebase/firestore';
import { fetchTrendingMovies, fetchPopularMovies } from '../api/moviedb';
import { firestore } from '../config/firebase';

// Hàm để lưu thông tin bộ phim vào Firestore
const saveMovieToFirestore = async (movieData) => {
    try {
        const moviesCollection = collection(firestore, 'movies'); // Tham chiếu đến collection 'movies'
        await addDoc(moviesCollection, movieData); // Thêm một tài liệu mới vào collection 'movies'
        console.log('Movie added to Firestore successfully');
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
        trendingMovies.results.forEach(async movie => { // Sử dụng forEach với async function để chờ lệnh saveMovieToFirestore hoàn thành
            
            console.log("got movie id: ", movie.id);
            const movieData = { // Xử lý dữ liệu từ API để trích xuất thông tin cần thiết về mỗi bộ phim
                id: movie.id, // Cần phải có một trường để định danh tài liệu, ví dụ: id
                title: movie.title,
                // runtime: movie.runtime,
                overview: movie.overview,
                release_date: movie.release_date,
                poster_path: movie.poster_path,
                genre_ids: movie.genre_ids,
                vote_average: movie.vote_average,
                //Thêm các thông tin khác nếu cần
            };
            await saveMovieToFirestore(movieData); // Sử dụng await để đợi hàm saveMovieToFirestore hoàn thành trước khi đi tiếp
        });
        
        // Tương tự, xử lý và lưu thông tin của các bộ phim khác (popularMovies, vv.)
    } catch (error) {
        console.error('Error fetching and saving movie data: ', error);
    }
}
