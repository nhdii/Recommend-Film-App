import { View, Text, Dimensions, Platform, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../theme';
import { ChevronLeftIcon, HeartIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import MovieList from '../components/movieList';
import Loading from '../components/loading';

var {width, height} = Dimensions.get('window')
const ios = Platform.OS == 'ios';
const verticalMargin = ios? '': ' my-4'

export default function PersonScreen() {
    const navigation = useNavigation();
    const [isFavourite, toggleFavourite] = useState(false);    
    const [personMovies, setPersonMovies] = useState([1,2,3,4,5]);
    const [loading, setLoading] = useState(false);

  return (
    <ScrollView className="flex-1 bg-neutral-900" contentContainerStyle={{paddingBottom: 20}}>
      {/* back button */}
      <SafeAreaView className={"z-20 w-full flex-row justify-between items-center px-4 mt-3"+verticalMargin} >
            <TouchableOpacity onPress={()=> navigation.goBack()} style={styles.background} className="rounded-xl p-1">
                <ChevronLeftIcon size="28" strokeWidth={2.5} color="white"/>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=> toggleFavourite(!isFavourite)}>
                <HeartIcon size="28" color={isFavourite? 'red' : "white"}/>
            </TouchableOpacity>
        </SafeAreaView>

        {
            loading ? (
                <Loading />
            ):(

                // {/* person detail */}
                <View>
                    <View 
                        className="flex-row justify-center"
                        style={{
                            shadowColor: 'gray',
                            shadowRadius: 40,
                            shadowOffset: {width: 0, height: 5},
                            shadowOpacity: 1
                        }}
                    >
                        <View className="items-center rounded-full overflow-hidden h-72 w-72 border-2 border-neutral-500">
                            <Image 
                                source={require('../assets/images/castImage1.png')}
                                style={{height: height*0.43, width: width*0.74}}
                            />
                        </View>
                    </View>

                    <View className="mt-6">
                        <Text className=" text-3xl text-white font-bold text-center">
                            Keanu Revees
                        </Text>
                        <Text className="text-base text-neutral-500 text-center">
                            London, United Kingdom
                        </Text>
                    </View>

                    <View className="mx-3 p-4 mt-6 flex-row justify-between items-center bg-neutral-700 rounded-full">
                        <View className="border-r-2 border-r-neutral-400 px-2 items-center">
                            <Text className="text-white font-semibold">Gender</Text>
                            <Text className="text-sm text-neutral-300">Male</Text>
                        </View>

                        <View className="border-r-2 border-r-neutral-400 px-2 items-center">
                            <Text className="text-white font-semibold">Birthday</Text>
                            <Text className="text-sm text-neutral-300">1964-09-02</Text>
                        </View>

                        <View className="border-r-2 border-r-neutral-400 px-2 items-center">
                            <Text className="text-white font-semibold">Know for</Text>
                            <Text className="text-sm text-neutral-300">Acting</Text>
                        </View>

                        <View className="px-2 items-center">
                            <Text className="text-white font-semibold">Popularity</Text>
                            <Text className="text-sm text-neutral-300">64.23</Text>
                        </View>
                    </View>

                    <View className="my-6 mx-4 space-y-2">
                        <Text className="text-white text-lg">Biography</Text>
                        <Text className="tracking-wide text-neutral-400">
                            Liam Hemsworth (born 13 January 1990) is an Australian actor. 
                            He played the roles of Josh Taylor in the soap opera Neighbours and 
                            Marcus in the children's television series The Elephant Princess. 
                            In American films, Hemsworth starred as Will Blakelee in The Last Song (2010), 
                            as Gale Hawthorne in The Hunger Games film series (2012–2015), 
                            and as Jake Morrison in Independence Day: Resurgence (2016).
                        </Text>
                    </View>

                    {/* movies */}

                    <MovieList title={'Movies'} hideSeeAll={true} data={personMovies} />
                </View>
            )
        }

        
        
    </ScrollView>
  )
}