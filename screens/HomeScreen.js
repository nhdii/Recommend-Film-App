import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, Platform, TouchableOpacity, ScrollView } from "react-native";
import { Bars3CenterLeftIcon, MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { styles } from "../theme";
import TrendingMovie from "../components/trendingMovies"
import MovieList from "../components/movieList";
import { useNavigation } from "@react-navigation/native";
import Loading from "../components/loading";
import { fetchTopRatedMovies, fetchTrendingMovies, fetchUpcomingMovies } from "../api/moviedb";
import { DrawerActions } from '@react-navigation/native';

const ios = Platform.OS == 'ios';

export default function HomeScreen(){

    const [trending, setTrending] = useState([])
    const [upcoming, setUpcoming] = useState([])
    const [topRate, setTopRate] = useState([])
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        getTrendingMovies();
        getUpcomingMovies();
        getTopRatedMovies();
    },[])

    // get data trending movies
    const getTrendingMovies = async () =>{
        const data = await fetchTrendingMovies();
        // console.log('got trending movies: ', data);
        if( data && data.results) setTrending(data.results);
        setLoading(false);
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
            {/* <SafeAreaView className={ios? "-mb-2" : '-mb-3 mt-10'}> */}
            <SafeAreaView className={'mb-2 mt-10'}>
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
                        {/* Trending Movie */}
                        {trending.length>0 && <TrendingMovie data={trending} />}

                        {/* Upcoming movie */}
                        <MovieList title="Upcoming" data={upcoming} />

                        {/* Top rate movie */}
                        <MovieList title="Top Rated" data={topRate} />

                    </ScrollView>
                )
            }

            
        </View>
    )
}