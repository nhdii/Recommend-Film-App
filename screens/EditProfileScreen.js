import { View, Text, Image, TouchableOpacity, SafeAreaView, Dimensions, Platform, ScrollView, TextInput } from 'react-native'
import React, { useState } from 'react'
import useAuth from '../hooks/useAuth'; 
import { useNavigation } from '@react-navigation/native';
import { ChevronLeftIcon, PencilIcon } from 'react-native-heroicons/solid';
import * as ImagePicker from 'expo-image-picker';
import { styles } from '../theme';
import Alert from '../components/alert';

var {width, height} = Dimensions.get('window')
const ios = Platform.OS == 'ios';
const verticalMargin = ios? '': ' my-3'

export default function EditProfileScreen() {
    const navigation = useNavigation();
    const {user, updateUserProfile } = useAuth(); 
    const [displayName, setDisplayName] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState(null);
    const [photoURL, setPhotoURL] = useState(null);
    const [showAlert, setShowAlert] = useState(false); // State to control visibility of custom alert

    const handleUpdateProfile = async () => {
      try {
          await updateUserProfile( displayName, phoneNumber, photoURL);
          // await updateProfile(fullName, phoneNumber, updatedPhotoURL);
          // Cập nhật thành công, điều hướng đến màn hình trước và hiển thị thông báo
          
          // Alert.alert(
          //   "Success",
          //   "Profile updated successfully",
          //   [{ text: "OK", onPress: () => navigation.goBack() }],
          // );

          setShowAlert(true); // Show custom alert
      } catch (error) {
          console.error('Error updating profile: ', error.message);
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
        <View className="flex-1 items-center pr-8">
          <Text className="text-white text-lg font-bold">
            Edit Profile
          </Text>         
        </View>
      </SafeAreaView>

      <View className="flex-1 mx-3">
        <View className="flex-row justify-center mt-6 mb-4">
          <View className="items-center rounded-full overflow-hidden h-32 w-32 border-2 border-neutral-500 ">
            <TouchableOpacity onPress={pickImage} className="absolute bottom-2 right-2 bg-gray-600 p-1 rounded-full">
              <PencilIcon size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={pickImage} className="items-center">
              {
                user?.photoURL ? (
                  <Image 
                    source={{uri: user?.photoURL}}
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

        {/* Display current displayName and phoneNumber */}
        <View className="px-4 mt-4">
          <Text className="text-white text-lg font-semibold pb-2">Full name</Text>
          <View className="bg-neutral-700 text-white px-4 py-2 rounded-lg flex-row items-center mb-4"> 
            <TextInput
                value={displayName}
                onChangeText={setDisplayName}
                placeholder={user?.displayName}
                placeholderTextColor="gray"
                className="flex-1 text-white text-lg"                    
            />
          </View>

          <Text className="text-white text-lg font-semibold pb-2 mt-4">Phone Number</Text>
          <View className="bg-neutral-700 text-white px-4 py-2 rounded-lg flex-row items-center mb-4"> 
            <TextInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder={user?.phoneNumber || 'Phone Number'}
                placeholderTextColor="gray"
                className="flex-1 text-white text-lg"                    
            />
          </View>
        </View>
      </View>

    
      {/* Button update */}
      <TouchableOpacity onPress={handleUpdateProfile} style={{ ...styles.backgroundButton, marginHorizontal: 24, paddingVertical: 12, borderRadius: 8, marginTop: 16 }}>
        <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>Save Changes</Text>
      </TouchableOpacity>

      {/* Alert message update succesful */}
      <Alert 
        visible={showAlert} // Sửa tên prop thành visible
        message="Profile updated successfully"
        onClose={() => setShowAlert(false)}
        autoCloseTimeout={4000} // Đóng sau 3 giây
      />
    </ScrollView>
  )
}