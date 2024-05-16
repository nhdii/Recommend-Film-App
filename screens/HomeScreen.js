import axios from 'axios';
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from "react-native";
import { Bars3CenterLeftIcon, MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { styles } from "../theme";
import TrendingMovie from "../components/trendingMovies"
import MovieList from "../components/movieList";
import { useNavigation } from "@react-navigation/native";
import Loading from "../components/loading";
import { fetchTopRatedMovies, fetchTrendingMovies, fetchUpcomingMovies, fetchPopularMovies, fetchMovieDetails } from "../api/moviedb";
import { DrawerActions } from '@react-navigation/native';
import RecommendMovie from "../components/recommendMovie";
import useAuth from "../hooks/useAuth";
import { onSnapshot, doc } from "firebase/firestore";
import { firestore } from "../config/firebase";
import { getRecommendedMovies } from '../api/contentBasedAPI';

export default function HomeScreen(){

    const apiRecommendUrl = "http://192.168.1.101:50100/api/receive-favorites";

    const [recommendedMovies, setRecommendedMovies] = useState([]);
    const [trending, setTrending] = useState([]);
    const [popular, setPopular] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [topRate, setTopRate] = useState([]);
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const { user } = useAuth(); 

    useEffect(()=>{
        getTrendingMovies();
        getPopularMovies();
        getUpcomingMovies();
        getTopRatedMovies();
    },[])

    // useEffect(() => {
    //     if (user && user.favorites) {
    //         getRecommendedMovies();
    //     }
    // }, [user]);
    
    // get data recommend movies
    // const getRecommendedMovies = async () => {
    //     try {
    //         const movieNames = await Promise.all(user.favorites.map(async (movieId) => {
    //             try {
    //                 const movieName = await getMovieNameById(movieId);
    //                 return movieName;
    //             } catch (error) {
    //                 console.error('Error fetching movie name:', error);
    //                 return null;
    //             }
    //         }));
    //         // Gửi yêu cầu lấy danh sách movie favorites từ API
    //         const favoritesResponse = await axios.post(apiRecommendUrl, {
    //             favorites: movieNames.filter(movieName => movieName !== null), 
    //         });

    //         // Nhận dữ liệu recommended movies từ API
    //         const data = favoritesResponse.data;
    //         console.log("got movie recommend from API: ", movieNames.filter(movieName => movieName !== null),);
    //         // Kiểm tra nếu có dữ liệu recommended movies được trả về
    //         if (data && data.recommended_movies) {
    //             console.log("got movie recommend from API: ", data.recommended_movies);
    //             setRecommendedMovies(data.recommended_movies);
    //         }
    //         setLoading(false);
    //     } catch (error) {
    //         console.error('Error fetching recommended movies:', error);
    //         setLoading(false);
    //     }
    // };

    // const getRecommendedMovies = async (favorites) => {
    //     try {
    //         const movieNames = await Promise.all(favorites.map(async (movieId) => {
    //             try {
    //                 const movieName = await getMovieNameById(movieId);
    //                 return movieName;
    //             } catch (error) {
    //                 console.error('Error fetching movie name:', error);
    //                 return null;
    //             }
    //         }));
    
    //         const favoritesResponse = await axios.post(apiRecommendUrl, {
    //             favorites: movieNames.filter(movieName => movieName !== null),
    //         });
    
    //         const data = favoritesResponse.data;
    //         if (data && data.recommended_movies) {
    //             return data.recommended_movies;
    //         }
    //         return [];
    //     } catch (error) {
    //         console.error('Error fetching recommended movies:', error);
    //         return [];
    //     }
    // };

    useEffect(() => {
        if (user && user.uid) {
            const userDocRef = doc(firestore, 'users', user.uid);
            const unsubscribe = onSnapshot(userDocRef, async (docSnap) => {
                if (docSnap.exists()) {
                    const favorites = docSnap.data().favorites || [];
                    const recommendedMovies = await getRecommendedMovies(favorites);
                    setRecommendedMovies(recommendedMovies);
                    setLoading(false);
                } else {
                    setRecommendedMovies([]);
                    setLoading(false);
                }
            });
            return () => unsubscribe();
        } else {
            setLoading(false);
        }
    }, [user]);

    const getMovieNameById = async (movieId) => {
        try {
            const movieDetails = await fetchMovieDetails(movieId);
            
            if (movieDetails) {
                return movieDetails.title;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error fetching movie details:', error);
            throw error;
        }
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

                        {/* <RecommendMovie data={recommendedMovies}/> */}
                        {recommendedMovies.length>0 && <RecommendMovie data={recommendedMovies}/>}
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