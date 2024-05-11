import React, { useState, useEffect } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DrawerContentScrollView, DrawerItem, DrawerItemList, createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "../screens/HomeScreen";
import MovieScreen from "../screens/MovieScreen";
import PersonScreen from "../screens/PersonScreen";
import SearchScreen from "../screens/SearchScreen";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignupScreen";
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import useAuth from "../hooks/useAuth";
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import UserInfo from '../components/userInfo';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function HomeNavigation() {
    return (
      <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Movie" component={MovieScreen} />
        <Stack.Screen name="Person" component={PersonScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen}/>
        <Stack.Screen name="EditProfile" component={EditProfileScreen}/>
        <Stack.Screen name="Favorite" component={FavoritesScreen}/>
        <Stack.Screen name="SignUp" component={SignUpScreen}/>
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen}/>
        
      </Stack.Navigator>
    );
}

function DrawerContent(props) {
    const { navigation, user } = props;

    const handleLogout = async() => {
        await signOut(auth);
    };

    // style drawerItem Logout
    const drawerItemStyle = {
        labelStyle: {
            fontSize: 16,
            color: 'white',
        },
        activeTintColor: '#9AA6EC', 
        inactiveTintColor: 'gray',
    };
    
    return (
        <DrawerContentScrollView {...props}>
            {user && 
                <DrawerItem
                    label={() => <UserInfo user={user} />}
                    style={{ marginVertical: 10, paddingHorizontal: 16 }}
                />}
            <DrawerItemList {...props} />
            {user && (
                <DrawerItem
                    label="Logout"
                    onPress={handleLogout}
                    labelStyle={{ fontSize: 16 }}
                    {...drawerItemStyle}
                />
            )}
        </DrawerContentScrollView>
    );
}
  
export default function AppNavigation(){
    const { user } = useAuth();
    const [loggedInUser, setLoggedInUser] = useState(null);

    useEffect(() => {
        if(user){
            setLoggedInUser(user);
        }else{
            setLoggedInUser(null);
        }
    }, [user]);

    //styles drawer
    const drawerOptions = {
        drawerStyle: {
            backgroundColor: '#262626',
            width: user ? 280 : 240,
        },
        drawerLabelStyle: {
            fontSize: 16,
            color: 'white',
        },
        drawerActiveTintColor: '#9AA6EC', 
        drawerInactiveTintColor: 'gray',
    };
    
    return (
        <NavigationContainer>
            <Drawer.Navigator 
                screenOptions={drawerOptions}
                drawerContent={(props) => <DrawerContent {...props} user={loggedInUser} />}
            >
                <Drawer.Screen name="Home" options={{headerShown: false}} component={HomeNavigation} />
                <Drawer.Screen name="Setting" component={""} /> 
                {!user && <Drawer.Screen name="Login" options={{headerShown: false}} component={LoginScreen} />}
            </Drawer.Navigator>
        </NavigationContainer>
    );
}
