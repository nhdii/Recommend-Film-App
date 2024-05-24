import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, Button } from "react-native";
import { Bars3CenterLeftIcon, MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { styles } from "../theme";
import TrendingMovie from "../components/trendingMovies"
import MovieList from "../components/movieList";
import { useNavigation } from "@react-navigation/native";
import Loading from "../components/loading";
import { fetchTopRatedMovies, fetchTrendingMovies, fetchUpcomingMovies, fetchPopularMovies, fetchCollaborativeFilteringRecommendations } from "../api/moviedb";
import { DrawerActions } from '@react-navigation/native';
import RecommendMovie from "../components/recommendMovie";
import useAuth from "../hooks/useAuth";
import { onSnapshot, doc, collection, getDocs, query, where  } from "firebase/firestore";
import { firestore } from "../config/firebase";
import { getRecommendedMovies } from '../api/contentBasedAPI';

export default function HomeScreen(){

    const [recommendedMovies, setRecommendedMovies] = useState([]);
    const [collaborativeMovies, setCollaborativeMovies] = useState([]);

    const [trending, setTrending] = useState([]);
    const [popular, setPopular] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [topRate, setTopRate] = useState([]);
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const { user } = useAuth(); 
    const [selectedRecommendationType, setSelectedRecommendationType] = useState('Content Based');

    useEffect(()=>{
        getTrendingMovies();
        getPopularMovies();
        getUpcomingMovies();
        getTopRatedMovies();
    },[])

    useEffect(() => {
        if (user && user.uid) {
            const userDocRef = doc(firestore, 'users', user.uid);
            const unsubscribe = onSnapshot(userDocRef, async (docSnap) => {
                if (docSnap.exists()) {
                    const favorites = docSnap.data().favorites || [];
                    const recommendedMovies = await getRecommendedMovies(favorites);
                    setRecommendedMovies(recommendedMovies);
                    fetchUserRatings(user.uid);
                    setLoading(false);
                } else {
                    setRecommendedMovies([]);
                    setLoading(false);
                }
            });

            const reviewsQuery = query(collection(firestore, 'reviews'), where('userId', '==', user.uid));
            const reviewsUnsubscribe = onSnapshot(reviewsQuery, async (querySnapshot) => {
                const ratings = querySnapshot.docs.map(doc => ({
                    movieId: doc.data().movieId,
                    rating: doc.data().rating
                }));
                if (ratings.length > 0) {
                    const collabMovies = await fetchCollaborativeFilteringRecommendations(user.uid, ratings);
                    setCollaborativeMovies(collabMovies.recommendations);  // Update here
                } else {
                    setCollaborativeMovies([]);
                }
            });

            return () => {
                unsubscribe();
                reviewsUnsubscribe();
            };
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchUserRatings = async (userId) => {
        const q = query(collection(firestore, 'reviews'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        const ratings = querySnapshot.docs.map(doc => ({
            movieId: doc.data().movieId,
            rating: doc.data().rating
        }));

        // Send the ratings to the collaborative filtering API
        if (ratings.length > 0) {
            const collabMovies = await fetchCollaborativeFilteringRecommendations(userId, ratings);
            setCollaborativeMovies(collabMovies.recommendations);  // Update here
        } else {
            setCollaborativeMovies([]);
        }

        setLoading(false);
    };

    // get data trending movies
    const getTrendingMovies = async () =>{
        const data = await fetchTrendingMovies();
        // console.log('got trending movies: ', JSON.stringify(data, null, 2));
        if( data && data.results) setTrending(data.results);
        setLoading(false);
    }

    // get data popular movies 
    const getPopularMovies = async () =>{
        const data = await fetchPopularMovies();
        // console.log('got popular movies: ', data.results);
        if( data && data.results) setPopular(data.results);
    }

    // get data upcoming movies 
    const getUpcomingMovies = async () =>{
        const data = await fetchUpcomingMovies();
        // console.log('got upcoming movies: ', data);
        if( data && data.results) setUpcoming(data.results);
    }

    // get data top rated movies
    const getTopRatedMovies = async () =>{
        const data = await fetchTopRatedMovies();
        // console.log('got top rated movies: ', data);
        
        if( data && data.results) setTopRate(data.results);
    }

    const handleRecommendationTypeChange = (type) => {
        setSelectedRecommendationType(type);
    };


    return (
        <View className="flex-1 bg-neutral-800">
            {/* Search bar and Logo */}
            <SafeAreaView className='mb-2 mt-10'>
                <StatusBar style="light"/>
                <View className="flex-row justify-between items-center mx-4">
                    <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
                        <Bars3CenterLeftIcon size="30" strokeWidth={2} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-3xl font-bold">
                        <Text style={styles.text}>M</Text>ovies
                    </Text>

                    <TouchableOpacity onPress={()=>navigation.navigate('Search')}>
                        <MagnifyingGlassIcon size="30" strokeWidth={2} color="white" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {
                loading ? (
                    <Loading />
                ): (
                    <ScrollView 
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{paddingBottom: 10}} 
                    >

                        {/* Recommendation Type Selection */}
                        <View className="flex-row justify-around mt-4 mb-2">
                            <Button
                                title="Content Based"
                                onPress={() => handleRecommendationTypeChange('Content Based')}
                                color={selectedRecommendationType === 'Content Based' ? '#1E90FF' : '#fff'}
                            />
                            <Button
                                title="Collaborative"
                                onPress={() => handleRecommendationTypeChange('Collaborative')}
                                color={selectedRecommendationType === 'Collaborative' ? '#1E90FF' : '#fff'}
                            />
                        </View>

                        {/* Render Recommended Movies Based on Selection */}
                        {selectedRecommendationType === 'Content Based' && recommendedMovies.length > 0 && (
                            <RecommendMovie data={recommendedMovies} title="Content Based" />
                        )}

                        {selectedRecommendationType === 'Collaborative' && collaborativeMovies.length > 0 && (
                            <RecommendMovie data={collaborativeMovies} title="Collaborative Filtering" />
                        )}

                        {/* {recommendedMovies.length>0 && <RecommendMovie data={recommendedMovies} title="Content Based" />}
                        
                        {collaborativeMovies.length > 0 && <RecommendMovie data={collaborativeMovies} title="Collaborative Filtering" />} */}

                        {/* Trending Movie */}
                        {trending.length>0 && <TrendingMovie data={trending} />}

                        {/* Upcoming movie */}
                        <MovieList title="Popular" data={popular} hideSeeAll={true} hideDelete={true}/>

                        {/* Upcoming movie */}
                        <MovieList title="Upcoming" data={upcoming} hideSeeAll={true} hideDelete={true}/>

                        {/* Top rate movie */}
                        <MovieList title="Top Rated" data={topRate} hideSeeAll={true} hideDelete={true}/>

                    </ScrollView>
                )
            }

            
        </View>
    )
}