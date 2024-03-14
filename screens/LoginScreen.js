import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { KeyIcon, EnvelopeIcon, ArrowLeftIcon, EyeIcon, EyeSlashIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function LoginScreen() {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async() => {
        if(email && password){
            try{
                await signInWithEmailAndPassword(auth, email, password);
            }catch(err){
                console.log('got error: ', err.message);
                if(err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password'){
                    setError('Invalid email or password');
                }
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLoginWithGoogle = () => {
        // Xử lý đăng nhập bằng Google
    };

    const handleLoginWithFacebook = () => {
        // Xử lý đăng nhập bằng Facebook
    };

    return (
        <View className="flex-1 bg-neutral-800">
            <SafeAreaView className="flex">
                <View className="flex-row justify-start mt-2">
                    <TouchableOpacity 
                        onPress={()=> navigation.navigate("Home")}
                        className="bg-yellow-400 p-2 rounded-tr-2xl rounded-bl-2xl ml-4">
                        <ArrowLeftIcon size="20" color="black"/>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
            <View className="mb-2 mt-3">
                <View className="flex-row justify-center items-center mx-4">
                    <Text className="text-white text-3xl font-bold justify-center items-center">
                        <Text style={styles.text}>W</Text>elcome!
                    </Text>

                </View>
                <View className="flex-row justify-center items-center m-4">
                    <Text className="text-white text-xl font-bold justify-center items-center">
                        Login your account
                    </Text>

                </View>
            </View>
            <View className="px-4 mt-4">
                <Text className="text-white font-semibold pb-2">Email</Text>
                <View className="bg-neutral-700 text-white px-4 py-2 rounded-lg flex-row items-center mb-4"> 
                    <EnvelopeIcon size="24" color="gray"/>
                    <TextInput
                        value={email}
                        onChangeText={value => setEmail(value)}
                        placeholder="Email"
                        placeholderTextColor="gray"
                        className="flex-1 ml-4 text-white"                    
                    />
                </View>

                <Text className="text-white font-semibold pb-2">Password</Text>
                <View className="bg-neutral-700 text-white px-4 py-2 rounded-lg flex-row items-center mb-4">
                    <KeyIcon size="24" color="gray"/>
                    <TextInput
                        value={password}
                        onChangeText={value => setPassword(value)}
                        placeholder="Password"
                        placeholderTextColor="gray"
                        secureTextEntry={!showPassword}
                        className="flex-1 ml-4 text-white"
                    />
                    <TouchableOpacity onPress={togglePasswordVisibility}>
                        {showPassword ? <EyeSlashIcon size="24" color="gray" /> : <EyeIcon size="24" color="gray" />}
                    </TouchableOpacity>
                </View>

                {/* error message */}
                <Text className="text-red-700 text-center">{error}</Text>

                <TouchableOpacity>
                    <Text className="text-right text-white font-semibold">Forgot your password?</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLogin} style={styles.backgroundButton} className="px-4 py-3 rounded-lg mt-6 mb-6">
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
    );
}
