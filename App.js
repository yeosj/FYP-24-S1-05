import React, { useState, useEffect } from "react";

import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import Alerts from "./screens/signedIn/systemAdmin/Alerts";
import Profile from "./screens/signedIn/systemAdmin/Profile";
import SystemInfo from "./screens/signedIn/systemAdmin/SystemInfo";
import SystemLogs from "./screens/signedIn/systemAdmin/SystemLogs";

import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loaded] = useFonts({
    Ionicons: require("@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf"),
  });

  useEffect(() => {
    // Optionally handle font loading status here
  }, [loaded]);

  if (!loaded) {
    // You can return a loading indicator here if desired
    return null;
  }

  const renderSignedInScreens = () => (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Alerts") {
            iconName = focused ? "alert-outline" : "alert-circle-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person-outline" : "person-circle-outline";
          } else if (route.name === "SystemInfo") {
            iconName = focused
              ? "information-outline"
              : "information-circle-outline";
          } else if (route.name === "SystemLogs") {
            iconName = focused ? "log-in-outline" : "log-out-outline";
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Alerts" component={Alerts} />
      <Tab.Screen name="Profile">
        {() => <Profile setIsSignedIn={setIsSignedIn} />}
      </Tab.Screen>
      <Tab.Screen name="SystemInfo" component={SystemInfo} />
      <Tab.Screen name="SystemLogs" component={SystemLogs} />
    </Tab.Navigator>
  );

  const renderSignedOutScreens = () => (
    <Stack.Navigator>
      <Stack.Screen name="SignIn" options={{ headerShown: false }}>
        {/* Pass the navigation prop to the SignIn component */}
        {({ navigation }) => (
          <SignIn navigation={navigation} setIsSignedIn={setIsSignedIn} />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );

  return (
    <NavigationContainer>
      {isSignedIn ? renderSignedInScreens() : renderSignedOutScreens()}
    </NavigationContainer>
  );
}
