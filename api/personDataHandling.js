import { addDoc, doc, collection, setDoc } from 'firebase/firestore';
import { fetchPersonDetails, fetchPersonMovies } from '../api/moviedb';
import { firestore } from '../config/firebase';

// Hàm để lưu thông tin chi tiết của người vào Firestore
const savePersonDetailsToFirestore = async (personDetails) => {
    try {
        const personDetailsRef = doc(firestore, "personDetails", String(personDetails.id));
        await setDoc(personDetailsRef, personDetails);
        console.log('Person details added to Firestore successfully');
    } catch (error) {
        console.error('Error adding person details to Firestore: ', error);
    }
}

// Hàm để lưu thông tin phim của người vào Firestore
const savePersonMoviesToFirestore = async (personId, moviesData) => {
    try {
        const personMoviesRef = doc(firestore, "personMovies", String(personId));
        await setDoc(personMoviesRef, moviesData);
        console.log('Person movies added to Firestore successfully');
    } catch (error) {
        console.error('Error adding person movies to Firestore: ', error);
    }
}

export const handlePersonData = async () => {
    try {
        // Thực hiện fetch thông tin của người
        const personDetails = await fetchPersonDetails(personId);
        // Lưu thông tin chi tiết của người vào Firestore
        await savePersonDetailsToFirestore(personDetails);

        // Thực hiện fetch thông tin các bộ phim của người
        const personMovies = await fetchPersonMovies(personId);
        // Lưu thông tin các bộ phim của người vào Firestore
        await savePersonMoviesToFirestore(personId, personMovies);

    } catch (error) {
        console.error('Error fetching and saving person data: ', error);
    }
}