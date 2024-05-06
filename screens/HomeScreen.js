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

export default function HomeScreen(){

    const apiRecommendUrl = "http://10.160.1.82:50100/receive-favorites";

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

    useEffect(() => {
        if (user && user.favorites) {
            getRecommendedMovies();
        }
    }, [user]);
    
    // get data recommend movies
    const getRecommendedMovies = async () => {
        try {
            const movieNames = await Promise.all(user.favorites.map(async (movieId) => {
                try {
                    const movieName = await getMovieNameById(movieId);
                    return movieName;
                } catch (error) {
                    console.error('Error fetching movie name:', error);
                    return null;
                }
            }));
            // Gửi yêu cầu lấy danh sách movie favorites từ API
            const favoritesResponse = await axios.post(apiRecommendUrl, {
                favorites: movieNames.filter(movieName => movieName !== null), 
            });

            // Nhận dữ liệu recommended movies từ API
            const data = favoritesResponse.data;
            console.log("got movie recommend from API: ", movieNames.filter(movieName => movieName !== null),);
            // Kiểm tra nếu có dữ liệu recommended movies được trả về
            if (data && data.recommended_movies) {
                console.log("got movie recommend from API: ", data.recommended_movies);
                setRecommendedMovies(data.recommended_movies);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching recommended movies:', error);
            setLoading(false);
        }
    };

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
        // console.log('got trending movies: ', data);
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