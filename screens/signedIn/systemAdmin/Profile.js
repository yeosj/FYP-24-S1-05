import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  TextInput,
  Image,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { getAuth, sendPasswordResetEmail, signOut } from "firebase/auth";
import { db } from "../../../Firebase/firebase";
import { ThemeContext } from "../../signedIn/context/ThemeContext";
import { useNavigation } from "@react-navigation/native";

const Profile = ({ setIsSignedIn }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [userEmail, setUserEmail] = useState(null);
  const [displayName, setDisplayName] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const navigation = useNavigation();
  const auth = getAuth();

  const fetchUserProfile = async () => {
    if (auth.currentUser) {
      setUserEmail(auth.currentUser.email);

      const userDoc = await db
        .collection("users")
        .doc(auth.currentUser.uid)
        .get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        setDisplayName(userData.firstName + " " + userData.lastName || "");
      }
      setIsLoading(false); // Stop loading once data is fetched
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handlePasswordReset = async () => {
    try {
      if (auth.currentUser && auth.currentUser.email) {
        await sendPasswordResetEmail(auth, auth.currentUser.email);
        Alert.alert(
          "Password Reset",
          "A password reset email has been sent to your email address."
        );
      } else {
        Alert.alert("Error", "No user is signed in.");
      }
    } catch (error) {
      console.error(
        "Error sending password reset email:",
        error.code,
        error.message
      );
      Alert.alert(
        "Error",
        "Failed to send password reset email. Please try again."
      );
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsSignedIn(false);
      navigation.reset({
        index: 0,
        routes: [{ name: "SignIn" }],
      });
    } catch (error) {
      console.error("Error signing out:", error.code, error.message);
      Alert.alert("Error", "Failed to sign out. Please try again.");
    }
  };
  const updateUserProfile = async () => {
    try {
      await db
        .collection("users")
        .doc(auth.currentUser.uid)
        .update({
          firstName: displayName.split(" ")[0],
          lastName: displayName.split(" ")[1] || "",
        });

      Alert.alert(
        "Profile Updated",
        "Your profile has been updated successfully."
      );
    } catch (error) {
      console.error("Error updating profile:", error.code, error.message);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#333" : "#fff" },
      ]}
    >
      <View style={styles.header}>
        {/* User Email */}
        <Text>Email</Text>
        <Text style={styles.email}>{userEmail}</Text>
      </View>
      <View style={styles.menu}>
        {/* Display Name */}
        <View style={styles.menuItem}>
          <Text>Display Name</Text>
          <TextInput
            style={styles.textInput}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Enter display name"
          />
        </View>

        {/* Update Profile */}
        <TouchableOpacity
          style={styles.updateButton}
          onPress={updateUserProfile}
        >
          <Text style={styles.updateButtonText}>Update Profile</Text>
        </TouchableOpacity>

        {/* Night Mode */}
        <View style={styles.menuItem}>
          <Text>Night Mode</Text>
          <Switch onValueChange={toggleTheme} value={theme === "dark"} />
        </View>
        {/* Change Password */}
        <TouchableOpacity style={styles.menuItem} onPress={handlePasswordReset}>
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
    justifyContent: "center",
    alignItems: "center",
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
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  email: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: "bold",
  },
  menu: {
    flex: 1,
    width: "100%",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  textInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    flex: 1,
    marginLeft: 10,
  },
  updateButton: {
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    alignItems: "center",
    marginTop: 15,
  },
  updateButtonText: {
    color: "#ffffff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Profile;
