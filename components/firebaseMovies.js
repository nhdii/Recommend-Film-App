import firebase from 'firebase/app';
import 'firebase/firestore';
import { useEffect } from 'react';
import { fetchTrendingMovies } from '../api/moviedb'; // Import function to fetch movies from TMDB API

// Initialize Firebase
const firebaseConfig = {
  // Your Firebase config here
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Function to save movie data to Firestore
const saveMoviesToFirestore = async () => {
  try {
    // Fetch trending movies from TMDB API
    const trendingMovies = await fetchTrendingMovies();

    // Get a reference to the Firestore collection
    const moviesCollection = firebase.firestore().collection('movies');

    // Loop through the fetched movies and save them to Firestore
    trendingMovies.forEach(async (movie) => {
      // Add the movie to Firestore with a unique ID
      await moviesCollection.add(movie);
    });

    console.log('Movies saved to Firestore successfully.');
  } catch (error) {
    console.error('Error saving movies to Firestore:', error);
  }
};

// Function to fetch movies from Firestore
const fetchMoviesFromFirestore = async () => {
  try {
    // Get a reference to the Firestore collection
    const moviesCollection = firebase.firestore().collection('movies');

    // Fetch all movies from Firestore
    const snapshot = await moviesCollection.get();

    // Extract movie data from the snapshot
    const movies = snapshot.docs.map((doc) => doc.data());

    console.log('Movies fetched from Firestore:', movies);
  } catch (error) {
    console.error('Error fetching movies from Firestore:', error);
  }
};

// Component where you want to trigger saving and fetching movies
const MovieComponent = () => {
  useEffect(() => {
    // Save movies to Firestore when component mounts
    saveMoviesToFirestore();

    // Fetch movies from Firestore when component mounts
    fetchMoviesFromFirestore();
  }, []);

  return <div>This is where your movie component will render.</div>;
};

export default MovieComponent;
