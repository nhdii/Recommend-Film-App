import { View, Text, Image, TouchableOpacity, SafeAreaView, Dimensions, Platform, ScrollView } from 'react-native'
import React, { useState } from 'react'
import useAuth from '../hooks/useAuth'; 
import { useNavigation } from '@react-navigation/native';
import { ChevronLeftIcon } from 'react-native-heroicons/solid';
import * as ImagePicker from 'expo-image-picker';
import { styles } from '../theme';

var {width, height} = Dimensions.get('window')
const ios = Platform.OS == 'ios';
const verticalMargin = ios? '': ' my-3'

export default function EditProfileScreen() {
    const navigation = useNavigation();
    const { user, updateUserProfile } = useAuth(); 
    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
    const [photoURL, setPhotoURL] = useState(null);

    const handleUpdateProfile = async () => {
      try {
          await updateUserProfile( displayName, phoneNumber, photoURL);
          // await updateProfile(fullName, phoneNumber, updatedPhotoURL);
          // Cập nhật thành công, có thể điều hướng đến màn hình khác hoặc hiển thị thông báo
          navigation.goBack();
      } catch (error) {
          console.error('Error updating profile: ', error.message);
          // Xử lý lỗi khi cập nhật hồ sơ
      }
    };

    const pickImage = async () => {
      try {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        console.log(result);

        if (!result.canceled) {
          setPhotoURL(result.assets[0].uri);
        }
      } catch (error) {
          console.error('Error picking image: ', error);
      }
    };


  return (
    <ScrollView className="flex-1 bg-neutral-900" contentContainerStyle={{paddingBottom: 20}}>
      <SafeAreaView className={"z-20 w-full flex-row justify-between items-center px-4 pt-8 mt-3" + verticalMargin}>
        <TouchableOpacity onPress={()=> navigation.goBack()} style={styles.background} className="rounded-xl p-1">
          <ChevronLeftIcon size="28" strokeWidth={2.5} color="white" className="rounded-xl p-1" />
        </TouchableOpacity>
      </SafeAreaView>

      <View className="mx-6">
        <View className="flex-row justify-center mt-4">
          <View className="items-center rounded-full overflow-hidden h-32 w-32 border-2 border-neutral-500">
            <TouchableOpacity onPress={pickImage} className="items-center">
              {
                photoURL ? (
                  <Image 
                    source={{uri: photoURL}}
                    style={{height: height*0.17, width: width*0.36}}
                  />
                ): (
                  <Image 
                    source={require('../assets/images/default-avatar.png')}
                    style={{height: height*0.17, width: width*0.36}}
                  />
                )
              }
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Button update */}
      <TouchableOpacity onPress={handleUpdateProfile} style={{ ...styles.backgroundButton, marginHorizontal: 24, paddingVertical: 12, borderRadius: 8, marginTop: 16 }}>
        <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}