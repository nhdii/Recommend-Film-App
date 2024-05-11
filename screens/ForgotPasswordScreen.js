import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth  } from '../config/firebase';
import { ArrowLeftIcon, EnvelopeIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../theme';

export default function ForgotPasswordScreen() {
    
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleResetPassword = async () => {
        if (email) {
            try {
                await sendPasswordResetEmail(auth, email);
                Alert.alert(
                    'Password Reset Email Sent',
                    'Please check your email inbox for instructions to reset your password.'
                );
            } catch (err) {
                setError('Error sending password reset email. Please try again.');
            }
        } else {
            setError('Please enter your email address.');
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
            <View className="flex-1 bg-neutral-800">
                <SafeAreaView>
                    <View className="flex-row justify-start mt-10">
                        <TouchableOpacity 
                            onPress={()=> navigation.goBack()}
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
                            Forgot Your Password
                        </Text>
                    </View>
                </View>

                <View className="px-4 mt-4">
                    <Text className="text-white font-semibold pb-2">Email</Text>

                    <View className="bg-neutral-700 text-white px-4 py-2 rounded-lg flex-row items-center mb-4">
                        <EnvelopeIcon size="24" color="gray"/>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Email"
                            placeholderTextColor="gray"
                            className="flex-1 ml-4 text-white"                    
                        />
                    </View>

                    <Text className="text-red-700 text-base text-center">{error}</Text>

                    <TouchableOpacity onPress={handleResetPassword} style={styles.backgroundButton} className="px-4 py-3 rounded-lg mt-6 mb-6">
                        <Text className="text-white text-center text-base font-semibold">Reset Password</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}
