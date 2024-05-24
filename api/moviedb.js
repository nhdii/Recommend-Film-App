import axios from 'axios';
import {apiKey} from '../constants';

//endpoint
const apiBaseUrl = 'https://api.themoviedb.org/3';

const trendingMoviesEndpoint = `${apiBaseUrl}/trending/movie/day?api_key=${apiKey}`;
const popularMoviesEndpoint = `${apiBaseUrl}/movie/popular?api_key=${apiKey}`;
const upcomingMoviesEndpoint = `${apiBaseUrl}/movie/upcoming?api_key=${apiKey}`;
const topRatedMoviesEndpoint = `${apiBaseUrl}/movie/top_rated?api_key=${apiKey}`;

//search endpoint
const searchMoviesEndpoint =`${apiBaseUrl}/search/movie?api_key=${apiKey}`;

//recommend api endpoint
const recommendationEndpoint = 'http://192.168.111.210:50100/api/collaborative';

// dynamic endpoint
const movieDetailsEndpoint = id => `${apiBaseUrl}/movie/${id}?api_key=${apiKey}`;
const movieCreditsEndpoint = id => `${apiBaseUrl}/movie/${id}/credits?api_key=${apiKey}`;
const similarMovieEndpoint = id => `${apiBaseUrl}/movie/${id}/similar?api_key=${apiKey}`;

const personDetailsEndpoint = id=> `${apiBaseUrl}/person/${id}?api_key=${apiKey}`;
const personMoviesEndpoint = id=> `${apiBaseUrl}/person/${id}/movie_credits?api_key=${apiKey}`;

const movieVideosEndpoint = id => `${apiBaseUrl}/movie/${id}/videos?api_key=${apiKey}`;

export const image500 = path => path? `https://image.tmdb.org/t/p/w500${path}` : null;
export const image342 = path => path? `https://image.tmdb.org/t/p/w342${path}` : null;
export const image185= path => path? `https://image.tmdb.org/t/p/w185${path}` : null;

export const fallBackPersonPoster = 'https://th.bing.com/th/id/OIP.MKJT1tGZDqcVT_KbFg3jNgHaHa?rs=1&pid=ImgDetMain';

const apiCall = async (endpoint, params)=>{
    const options = {
        method: 'GET',
        url: endpoint,
        params: params? params:{}
    }

    try {
        const response = await axios.request(options);
        return response.data;
    }catch(error){
        console.log('error', error);
        return {}
    }
}

export const fetchCollaborativeFilteringRecommendations = async (userId, ratings) => {
    try {
        console.log("Sending ratings to API:", { userId, ratings });  // Debug log
        const response = await axios.post('http://192.168.1.109:50200/api/collab_filtering', { userId, ratings });
        console.log("Get response Collab: ", response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching collaborative filtering recommendations:', error);
        return [];
    }
};


export const fetchTrendingMovies = ()=>{
    return apiCall(trendingMoviesEndpoint);
}

export const fetchPopularMovies = ()=>{
    return apiCall(popularMoviesEndpoint);
}

export const fetchUpcomingMovies = ()=>{
    return apiCall(upcomingMoviesEndpoint);
}

export const fetchTopRatedMovies = ()=>{
    return apiCall(topRatedMoviesEndpoint);
}

export const fetchMovieDetails = id=>{
    return apiCall(movieDetailsEndpoint(id));
}

export const fetchMovieCredits = id=>{
    return apiCall(movieCreditsEndpoint(id));
}

export const fetchMovieSimilar = id=>{
    return apiCall(similarMovieEndpoint(id));
}

export const fetchPersonDetails = id=>{
    return apiCall(personDetailsEndpoint(id));
}

export const fetchPersonMovies = id=>{
    return apiCall(personMoviesEndpoint(id));
}

export const fetchMovieVideos = id => {
    return apiCall(movieVideosEndpoint(id));
}

export const searchMovies = params=>{
    return apiCall(searchMoviesEndpoint, params);
}