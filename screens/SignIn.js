import React, { useEffect, useState } from "react";

import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { firebase } from "../Firebase/firebase";
import NetInfo from "@react-native-community/netinfo";

const SignIn = ({ navigation, setIsSignedIn, setUserRole }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const user = firebase.auth().currentUser;
      if (user) {
        await handleDeviceRegistration(user.uid);
      }
    };
    checkUser();
  }, []);

  const handleDeviceRegistration = async (userId) => {
    try {
      const installationId = Constants.installationId;
      // Other device data collection as per your existing function...
      console.log("Device check complete"); // Placeholder for the existing logic
    } catch (error) {
      console.error("Error registering device:", error);
      Alert.alert("Error", "Failed to register the device.");
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Validation", "Please enter both email and password.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      const { user } = response;
      if (user && !user.emailVerified) {
        Alert.alert(
          "Email Not Verified",
          "Please verify your email before signing in."
        );
        firebase.auth().signOut();
        setIsLoading(false);
        return;
      }

      // Fetch user document to check if the user is active
      const userDocRef = firebase.firestore().doc(`users/${user.uid}`);
      const userDoc = await userDocRef.get();
      if (!userDoc.exists || !userDoc.data().isActive) {
        Alert.alert(
          "Access Denied",
          "Your account is inactive. Please contact support."
        );
        firebase.auth().signOut();
        setIsLoading(false);
        return;
      }
      // Assuming the device ID and user ID are known or can be retrieved at this point
      const deviceId = Constants.installationId; // Example: get from device constants or state
      const userId = user.uid;

      // Check device isActive status
      const deviceRef = firebase
        .firestore()
        .doc(`users/${userId}/devices/${deviceId}`);
      const deviceDoc = await deviceRef.get();
      if (deviceDoc.exists && !deviceDoc.data().isActive) {
        Alert.alert(
          "Access Denied",
          "This device has been deactivated. Please contact network admin."
        );
        firebase.auth().signOut(); // Optionally sign out the user
        setIsLoading(false);
        return;
      }

      // Proceed with role fetching and navigation
      const role = await getUserRole(userId);
      setUserRole(role);
      setIsSignedIn(true);
      navigation.navigate(role === "system admin" ? "Alerts" : "Dashboard");
    } catch (error) {
      Alert.alert("Sign In Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const registerDevice = async (userId) => {
    const installationId = Constants.installationId;
    const deviceRef = firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("devices")
      .doc(installationId);

    try {
      const doc = await deviceRef.get();
      const userDoc = await firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .get();
      const userRole = userDoc.data().userRole;

      // If the device exists and the user is not a network admin, check if it's active
      if (doc.exists && userRole !== "network admin" && !doc.data().isActive) {
        Alert.alert(
          "Access Denied",
          "This device has been deactivated. Please contact support."
        );
        throw new Error("This device is deactivated.");
      }
      const networkInfo = await NetInfo.fetch();

      // Create an object to store in Firestore
      const deviceNetworkInfo = {
        installationId,
        ipAddress: networkInfo.details.ipAddress || "N/A",
        subnet: networkInfo.details.subnet || "N/A", // Depending on availability in the library version
        gateway: networkInfo.details.gateway || "N/A", // Depending on availability
        networkType: networkInfo.type,
        isConnected: networkInfo.isConnected,
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp(), // Use server timestamp for consistency
        isActive: true, // Automatically activate new devices; adjust based on your policy
      };
      // include other device-specific information from Expo Device
      const deviceDetails = {
        uptime: await Device.getUptimeAsync(),
        getMaxMemoryAsync: await Device.getMaxMemoryAsync(),
        getPlatformFeaturesAsync: await Device.getPlatformFeaturesAsync(),
        isRooted: await Device.isRootedExperimentalAsync(),
        brand: Device.brand || "Unknown",
        designName: Device.designName || "Unknown",
        osBuildFingerprint: Device.osBuildFingerprint || "Unknown",
        platformApiLevel: Device.platformApiLevel || "Unknown",
        productName: Device.productName || "Unknown",
      };
      // Combine all device information into one object
      const deviceData = {
        ...deviceNetworkInfo,
        ...deviceDetails,
      };

      // Only update or set the device info if necessary
      if (!doc.exists || userRole === "network admin") {
        await deviceRef.set(deviceData, { merge: true });
        console.log("Device and network information updated successfully!");
      }
    } catch (error) {
      console.error("Failed to register device and network details:", error);
      Alert.alert("Error", "Failed to register device and network details.");
    }
  };
  const getUserRole = async (userId) => {
    try {
      // Fetch user role from database or custom claims
      // Example: Fetch user data from Firestore and determine role
      const userSnapshot = await firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .get();
      if (userSnapshot.exists) {
        console.log("User document found for userId:", userId);
        const userData = userSnapshot.data();
        const userRole = userData.userRole;
        console.log("User role:", userRole);
        return userRole;
      } else {
        console.log("User document not found for userId:", userId);
        return null;
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
      throw error;
    }
  };
  function navigate() {
    navigation.navigate("SignUp");
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
            onPress={handleSignIn}
            style={styles.Button}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : (
              <Text style={styles.ButtonText}>Sign in</Text>
            )}
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
