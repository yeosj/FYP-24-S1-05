import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { firebase } from "../Firebase/firebase";

const SignIn = ({ navigation, setIsSignedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function navigate() {
    navigation.navigate("SignUp");
  }

  async function signInWithEmailAndPassword() {
    try {
      // Sign in the user with email and password
      await firebase.auth().signInWithEmailAndPassword(email, password);
      const user = firebase.auth().currentUser;
      if (!user.emailVerified) {
        // Email is not verified, show an alert or redirect to a page asking the user to verify their email
        Alert.alert(
          "Email Not Verified",
          "Please verify your email before signing in."
        );
        // Optionally, sign out the user until their email is verified
        firebase.auth().signOut();
        return;
      }
      // Check if Tinyproxy is installed
      const isTinyproxyInstalled = await Linking.canOpenURL(
        "com.example.tinyproxy"
      );
      if (!isTinyproxyInstalled) {
        // Tinyproxy is not installed, prompt the user to download it
        Alert.alert(
          "Tinyproxy Not Installed",
          "Please download and install Tinyproxy to continue.",
          [
            {
              text: "Download",
              onPress: () => Linking.openURL("https://tinyproxy.github.io/"),
            },
            { text: "Cancel", style: "cancel" },
          ]
        );
        return;
      }
      // Update the isSignedIn state to true
      setIsSignedIn(true);
      // Navigate to the Alerts screen after successful sign-in
      navigation.navigate("Alerts");
    } catch (error) {
      // Handle sign-in errors
      console.error("Error signing in:", error.message);
      Alert.alert("Error", "Invalid email or password. Please try again.");
    }
  }

  return (
    <View style={styles.mainView}>
      <View style={styles.TopView}></View>
      <View style={styles.BottomView}>
        <Text style={styles.Heading}>Welcome {"\n"} back</Text>
        <View style={styles.FormView}>
          <TextInput
            onChangeText={(val) => setEmail(val)}
            value={email}
            placeholder={"Email address*"}
            placeholderTextColor={"#fff"}
            style={styles.TextInput}
          />
          <TextInput
            onChangeText={(val) => setPassword(val)}
            value={password}
            placeholder={"Password*"}
            secureTextEntry={true}
            placeholderTextColor={"#fff"}
            style={styles.TextInput}
          />
          <TouchableOpacity
            onPress={signInWithEmailAndPassword}
            style={styles.Button}
          >
            <Text style={styles.ButtonText}>Sign in</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.TextButton} onPress={navigate}>
          <Text style={styles.SignUpText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    marginTop: 40,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  TopView: {
    width: "100%",
    height: "5%",
  },
  BottomView: {
    width: "100%",
    height: "95%",
    backgroundColor: "#000",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  Heading: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "bold",
    marginLeft: 30,
    marginTop: 60,
  },
  FormView: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 30,
    color: "#fff",
  },
  TextInput: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#fff",
    height: 52,
    borderRadius: 10,
    paddingLeft: 5,
    marginTop: 20,
    color: "#fff",
  },
  Button: {
    width: "90%",
    color: "#000",
    height: 52,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  ButtonText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  SignUpText: { color: "gray" },
  TextButton: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    marginTop: 20,
  },
});

export default SignIn;
