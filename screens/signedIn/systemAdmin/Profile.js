import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

const Profile = ({ setIsSignedIn }) => {
  const [nightMode, setNightMode] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const navigation = useNavigation();
  const auth = getAuth();

  const fetchUserEmail = () => {
    if (auth.currentUser) {
      setUserEmail(auth.currentUser.email);
    }
  };

  // Fetch the user's email when the component mounts
  useEffect(() => {
    fetchUserEmail();
  }, []);
  const toggleNightMode = () => {
    setNightMode(!nightMode); // Toggle night mode state
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsSignedIn(false);
      navigation.navigate("SignIn");
    } catch (error) {
      console.error("Error signing out:", error.code, error.message);
      Alert.alert("Error", "Failed to sign out. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Profile Icon */}
        <View style={styles.profileIcon}></View>
        {/* User Email */}
        <Text style={styles.email}>{userEmail}</Text>
      </View>
      <View style={styles.menu}>
        {/* Edit Profile */}
        <TouchableOpacity style={styles.menuItem}>
          <Text>Edit Profile</Text>
        </TouchableOpacity>
        {/* Preferences */}
        <TouchableOpacity style={styles.menuItem}>
          <Text>Preferences</Text>
        </TouchableOpacity>
        {/* Night Mode */}
        <View style={styles.menuItem}>
          <Text>Night Mode</Text>
          <Switch
            value={nightMode}
            onValueChange={toggleNightMode}
            thumbColor={nightMode ? "#ffffff" : "#000000"} // Change thumb color based on nightMode state
            trackColor={{ false: "#ffffff", true: "#000000" }} // Change track color based on nightMode state
          />
          {/* Night Mode Icon */}
          <FontAwesome5
            name={nightMode ? "moon" : "sun"}
            size={24}
            color={nightMode ? "#ffffff" : "#000000"}
          />
        </View>
        {/* Change Password */}
        <TouchableOpacity style={styles.menuItem}>
          <Text>Change Password</Text>
        </TouchableOpacity>
        {/* Sign Out */}
        <TouchableOpacity style={styles.menuItem} onPress={handleSignOut}>
          <Text>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ccc", // Placeholder color
  },
  firstName: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: "bold",
  },
  menu: {
    flex: 1,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default Profile;
