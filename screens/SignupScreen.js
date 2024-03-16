import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { KeyIcon, EnvelopeIcon, UserIcon, ArrowLeftIcon, EyeIcon, EyeSlashIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../theme';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { addDoc, collection, getFirestore, query, where, getDocs} from 'firebase/firestore';
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

        if(!validateEmail(email)){
            setError("Invalid email format");
            return;
        }
        
        if(email && password && confirmPassword){
            if(password != confirmPassword){
                setError("Passwords do not match");
                return;
            }
            try{

                const saltRound = 10;
                const hashedPassword = await bcrypt.hashSync(password, saltRound); // Hash mật khẩu
                
                await createUserWithEmailAndPassword(auth, email, password);
                
                // Thêm thông tin người dùng vào Firestore
                const firestore = getFirestore();
                const userRef = collection(firestore, 'users');
                const newUserDoc = await addDoc(userRef, {
                    fullName: fullName,
                    email: email,
                    password: hashedPassword,
                    createdAt: new Date().toISOString()
                });
                // await addDoc(collection(firestore, 'users'), {
                //     fullName: fullName, // Thêm fullName vào state nếu đã có
                //     email: email,
                //     password: hashedPassword,
                //     createdAt: new Date().toISOString()
                // });

                await signInWithEmailAndPassword(auth, email, password);
                // Chuyển hướng đến trang Home
                navigation.navigate('Home');
            }catch(err){
                if(err.code === 'auth/email-already-in-use'){
                    setError('Email is already registered');
                }else{
                    console.log('got error: ', err.message);
                }
                
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
