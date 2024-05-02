import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { auth, firestore } from '../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function useAuth() {
    const [user, setUser] = useState();

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

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDataFromFirestore = await getUserDataFromFirestore(user.uid);
                setUser({ ...user, ...userDataFromFirestore });
            } else {
                setUser(null);
            }
        });
        return () => unsub();
    }, []);

    const updateUserProfile = async (displayName, phoneNumber, photoURL) => {
        try {
            const uid = user.uid;

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
