import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, getDocs, addDoc, updateDoc, doc, query, where } from 'firebase/firestore';
import { firestore } from '../config/firebase';
import useAuth from '../hooks/useAuth';
import { StarIcon } from 'react-native-heroicons/solid';
import { styles, theme } from '../theme';
import Alert from '../components/alert';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';

export default function ReviewScreen() {
    const { params: { movieId, review } } = useRoute();
    const { user } = useAuth();
    const navigation = useNavigation();
    const [rating, setRating] = useState(review ? review.rating : 0);
    const [comment, setComment] = useState(review ? review.comment : '');
    const [reviews, setReviews] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        fetchReviews(movieId);
    }, [movieId]);

    const fetchReviews = async (movieId) => {
        const q = query(collection(firestore, 'reviews'), where('movieId', '==', movieId));
        const querySnapshot = await getDocs(q);
        const reviews = [];
        querySnapshot.forEach((doc) => {
            reviews.push({ id: doc.id, ...doc.data() });
        });
        setReviews(reviews);
    };

    const handleAddOrUpdateReview = async () => {
        if (!user || !user.uid) {
            setAlertMessage("You need to log in to add a review.");
            setShowAlert(true);
            return;
        }

        const reviewData = {
            movieId,
            userId: user.uid,
            userName: user.displayName || 'Anonymous',
            rating,
            comment,
            createdAt: new Date(),
        };

        try {
            if (review) {
                // Update existing review
                await updateDoc(doc(firestore, 'reviews', review.id), reviewData);
                setAlertMessage("Review updated successfully");
            } else {
                // Add new review
                await addDoc(collection(firestore, 'reviews'), reviewData);
                setAlertMessage("Review added successfully");
            }

            setRating(0);
            setComment('');
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
                fetchReviews(movieId);
                navigation.goBack();
            }, 2000);
        } catch (error) {
            console.error("Error adding/updating review: ", error);
        }
    };

    const renderReview = ({ item }) => (
        <View key={item.id} className="my-2 p-2 bg-neutral-800 rounded-lg">
            <Text className="text-neutral-400">{item.userName}:</Text>
            <View className="flex-row">
                {[...Array(5)].map((_, index) => (
                    <StarIcon
                        key={index}
                        size={24}
                        color={index < item.rating ? theme.background : 'gray'}
                    />
                ))}
            </View>
            <Text className="text-neutral-400 mt-2">{item.comment}</Text>
        </View>
    );

    return (
        <View className="flex-1 bg-neutral-900 p-4">

            <SafeAreaView className="z-20 w-full flex-row justify-between items-center px-2 pt-6 mt-2">
                <TouchableOpacity onPress={()=> navigation.goBack()} style={styles.background} className="rounded-xl p-1">
                    <ChevronLeftIcon size="28" strokeWidth={2.5} color="white" className="rounded-xl p-1" />
                </TouchableOpacity>
                <View className="flex-1 items-center pr-8">
                    <Text className="text-white text-lg font-bold">
                        {review ? 'Update Your Review' : 'Add Your Review'}
                    </Text>         
                </View>
            </SafeAreaView>

            <View className="mt-8">
                <Text className="text-neutral-400 text-lg">Rating:</Text>

                <View className="flex-row my-2">
                    {[...Array(5)].map((_, index) => (
                        <TouchableOpacity key={index} onPress={() => setRating(index + 1)}>
                            <StarIcon
                                size={36}
                                color={index < rating ? theme.background : 'gray'}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
                
                <TextInput
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        padding: 10,
                        borderRadius: 8,
                        marginVertical: 10,
                    }}
                    placeholder="Write your comment..."
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    value={comment}
                    onChangeText={setComment}
                />

                <TouchableOpacity onPress={handleAddOrUpdateReview} style={{ marginTop: 12, padding: 10, backgroundColor: theme.background, borderRadius: 8 }}>
                    <Text className="text-white text-center text-lg font-bold">{review ? 'Update Review' : 'Submit Review'}</Text>
                </TouchableOpacity>

                <Text className="text-white text-lg font-bold mt-4">All Reviews</Text>
                
                <FlatList
                    data={reviews}
                    renderItem={renderReview}
                    keyExtractor={(item) => item.id}
                />

                <Alert
                    visible={showAlert}
                    message={alertMessage}
                    onClose={() => setShowAlert(false)}
                    autoCloseTimeout={4000}
                />
            </View>
        </View>
    );
}
