import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../config/firebase';
import { useNavigation } from '@react-navigation/native';
import { StarIcon } from 'react-native-heroicons/solid';
import { theme } from '../theme';
import useAuth from '../hooks/useAuth';

export default function Reviews({ movieId }) {
    const [review, setReview] = useState(null);
    const navigation = useNavigation();
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchUserReview(movieId, user.uid);
        }
    }, [movieId, user]);

    const fetchUserReview = async (movieId, userId) => {
        const q = query(collection(firestore, 'reviews'), where('movieId', '==', movieId), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            setReview({ id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() });
        }
    };

    return (
        <View className="mx-4 my-4">
            <Text className="text-white text-lg font-bold">Your Review</Text>
            {review ? (
                <View key={review.id} className="my-2 p-2 bg-neutral-800 rounded-lg">
                    <Text className="text-neutral-400">{review.userName}:</Text>
                    <View className="flex-row">
                        {[...Array(5)].map((_, index) => (
                            <StarIcon
                                key={index}
                                size={24}
                                color={index < review.rating ? theme.background : 'gray'}
                            />
                        ))}
                    </View>
                    <Text className="text-neutral-400 mt-2">{review.comment}</Text>
                </View>
            ) : (
                <Text className="text-neutral-400">You haven't reviewed this movie yet.</Text>
            )}
            <TouchableOpacity
                onPress={() => navigation.navigate('Review', { movieId, review })}
                style={{
                    marginTop: 10,
                    padding: 10,
                    backgroundColor: theme.background,
                    borderRadius: 8,
                }}
            >
                <Text className="text-white text-center">Add Review</Text>
            </TouchableOpacity>
        </View>
    );
}
