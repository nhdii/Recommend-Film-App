import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { KeyIcon, EnvelopeIcon, UserIcon, ArrowLeftIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../theme';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoginScreen from './LoginScreen';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function SignUpScreen() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async() => {
        if(email && password){
            try{
                await createUserWithEmailAndPassword(auth, email, password);
            }catch(err){
                console.log('got error: ', err.message);
            }
        }
    };

    return (
        <View className="flex-1 bg-neutral-800 pt-6">
            <View className="mb-2 mt-6">
                <View className="flex-row justify-center items-center mx-4">
                    <Text className="text-white text-3xl font-bold justify-center items-center">
                        <Text style={styles.text}>S</Text>ign Up!
                    </Text>
                </View>
                <View className="flex-row justify-center items-center m-4">
                    <Text className="text-white text-xl font-bold justify-center items-center">
                        Create your account
                    </Text>
                </View>
            </View>
            <View className="px-4 mt-6">
                <Text className="text-white font-semibold pb-2">Full Name</Text>
                <View className="bg-neutral-700 text-white px-4 py-2 rounded-lg flex-row items-center mb-4">
                    <UserIcon size={24} color="gray" />
                    <TextInput
                        placeholder="FullName"
                        placeholderTextColor="gray"
                        className="flex-1 ml-4 text-white"
                    />
                </View>

                <Text className="text-white font-semibold pb-2">Email</Text>
                <View className="bg-neutral-700 text-white px-4 py-2 rounded-lg flex-row items-center mb-4">
                    <EnvelopeIcon size={24} color="gray" />
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
                    <KeyIcon size={24} color="gray" />
                    <TextInput
                        value={password}
                        onChangeText={value => setPassword(value)}
                        placeholder="Password"
                        placeholderTextColor="gray"
                        secureTextEntry={true}
                        className="flex-1 ml-4 text-white"
                    />
                </View>

                <Text className="text-white font-semibold pb-2">Confirm Password</Text>
                <View className="bg-neutral-700 text-white px-4 py-2 rounded-lg flex-row items-center mb-4">
                    <KeyIcon size={24} color="gray" />
                    <TextInput
                        placeholder="Confirm Password"
                        placeholderTextColor="gray"
                        secureTextEntry={true}
                        className="flex-1 ml-4 text-white"
                    />
                </View>
                <TouchableOpacity onPress={handleSignUp} style={styles.backgroundButton} className="px-4 py-3 rounded-lg mt-6 mb-6">
                    <Text className="text-white text-center text-lg font-semibold">Sign Up</Text>
                </TouchableOpacity>
            </View>
            <View className="flex-row justify-center items-center mx-4 pt-6">
                <Text className="text-white">Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text className="text-white font-bold"> Log In</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
