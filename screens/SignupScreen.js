import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { KeyIcon, EnvelopeIcon, UserIcon, EyeIcon, EyeSlashIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../theme';
import { createUserWithEmailAndPassword, updateProfile} from 'firebase/auth';
import { auth } from '../config/firebase';
import {updateDoc, setDoc, doc, collection, getFirestore} from 'firebase/firestore';
import bcrypt from 'react-native-bcrypt'

export default function SignUpScreen() {
    const navigation = useNavigation();
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');

    const firestore = getFirestore();

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    //add thông tin user vào firestore
    async function DataStore(){
        const userRef = doc(firestore, "users", auth.currentUser.uid )
        await setDoc(userRef, {
            displayName,
            email,
            phoneNumber,
            photoURL, 
            createAt: new Date().toISOString()
        })
        
    }

    const handleSignUp = async () => {
        if (!displayName || !email || !password || !confirmPassword) {
            setError('Please fill in all fields');
        } else if (!validateEmail(email)) {
            setError('Invalid email address');
        } else if (password !== confirmPassword) {
            setError('Passwords do not match');
        } else {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
    
                if (user) {
                    // Cập nhật displayName vào Authentication
                    await updateProfile(user, { displayName: displayName });
    
                    // Chuyển hướng người dùng đến trang Home sau khi đăng ký thành công
                    navigation.navigate('Home');
                }
    
                // Lưu thông tin người dùng vào Firestore
                await DataStore();
            } catch (error) {
                const errorCode = error.code;
                const errorMessage = error.message;
                Alert.alert(errorMessage);
            }
        }
    };
    

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };


    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
            <View className="flex-1 bg-neutral-800">
                <View className="flex-1"></View>
                <View className="flex-1">
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
                <View className="px-4 pt-8 mt-2">
                    <Text className="text-white font-semibold pb-2">Full Name</Text>
                    <View className="bg-neutral-700 text-white px-4 py-2 rounded-lg flex-row items-center mb-4">
                        <UserIcon size={24} color="gray" />
                        <TextInput
                            value={displayName}
                            onChangeText={value => setDisplayName(value)}
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
                            secureTextEntry={!showPassword}
                            className="flex-1 ml-4 text-white"
                        />
                        <TouchableOpacity onPress={togglePasswordVisibility}>
                            {showPassword ? <EyeSlashIcon size="24" color="gray" /> : <EyeIcon size="24" color="gray" />}
                        </TouchableOpacity>
                    </View>

                    <Text className="text-white font-semibold pb-2">Confirm Password</Text>
                    <View className="bg-neutral-700 text-white px-4 py-2 rounded-lg flex-row items-center mb-2">
                        <KeyIcon size={24} color="gray" />
                        <TextInput
                            value={confirmPassword}
                            onChangeText={value => setConfirmPassword(value)}
                            placeholder="Confirm Password"
                            placeholderTextColor="gray"
                            secureTextEntry={!showConfirmPassword}
                            className="flex-1 ml-4 text-white"
                        />
                        <TouchableOpacity onPress={toggleConfirmPasswordVisibility}>
                            {showConfirmPassword ? <EyeSlashIcon size="24" color="gray" /> : <EyeIcon size="24" color="gray" />}
                        </TouchableOpacity>
                    </View>

                    <Text className="text-red-600 text-center text-base">{error}</Text>                    
                </View>

                <View className="px-4 mt-2">
                    <TouchableOpacity onPress={handleSignUp} style={styles.backgroundButton} className="px-4 py-3 rounded-lg mt-2 mb-6">
                        <Text className="text-white text-center text-base font-semibold">Sign Up</Text>
                    </TouchableOpacity>
                </View>

                <View className="flex-row justify-center items-center mx-4 pb-6">
                    <Text className="text-white">Already have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text className="text-white font-bold"> Log In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}
