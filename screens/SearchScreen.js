import { View, Text, Dimensions, TextInput, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Image} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { XMarkIcon } from 'react-native-heroicons/outline'
import { useNavigation } from '@react-navigation/native'
import Loading from '../components/loading'

var {width, height} = Dimensions.get('window')

export default function SearchScreen() {
    const navigation = useNavigation();
    const [results, setResults] = useState([1,2,3,4]);
    let movieName = 'Ant-Man and the Wasp: Quantumania';
    const [loading, setLoading] = useState(false);

  return (
    <SafeAreaView className="bg-neutral-800 flex-1">
      <View
        className="mx-4 mb-3 flex-row justify-between items-center border border-neutral-500 rounded-full"
      >
        <TextInput 
            placeholder='Search Movie'
            placeholderTextColor={'lightgray'}
            className="pb-1 pl-6 flex-1 text-base font-semibold text-white tracking-wider"
        />
        <TouchableOpacity
            onPress={()=> navigation.navigate('Home')}
            className="rounded-full p-3 m-1 bg-neutral-500"
        >
            <XMarkIcon size="25" color="white"/>
        </TouchableOpacity>
      </View>

      {/* results */}
      {
        loading ? (
            <Loading />
        ): 
            results.length>0? (
                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{paddingHorizontal: 10}}
                    className="space-y-3"
                    >
                        <Text className="text-white font-semibold ml-1">Results ({results.length})</Text>
                        <View className="flex-row justify-between flex-wrap">
                            {
                                results.map((item, index)=>{
                                    return (
                                        <TouchableWithoutFeedback
                                            key={index}
                                            onPress={()=>navigation.push("Movie", item)}
                                        >
                                            <View className="space-y-2 mb-4">
                                                <Image className="rounded-3xl"
                                                    source={require('../assets/images/moviePoster1.png')}
                                                    style={{width: width*0.44, height:height*0.3}}
                                                />
                                                <Text className="text-neutral-300 ml-1">
                                                    {
                                                        movieName.length>22? movieName.slice(0,18)+'...':movieName
                                                    }
                                                </Text>
                                            </View>
                                            
                                        </TouchableWithoutFeedback>
                                    )
                                })
                            }
                        </View>
                </ScrollView>
            ):(
                <View className="flex-row justify-between">
                    <Image 
                        source={require('../assets/images/movieTime.png')}
                        className="h-96 w-96"
                    />
                </View>
            )
      }
      
    </SafeAreaView>
  )
}