import { View, Text, ScrollView, TouchableOpacity, Image   } from 'react-native'
import React from 'react'
import { fallBackPersonPoster, image185 } from '../api/moviedb';

export default function Director({ director, navigation }) {
    return (
      <View>
        <Text style={{ color: 'white', fontSize: 20, marginLeft: 20, marginBottom: 10 }}>Director</Text>
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 15 }}
        >
          {
            director &&
            <TouchableOpacity 
              className="mr-4 items-center"
              onPress={() => navigation.navigate('Person', director)}
            >
              <View className="overflow-hidden rounded-full h-20 w-20 items-center border border-neutral-500">
                <Image 
                  className="rounded-2xl h-24 w-20"
                  source={{ uri: image185(director?.profile_path) || fallBackPersonPoster }}
                />
              </View>
              <Text style={{ color: '#ccc', fontSize: 12, marginTop: 5 }}>
                {
                  director?.original_name.length > 10 ? director?.original_name.slice(0, 10) + '...' : director?.original_name
                }
              </Text>
            </TouchableOpacity>
          }
        </ScrollView>
      </View>
    );
}