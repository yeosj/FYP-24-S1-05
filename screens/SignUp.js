import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import CustomCheckBox from "../components/CustomCheckBox";
import { firebase } from "../Firebase/firebase";

const SignUp = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [verificationCodeInput, setVerificationCodeInput] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);

  function firstNameChange(value) {
    setFirstName(value);
  }
  function navigate() {
    navigation.navigate("SignIn");
  }

  async function handleSendVerificationCode() {
    try {
      // Send the verification code to the user's email
      if (!validateEmail(email)) {
        Alert.alert("Error", "Please enter a valid email address.");
        return;
      }

      await firebase.auth().sendSignInLinkToEmail(email, {
        handleCodeInApp: true, // Allow the code to be handled in the app
      });

      // Update state to indicate that the verification email has been sent
      setIsCodeSent(true);
    } catch (error) {
      console.error("Error sending verification code:", error.message);
      Alert.alert(
        "Error",
        "Failed to send verification code. Please try again later."
      );
    }
  }

  async function handleVerifyCode() {
    try {
      // Verify the user's email address
      if (!verificationCodeInput) {
        Alert.alert("Error", "Please enter the verification code.");
        return;
      }

      const actionCodeInfo = await firebase
        .auth()
        .checkActionCode(verificationCodeInput);

      // Email verification successful, proceed with creating the user account
      await createUser();

      console.log("Email verification successful");
    } catch (error) {
      console.error("Error verifying email:", error.message);
      Alert.alert("Error", "Failed to verify email. Please try again later.");
    }
  }
  async function createUser() {
    try {
      // Create the user account using Firebase Authentication
      await firebase.auth().createUserWithEmailAndPassword(email, password);

      // Proceed with any further actions, e.g., navigating to the next screen
      console.log("User account created successfully");
      // Navigate to the next screen or perform any other action
    } catch (error) {
      console.error("Error creating user account:", error.message);
      Alert.alert(
        "Error",
        "Failed to create user account. Please try again later."
      );
    }
  }
  function validateEmail(email) {
    // Simple email validation using regex
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  }

  async function handleSignUp() {
    // Check if all required fields are filled and terms are accepted
    if (!firstName || !lastName || !email || !password || !termsAccepted) {
      Alert.alert(
        "Error",
        "Please fill in all required fields and accept the terms."
      );
      return;
    }
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      Alert.alert(
        "Error",
        "This email address is already in use. Please use a different one."
      );
      return;
    }
    // Proceed with sign-up
    signUpWithEmailPassword(email, password);
  }
  async function signUpWithEmailPassword(email, password) {
    try {
      // Create user with email and password
      const userCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      // Store additional user data in Firestore
      await firebase
        .firestore()
        .collection("users")
        .doc(userCredential.user.uid)
        .set({
          firstName: firstName,
          lastName: lastName,
          email: email,
          userRole: "system admin",
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          isActive: true, // Default to true when registering new devices
        });
      // Send email verification
      await userCredential.user.sendEmailVerification();

      // User signed up and verification email sent successfully
      console.log("Verification email sent to", email);

      Alert.alert(
        "Sign Up Successful",
        "A verification email has been sent to your email address. Please click on the link in the email to verify your account."
      );
      // Navigate to the SignIn screen
      navigation.navigate("SignIn");
    } catch (error) {
      // Handle sign-up errors
      console.error("Error signing up:", error.message);
      Alert.alert(
        "Error",
        "Failed to create user account. Please try again later."
      );
    }
  }
  async function checkEmailExists(email) {
    try {
      const querySnapshot = await firebase
        .firestore()
        .collection("users")
        .where("email", "==", email)
        .get();

      return !querySnapshot.empty; // Return true if any documents are found
    } catch (error) {
      console.error("Error checking email existence:", error);
      return false; // Assume email doesn't exist in case of error
    }
  }

  return (
    <View style={styles.mainView}>
      <View style={styles.TopView}></View>
      <ScrollView style={styles.BottomView}>
        <TouchableOpacity
          onPress={navigate}
          style={styles.BackButton}
          size={60}
          color={"#fff"}
        >
          <Text style={styles.BackButtonText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.Heading}>Create {"\n"}account</Text>
        <View style={styles.FormView}>
          <TextInput
            onChangeText={firstNameChange}
            value={firstName}
            placeholder={"First name*"}
            placeholderTextColor={"#fff"}
            style={styles.TextInput}
          />
          <TextInput
            onChangeText={(val) => setLastName(val)}
            value={lastName}
            placeholder={"Last name*"}
            placeholderTextColor={"#fff"}
            style={styles.TextInput}
          />
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
          <View style={styles.checkboxContainer}>
            <CustomCheckBox
              value={termsAccepted}
              onValueChange={setTermsAccepted}
              style={styles.checkbox}
            />
            <Text style={styles.checkboxText}>
              By signing up, I agree with the Terms of Use & Privacy Policy
            </Text>
          </View>
          <TouchableOpacity onPress={handleSignUp} style={styles.Button}>
            <Text style={styles.ButtonText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
  BackButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 1,
  },
  BackButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff1493", // Adjust color as needed
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
  Icon: { marginLeft: 5, marginTop: 10 },
  checkboxContainer: {
    width: "90%",
    borderWidth: 1,
    flexDirection: "row",
    height: 60,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    paddingLeft: 5,
    marginTop: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  checkboxText: {
    color: "#000", // Set text color to black
  },
});
export default SignUp;
