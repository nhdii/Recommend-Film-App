// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { createDrawerNavigator } from "@react-navigation/drawer";
// import HomeScreen from "../screens/HomeScreen";
// import MovieScreen from "../screens/MovieScreen";
// import PersonScreen from "../screens/PersonScreen";
// import SearchScreen from "../screens/SearchScreen";
// import LoginScreen from "../screens/LoginScreen";
// import SignUpScreen from "../screens/SignupScreen";
// import useAuth from "../hooks/useAuth";

// const Stack = createNativeStackNavigator();
// const Drawer = createDrawerNavigator();

// function HomeNavigation() {
//     return (
//       <Stack.Navigator>
//         <Stack.Screen name="Home" options={{headerShown: false}} component={HomeScreen} />
//         <Stack.Screen name="Movie" options={{headerShown: false}} component={MovieScreen} />
//         <Stack.Screen name="Person" options={{headerShown: false}} component={PersonScreen} />
//         <Stack.Screen name="Search" options={{headerShown: false}} component={SearchScreen} />
//         <Stack.Screen name="SignUp" options={{headerShown: false}} component={SignUpScreen}/>
//       </Stack.Navigator>
//     );
//   }
  
//   export default function AppNavigation(){
//     const {user} = useAuth();
//     if(user){
//       return (
//         <NavigationContainer>
//             <Drawer.Navigator 
//               screenOptions={{
//                 drawerStyle: {
//                   backgroundColor: '#c6cbef',
//                   width: 240
//                 },
                
//               }}>
//                 <Drawer.Screen name="Home" options={{headerShown: false}} component={HomeNavigation} />
//                 <Drawer.Screen name="Setting" component={""} /> 
//                 <Drawer.Screen name="Login" options={{headerShown: false}} component={LoginScreen} /> 
//                 {/* <Drawer.Screen name="SignUp" options={{headerShown: false}} component={SignUpScreen} />  */}
//             </Drawer.Navigator>

//         </NavigationContainer>
//       )
//     }else{
//       return (
//         <NavigationContainer>
//             <Drawer.Navigator 
//               screenOptions={{
//                 drawerStyle: {
//                   backgroundColor: '#c6cbef',
//                   width: 240
//                 },
                
//               }}>
//                 <Drawer.Screen name="Home" options={{headerShown: false}} component={HomeNavigation} />
//                 <Drawer.Screen name="Setting" component={""} /> 
//                 <Drawer.Screen name="Login" options={{headerShown: false}} component={LoginScreen} /> 
//                 {/* <Drawer.Screen name="SignUp" options={{headerShown: false}} component={SignUpScreen} />  */}
//             </Drawer.Navigator>
//         </NavigationContainer>
//       )
//     }
      
//   }

// export default function AppNavigation(){
//     return (
//         <NavigationContainer>
//             <Stack.Navigator>
//                 <Stack.Screen name="Home" options={{headerShown: false}} component={HomeScreen} />
//                 <Stack.Screen name="Movie" options={{headerShown: false}} component={MovieScreen} />
//                 <Stack.Screen name="Person" options={{headerShown: false}} component={PersonScreen} />
//                 <Stack.Screen name="Search" options={{headerShown: false}} component={SearchScreen} />

//             </Stack.Navigator>
//         </NavigationContainer>
//     )
// }


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
import useAuth from "../hooks/useAuth";
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { Image } from 'react-native';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();


function HomeNavigation() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Home" options={{headerShown: false}} component={HomeScreen} />
        <Stack.Screen name="Movie" options={{headerShown: false}} component={MovieScreen} />
        <Stack.Screen name="Person" options={{headerShown: false}} component={PersonScreen} />
        <Stack.Screen name="Search" options={{headerShown: false}} component={SearchScreen} />
        <Stack.Screen name="SignUp" options={{headerShown: false}} component={SignUpScreen}/>
      </Stack.Navigator>
    );
}

function DrawerContent(props) {
    const { navigation, user } = props;

    const handleLogout = async() => {
        await signOut(auth);
    };

    return (
        <DrawerContentScrollView {...props}>
            <DrawerItem
                label={`Hello: Duy`}
                style={{marginVertical: 10, paddingHorizontal: 16}}
                icon={() => <Image source={{}} style={{ width: 32, height: 32, borderRadius: 16 }} />}
            />
            <DrawerItemList {...props} />
            <DrawerItem
                label="Logout"
                onPress={handleLogout}
                labelStyle={{ fontSize: 16}}
            />
        </DrawerContentScrollView>
    );
}
  
export default function AppNavigation(){
    const { user } = useAuth();
    const [loggedInUser, setLoggedInUser] = useState(null);

    useEffect(() => {
        if(user){
            setLoggedInUser(user);
        }
    }, [user]);
    
    if(user){
        return (
            <NavigationContainer>
                <Drawer.Navigator 
                    screenOptions={{
                        drawerStyle: {
                            backgroundColor: '#c6cbef',
                            width: 280
                        },
                        drawerLabelStyle: {
                            fontSize: 16,
                        }
                    }}
                    drawerContent={(props) => <DrawerContent {...props} user={loggedInUser} />}
                >
                    <Drawer.Screen name="Home" options={{headerShown: false}} component={HomeNavigation} />
                    <Drawer.Screen name="Setting" component={""} /> 
                </Drawer.Navigator>
            </NavigationContainer>
        );
    } else {
        return (
            <NavigationContainer>
                <Drawer.Navigator 
                    screenOptions={{
                        drawerStyle: {
                            backgroundColor: '#c6cbef',
                            width: 240
                        },
                        drawerLabelStyle: {
                            fontSize: 16
                        }
                    }}
                >
                    <Drawer.Screen name="Home" options={{headerShown: false}} component={HomeNavigation} />
                    <Drawer.Screen name="Setting" component={""} /> 
                    <Drawer.Screen name="Login" options={{headerShown: false}} component={LoginScreen} /> 
                </Drawer.Navigator>
            </NavigationContainer>
        );
    }
}
