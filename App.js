import React, { useState, useEffect, useRef } from "react";

import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import Alerts from "./screens/signedIn/systemAdmin/Alerts";
import Profile from "./screens/signedIn/systemAdmin/Profile";
import SystemInfo from "./screens/signedIn/systemAdmin/SystemInfo";
import SystemLogs from "./screens/signedIn/systemAdmin/SystemLogs";

import Collaborate from "./screens/signedIn/networkAdmin/Collaborate";
import Current from "./screens/signedIn/networkAdmin/Current";
import Dashboard from "./screens/signedIn/networkAdmin/Dashboard";

import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { ThemeProvider } from "./screens/signedIn/context/ThemeContext";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [initialRoute, setInitialRoute] = useState(null);
  const [loaded] = useFonts({
    Ionicons: require("@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf"),
  });
  const navigationRef = useRef(null);
  // Navigation Handler based on role
  const handleNavigation = (role) => {
    if (role === "system admin") {
      navigationRef.current?.navigate("TabNavigator", { screen: "Alerts" });
    } else if (role === "network admin") {
      navigationRef.current?.navigate("TabNavigator", { screen: "Dashboard" });
    }
  };

  useEffect(() => {}, [loaded]);

  if (!loaded) {
    // You can return a loading indicator here if desired
    return null;
  }

  const TabNavigator = () => {
    if (userRole === "system admin") {
      return (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === "Dashboard") {
                iconName = focused ? "clipboard-outline" : "pie-chart-outline";
              } else if (route.name === "Alerts") {
                iconName = focused ? "alert-outline" : "alert-circle-outline";
              } else if (route.name === "Profile") {
                iconName = focused ? "person-outline" : "person-circle-outline";
              } else if (route.name === "SystemInfo") {
                iconName = focused
                  ? "information-outline"
                  : "information-circle-outline";
              } else if (route.name === "SystemLogs") {
                iconName = focused ? "log-in-outline" : "log-out-outline";
              } else if (route.name === "Collaborate") {
                iconName = focused ? "accessibility-outline" : "walk-outline";
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Alerts" component={Alerts} />
          <Tab.Screen name="Collaborate" component={Collaborate} />
          <Tab.Screen name="Dashboard" component={Dashboard} />
          <Tab.Screen name="Profile">
            {() => <Profile setIsSignedIn={setIsSignedIn} />}
          </Tab.Screen>
          <Tab.Screen name="SystemInfo" component={SystemInfo} />
          <Tab.Screen name="SystemLogs" component={SystemLogs} />
        </Tab.Navigator>
      );
    }

    if (userRole === "network admin") {
      return (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === "Dashboard") {
                iconName = focused ? "clipboard-outline" : "pie-chart-outline";
              } else if (route.name === "Profile") {
                iconName = focused ? "person-outline" : "person-circle-outline";
              } else if (route.name === "Alerts") {
                iconName = focused ? "alert-outline" : "alert-circle-outline";
              } else if (route.name === "Current") {
                iconName = focused
                  ? "phone-portrait-outline"
                  : "phone-portrait-outline";
              } else if (route.name === "SystemLogs") {
                iconName = focused ? "log-in-outline" : "log-out-outline";
              } else if (route.name === "Collaborate") {
                iconName = focused ? "accessibility-outline" : "walk-outline";
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Alerts" component={Alerts} />
          <Tab.Screen name="Collaborate" component={Collaborate} />
          <Tab.Screen name="Current" component={Current} />
          <Tab.Screen name="Dashboard" component={Dashboard} />
          <Tab.Screen name="Profile">
            {() => <Profile setIsSignedIn={setIsSignedIn} />}
          </Tab.Screen>

          <Tab.Screen name="SystemLogs" component={SystemLogs} />
        </Tab.Navigator>
      );
    }
  };

  const renderSignedInScreens = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="TabNavigator"
          component={TabNavigator}
          initialParams={{ userRole }} // Pass userRole as initial params
        />
      </Stack.Navigator>
    );
  };

  const renderSignedOutScreens = () => (
    <Stack.Navigator>
      <Stack.Screen name="SignIn" options={{ headerShown: false }}>
        {({ navigation }) => (
          <SignIn
            navigation={navigation}
            setIsSignedIn={setIsSignedIn}
            setUserRole={setUserRole}
          />
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
    <ThemeProvider>
      <NavigationContainer ref={navigationRef}>
        {isSignedIn ? renderSignedInScreens() : renderSignedOutScreens()}
      </NavigationContainer>
    </ThemeProvider>
  );
}
