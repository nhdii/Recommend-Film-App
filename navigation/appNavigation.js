import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "../screens/HomeScreen";
import MovieScreen from "../screens/MovieScreen";
import PersonScreen from "../screens/PersonScreen";
import SearchScreen from "../screens/SearchScreen";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignupScreen";

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
  
  export default function AppNavigation(){
      return (
          <NavigationContainer>
              <Drawer.Navigator>
                  <Drawer.Screen name="Home" options={{headerShown: false}} component={HomeNavigation} />
                  <Drawer.Screen name="Setting" component={""} /> 
                  <Drawer.Screen name="Login" options={{headerShown: false}} component={LoginScreen} /> 
                  {/* <Drawer.Screen name="SignUp" options={{headerShown: false}} component={SignUpScreen} />  */}
              </Drawer.Navigator>
          </NavigationContainer>
      )
  }

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