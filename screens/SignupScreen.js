import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { KeyIcon, EnvelopeIcon, UserIcon, EyeIcon, EyeSlashIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../theme';
import { createUserWithEmailAndPassword} from 'firebase/auth';
import { auth } from '../config/firebase';
import { addDoc, collection, getFirestore} from 'firebase/firestore';
import bcrypt from 'react-native-bcrypt'

export default function SignUpScreen() {
    const navigation = useNavigation();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');

    const firestore = getFirestore();

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleSignUp = async() => {
        // Kiểm tra xác thực hợp lệ và so sánh mật khẩu
        if(email && password && confirmPassword && password === confirmPassword){
            try{
                // Tạo tài khoản mới với email và mật khẩu
                const credential = await createUserWithEmailAndPassword(auth, email, password);
                
                // Lưu thông tin người dùng vào Firestore
                const saltRound = 10;
                const hashedPassword = await bcrypt.hashSync(password, saltRound);

                const newUser = {
                    fullName: fullName,
                    email: email,
                    password: hashedPassword,
                    createdAt: new Date().toISOString()
                };
                await addDoc(collection(firestore, 'users'), { uid: credential.user.uid, ...newUser });

                // Đăng nhập người dùng sau khi đăng ký thành công
                navigation.navigate('Home');
            } catch(err) {
                console.error('Error signing up:', err.message);
                setError(err.message);
            }
        } else {
            setError('Passwords do not match');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
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
                        value={fullName}
                        onChangeText={value => setFullName(value)}
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
                <View className="bg-neutral-700 text-white px-4 py-2 rounded-lg flex-row items-center mb-4">
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

                <Text className="text-red-700 text-center">{error}</Text>

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
