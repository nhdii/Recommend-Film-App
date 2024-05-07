import { View, Text, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Image, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { styles } from '../theme'
import { useNavigation } from '@react-navigation/native';
import { image185 } from '../api/moviedb';
import { TrashIcon } from 'react-native-heroicons/outline';
import useAuth from '../hooks/useAuth';
import { removeFromFavorites } from '../utils/favorites';

var {width, height} = Dimensions.get('window')

export default function MovieList({title, data, hideSeeAll, hideDelete, setShowAlert, setAlertMessage }) {
    const navigation = useNavigation();
    const { user } = useAuth(); 
    const [favorites, setFavorites] = useState([]);

    const handleDeleteMovie = async (movieId) => {
        try {
            if (user && user.uid) {
                await removeFromFavorites(user.uid, movieId); // Gọi hàm removeFromFavorites để xóa phim
                // Cập nhật lại danh sách phim yêu thích
                const updatedFavorites = favorites.filter(favorite => favorite.id !== movieId);
                setFavorites(updatedFavorites);

                // Hiển thị thông báo thành công
                setAlertMessage('Movie has been removed from favorites.');
                setShowAlert(true);
            }
        } catch (error) {
            console.error('Error deleting movie from favorites:', error);
        }
    };

  return (
    <View className="mb-6 mt-6 space-y-4">
      <View className="mx-4 flex-row justify-between items-center" >
        <Text className="text-white text-xl mb-2">
            {title}
        </Text>

        {
            !hideSeeAll && (
                <TouchableOpacity>
                    <Text style={styles.text} className="text-lg">See All</Text>
                </TouchableOpacity>
            )
        }
        
      </View>

      {/* movie row */}

      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentInsetAdjustmentBehavior={{paddingHorizontal: 15}}
        >
            {
                data.map((item, index)=>{
                    return (
                        <TouchableWithoutFeedback
                            key={index}
                            onPress={()=> navigation.push('Movie', item)}
                        >
                            <View className="space-y-1 mr-4">

                                {/* Hiển thị icon xóa phim ra khỏi danh sách yêu thích */}
                                {!hideDelete && (
                                    <TouchableOpacity className="absolute z-10 right-1" onPress={() => handleDeleteMovie(item.id)}>
                                        <TrashIcon size="28" color="white" />
                                    </TouchableOpacity>
                                )}
                                <Image
                                    // source={require('../assets/images/moviePoster1.png')}
                                    source={{uri: image185(item.poster_path)}}
                                    className="rounded-3xl"
                                    style={{
                                        width: width*0.33,
                                        height: height*0.22
                                    }}
                                />
                                <Text className="text-neutral-300 ml-l">
                                    {item.title.length > 12? item.title.slice(0,12) + '...' : item.title}
                                </Text>
                            </View>
                            
                        </TouchableWithoutFeedback>
                    )
                })
            }
        </ScrollView>
    </View>
  )
}