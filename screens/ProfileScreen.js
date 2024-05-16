import React, { useState } from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView, Dimensions, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useAuth from '../hooks/useAuth';
import { ChevronLeftIcon, PencilSquareIcon } from 'react-native-heroicons/solid';
import { EnvelopeIcon, FilmIcon, HeartIcon, PhoneIcon } from 'react-native-heroicons/outline';
import { styles } from '../theme';

var {width, height} = Dimensions.get('window')
const ios = Platform.OS == 'ios';
const verticalMargin = ios? '': ' my-3'

export default function ProfileScreen() {
    const navigation = useNavigation();
    const { user } = useAuth(); 
    
    return (
        <ScrollView className="flex-1 bg-neutral-900" contentContainerStyle={{paddingBottom: 20}}>
            {/* back button */}
            <SafeAreaView className={"z-20 w-full flex-row justify-between items-center px-4 pt-8 mt-3" + verticalMargin}>
                <TouchableOpacity onPress={()=> navigation.goBack()} style={styles.background} className="rounded-xl p-1">
                    <ChevronLeftIcon size="28" strokeWidth={2.5} color="white"/>
                </TouchableOpacity>

                <View className="flex-1 items-center">
                    <Text className="text-white text-xl font-bold">
                        Profile
                    </Text>         
                </View>

                <TouchableOpacity onPress={()=>navigation.navigate("EditProfile")} className="rounded-xl p-1">
                    <PencilSquareIcon size="28" strokeWidth={2.5} color="white"/>
                </TouchableOpacity>
            </SafeAreaView>

            <View className="mx-6 pt-6">
                <View 
                    className="flex-row mt-4 mb-4"
                    style={{
                        shadowColor: 'gray',
                        shadowRadius: 40,
                        shadowOffset: {width: 0, height: 5},
                        shadowOpacity: 1,
                        elevation: 5
                    }}
                >
                    <View className="items-center rounded-full overflow-hidden h-32 w-32 border-2 border-neutral-500">
                        <Image 
                            source={{uri: user?.photoURL || '../assets/images/default-avatar.png'}}
                            style={{height: height*0.17, width: width*0.36}}
                        />
                    </View>
                    <View className="flex-row justify-center items-center ml-6">
                        <Text className="text-2xl text-white text-center font-bold">
                            {user?.displayName || 'N/A'}
                        </Text>
                    </View>
                </View>
                
                <View className="flex-row mt-6 items-center">
                    <PhoneIcon size="20" strokeWidth={2.5} color="white"/>
                    <Text className="text-md text-white ml-4">
                        {user?.phoneNumber || 'N/A'}
                    </Text>
                </View>

                <View className="flex-row mt-6 items-center">
                    <EnvelopeIcon size="20" strokeWidth={2.5} color="white"/>
                    <Text className="text-md text-white ml-4">
                        {user?.email}
                    </Text>
                </View>
                
            </View>

            <View className="my-8 border-t-2 border-neutral-400">
                {/* Favorite Movies */}
                <TouchableOpacity onPress={()=> navigation.navigate('Favorite')} className="flex-row mt-8 mx-6 items-center">
                    <HeartIcon size="22" strokeWidth={2.5} color="white"/>
                    <Text className="text-white text-md pl-4">
                        Your Favorites
                    </Text>
                </TouchableOpacity>

                {/* watch later movies */}
                <TouchableOpacity className="flex-row mt-6 mx-6 items-center">
                    <FilmIcon size="22" strokeWidth={2.5} color="white"/>
                    <Text className="text-white text-md pl-4">
                        Watch Later Movies
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
        
    );
}
