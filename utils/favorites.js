import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../config/firebase';

// Function to add a movie to user's favorites list in Firestore
const addToFavorites = async (userId, movieId) => {
    try {
        const userDocRef = doc(firestore, 'users', userId);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
            const favorites = docSnap.data().favorites || [];
            if (!favorites.includes(movieId)) {
                favorites.push(movieId);
                await updateDoc(userDocRef, { favorites });
                console.log('Movie added to favorites successfully');
            } else {
                console.log('Movie is already in favorites');
            }
        } else {
            console.log('User document does not exist');
        }
    } catch (error) {
        console.error('Error adding movie to favorites:', error);
        throw error;
    }
};

// Function to remove a movie from user's favorites list in Firestore
const removeFromFavorites = async (userId, movieId) => {
    try {
        const userDocRef = doc(firestore, 'users', userId);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
            const favorites = docSnap.data().favorites || [];
            if (favorites.includes(movieId)) {
                const updatedFavorites = favorites.filter(id => id !== movieId);
                await updateDoc(userDocRef, { favorites: updatedFavorites });
                console.log('Movie removed from favorites successfully');
            } else {
                console.log('Movie is not in favorites');
            }
        } else {
            console.log('User document does not exist');
        }
    } catch (error) {
        console.error('Error removing movie from favorites:', error);
        throw error;
    }
};

const checkIsMovieFavorite = async (userId, movieId) => {
    try {
        const userDocRef = doc(firestore, 'users', userId);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
            const favorites = docSnap.data().favorites || [];
            return favorites.includes(movieId);
        } else {
            console.log('User document does not exist');
            return false;
        }
    } catch (error) {
        console.error('Error checking if movie is favorite:', error);
        throw error;
    }
};

export {addToFavorites, removeFromFavorites, checkIsMovieFavorite}