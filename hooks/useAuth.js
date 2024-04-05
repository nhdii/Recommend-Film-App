import React, { useEffect, useState } from 'react'
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { auth, firestore } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function useAuth() {
    const [user, setUser] = useState(null);

    const getUserDataFromFirestore = async (uid) => {
        try {
            const docRef = doc(firestore, 'users', uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return docSnap.data();
            } else {
                console.log('No such document!');
                return null;
            }
        } catch (error) {
            console.error('Error getting user data from Firestore: ', error);
            return null;
        }
    }

    const checkLocalUser = async ()=>{
        try {
            const userJSON = await AsyncStorage.getItem("@user");
            const userData = userJSON ? JSON.parse(userJSON) : null;
            if (userData) {
                const userDataFromFirestore = await getUserDataFromFirestore(userData.uid);
                setUser({ ...userData, ...userDataFromFirestore });
            }
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

    const updateUserProfile = async (displayName, phoneNumber, photoURL) => {
        try {
            const uid = user.uid;
            console.log("got displayName: ", displayName);
            console.log("got phoneNumber: ", phoneNumber);
            console.log("got photoURL: ", photoURL);

            // Tạo object để lưu trữ các trường cần cập nhật
            const updateFields = {};

            // Nếu có giá trị mới cho displayName thì thêm vào object updateFields
            if (displayName) {
                updateFields.displayName = displayName;
            }

            // Nếu có giá trị mới cho phoneNumber thì thêm vào object updateFields
            if (phoneNumber) {
                updateFields.phoneNumber = phoneNumber;
            }

            // Nếu có giá trị mới cho photoURL thì thêm vào object updateFields
            if (photoURL) {
                updateFields.photoURL = photoURL;
            }

            // Nếu có bất kỳ trường nào được thay đổi thì mới thực hiện cập nhật trong Firestore
            if (Object.keys(updateFields).length > 0) {
                await updateProfile(auth.currentUser, updateFields);

                await updateDoc(doc(firestore, 'users', uid), updateFields);
                console.log("Profile updated successfully");
            } else {
                console.log("No fields to update");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            throw error;
        }
    };

    return { user, updateUserProfile };

}