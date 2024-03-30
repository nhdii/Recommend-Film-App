import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, firestore } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useAuth() {
    const [user, setUser] = useState(null);

    const checkLocalUser = async ()=>{
        try {
            const userJSON = await AsyncStorage.getItem("@user");
            const userData = userJSON ? JSON.parse(userJSON) : null;
            setUser(userData);
            console.log("got local storage: ", userData);
        }catch(error){
            alert(error.message);
        }
    }

    useEffect(()=>{
        checkLocalUser();
        const unsub = onAuthStateChanged(auth, async (user)=>{
            
            if(user){
                console.log('got user: ', JSON.stringify(user, null, 2));
                setUser(user);
                await AsyncStorage.setItem("@user", JSON.stringify(user));
            }else{
                setUser(null);
                await AsyncStorage.removeItem("@user");
            }
        });
        return () => unsub();
    },[])

    const updateProfile = async (fullName, photoURL) => {
        try {
            await updateDoc(doc(firestore, 'users', user.uid), {
                fullName: fullName,
                photoURL: photoURL
            });
            console.log("Profile updated successfully");
        } catch (error) {
            console.error("Error updating profile: ", error);
        }
    };

    return { user, updateProfile };

}