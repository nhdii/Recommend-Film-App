import { View, Text, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Image, Dimensions } from 'react-native'
import React from 'react'
import { styles } from '../theme'
import { useNavigation } from '@react-navigation/native';
import { image185 } from '../api/moviedb';

var {width, height} = Dimensions.get('window')


export default function MovieList({title, data, hideSeeAll}) {
    const navigation = useNavigation();
    
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