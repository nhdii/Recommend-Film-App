import React, { useState, useEffect } from 'react';
import { ScrollView, View, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import MovieList from '../components/movieList';
import Loading from '../components/loading';
import { fetchMovieDetails, image500 } from '../api/moviedb';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { styles } from '../theme';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { firestore } from '../config/firebase';
import useAuth from '../hooks/useAuth';
import Alert from '../components/alert';

export default function FavoritesScreen() {
    const navigation = useNavigation();
    const { user } = useAuth(); 
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAlert, setShowAlert] = useState(false); // State để điều khiển việc hiển thị Alert
    const [alertMessage, setAlertMessage] = useState(''); // State để lưu thông điệp của Alert

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                if (user && user.uid) {
                    const userId = user.uid;
                    const userDocRef = doc(firestore, 'users', userId);
                    const docSnap = await getDoc(userDocRef);
                    if (docSnap.exists()) {
                        const favoritesIds = docSnap.data().favorites || [];
                        const favoriteMovies = [];
                        for (const movieId of favoritesIds) {
                            const movieDetails = await fetchMovieDetails(movieId);
                            favoriteMovies.push(movieDetails);
                        }
                        setFavorites(favoriteMovies);
                        setLoading(false);
                    }
                }
            } catch (error) {
                console.error('Error fetching favorites:', error);
                setLoading(false);
            }
        };
    
        if (user && user.uid) {
            fetchFavorites();
    
            const unsubscribe = onSnapshot(doc(firestore, 'users', user.uid), (snapshot) => {
                const favoritesIds = snapshot.data().favorites || [];
                const favoriteMoviesPromises = favoritesIds.map(async (movieId) => {
                    const movieDetails = await fetchMovieDetails(movieId);
                    return movieDetails;
                });
                Promise.all(favoriteMoviesPromises).then((favoriteMovies) => {
                    setFavorites(favoriteMovies);
                });
            });
    
            return () => unsubscribe();
        } else {
            setLoading(false);
        }
    }, [user]); // Add user as a dependency to useEffect
    

    return (
        <View className="flex-1 bg-neutral-800 p-2">
            {/* back button */}
            <SafeAreaView className="z-20 w-full flex-row justify-between items-center px-4 pt-8 mt-3">
                <TouchableOpacity onPress={()=> navigation.goBack()} style={styles.background} className="rounded-xl p-1">
                    <ChevronLeftIcon size="28" strokeWidth={2.5} color="white" className="rounded-xl p-1" />
                </TouchableOpacity>
                <View className="flex-1 items-center pr-8">
                    <Text className="text-white text-lg font-bold">
                        Favorites
                    </Text>         
                </View>
            </SafeAreaView>

            {loading ? (
                <Loading />
            ) : (
                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{paddingBottom: 10}} 
                    className="-mt-6"
                >
                    <MovieList
                        // title="Favorites"
                        data={favorites}
                        navigation={navigation}
                        hideSeeAll={true}
                        hideDelete={false}
                        setShowAlert={setShowAlert} // Truyền hàm setShowAlert xuống MovieList
                        setAlertMessage={setAlertMessage} // Truyền hàm setAlertMessage xuống MovieList
                    />
                </ScrollView>
            )}

            <Alert
                visible={showAlert}
                message={alertMessage}
                onClose={() => setShowAlert(false)}
                autoCloseTimeout={3000} // Đóng tự động sau 3 giây
            />
        </View>
    );
}
