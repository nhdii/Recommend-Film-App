import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { View, Text, SafeAreaView, Platform, TouchableOpacity, ScrollView } from "react-native";
import { Bars3CenterLeftIcon, MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { styles } from "../theme";
import TrendingMovie from "../components/trendingMovies"
import MovieList from "../components/movieList";

const ios = Platform.OS == 'ios';

export default function HomeScreen(){

    const [trending, setTrending] = useState([1, 2, 3])
    const [upcoming, setUpcoming] = useState([1, 2, 3])
    const [topRate, setTopRate] = useState([1, 2, 3])

    return (
        <View className="flex-1 bg-neutral-800">
            {/* Search bar and Logo */}
            <SafeAreaView className={ios? "-mb-2" : '-mb-3 mt-10'}>
                <StatusBar style="light"/>
                <View className="flex-row justify-between items-center mx-4">
                    <Bars3CenterLeftIcon size="30" strokeWidth={2} color="white" />
                    <Text className="text-white text-3xl font-bold">
                        <Text style={styles.text}>M</Text>ovies
                    </Text>

                    <TouchableOpacity>
                        <MagnifyingGlassIcon size="30" strokeWidth={2} color="white" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 10}} 
            >
                {/* Trending Movie */}
                <TrendingMovie data={trending} />

                <MovieList title="Upcoming" data={upcoming} />

            </ScrollView>
        </View>
    )
}