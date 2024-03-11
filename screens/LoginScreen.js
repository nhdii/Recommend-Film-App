import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { KeyIcon, EnvelopeIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../theme';
import { ScrollView } from 'react-native-gesture-handler';

export default function LoginScreen() {
    const navigation = useNavigation();

    const handleLogin = () => {
        // Xử lý đăng nhập
    };

    const handleLoginWithGoogle = () => {
        // Xử lý đăng nhập bằng Google
    };

    const handleLoginWithFacebook = () => {
        // Xử lý đăng nhập bằng Facebook
    };

    return (
        <ScrollView contentContainerStyle={{paddingBottom: 20}} className="flex-1 bg-neutral-800">
            <View className="flex-1 bg-neutral-800">
                <View className="mb-2 mt-20">
                    <View className="flex-row justify-center items-center mx-4">
                        <Text className="text-white text-3xl font-bold justify-center items-center">
                            <Text style={styles.text}>W</Text>elcome!
                        </Text>

                    </View>
                    <View className="flex-row justify-center items-center m-6">
                        <Text className="text-white text-xl font-bold justify-center items-center">
                            Login your account
                        </Text>

                    </View>
                </View>
                <View className="px-4 mt-6">
                    <Text className="text-white font-semibold pb-2">Email</Text>
                    <View className="bg-neutral-700 text-white px-4 py-2 rounded-lg flex-row items-center mb-4"> 
                        <EnvelopeIcon size="24" color="gray"/>
                        <TextInput
                            placeholder="Email"
                            placeholderTextColor="gray"
                            className="flex-1 ml-4"                    
                        />
                    </View>

                    <Text className="text-white font-semibold pb-2">Password</Text>
                    <View className="bg-neutral-700 text-white px-4 py-2 rounded-lg flex-row items-center mb-4">
                        <KeyIcon size="24" color="gray"/>
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor="gray"
                            secureTextEntry={true}
                            className="flex-1 ml-4"
                        />
                    </View>


                    <TouchableOpacity>
                        <Text className="text-right text-white font-semibold">Forgot your password?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleLogin} style={styles.backgroundButton} className="px-4 py-3 rounded-lg mt-10 mb-6">
                        <Text className="text-white text-center text-lg font-semibold">Log in</Text>
                    </TouchableOpacity>
                    <Text className="text-white text-center text-md font-semibold mb-6 ">Or Log in with </Text>
                    <TouchableOpacity onPress={handleLoginWithGoogle} className="bg-red-600 px-4 py-3 rounded-lg mb-2">
                        <Text className="text-white text-center font-semibold">Login with Google</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleLoginWithFacebook} className="bg-blue-400 px-4 py-3 rounded-lg">
                        <Text className="text-white text-center font-semibold">Login with Facebook</Text>
                    </TouchableOpacity>

                    
                </View>

                <View className="flex-row justify-center items-center mx-4 pt-6">
                    <Text className="text-white">Don't have an Account?</Text>
                    <TouchableOpacity onPress={()=> navigation.navigate('SignUp')}>
                        <Text className="text-white font-bold"> Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}
