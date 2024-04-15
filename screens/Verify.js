import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import styles from "./LoginStyles";
import axios from "axios";
import { SendTransacEmailApi, AccountApiApiKeys } from "@getbrevo/brevo";

const Verify = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { email } = route.params;
  const [enteredCode, setEnteredCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://shielded-mesa-76471-738f620e84db.herokuapp.com/verify",
        {
          verificationCode: enteredCode,
        }
      );
      setLoading(false);
      if (response.data.success) {
        alert("Verification successful");
        // Proceed to next step, such as navigating to the login screen
        navigation.navigate("Login");
      } else {
        alert("Verification code is incorrect");
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      setLoading(false);
      alert("Error verifying code. Please try again.");
    }
  };

  const handleResendCode = async () => {
    // Logic to resend verification code
    setLoading(true);
    try {
      await axios.post(
        "https://shielded-mesa-76471-738f620e84db.herokuapp.com//resend-code",
        {
          // You may need to send additional data, like user's email, for the server to resend the code
        }
      );
      setLoading(false);
      alert("Verification code resent to your email");
    } catch (error) {
      console.error("Error resending code:", error);
      setLoading(false);
      alert("Error resending verification code. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify your email</Text>
      <Text style={styles.description}>
        Please enter the verification code we sent to your email address to
        complete your verification process
      </Text>
      {/* Input fields for 6-digit verification code */}
      <View style={styles.codeContainer}>
        {/* Render 6 boxes for 6-digit code */}
        {Array.from({ length: 6 }).map((_, index) => (
          <TextInput
            key={index}
            style={styles.codeInput}
            value={enteredCode[index] || ""}
            onChangeText={(text) => {
              const newCode = [...enteredCode];
              newCode[index] = text;
              setEnteredCode(newCode);
            }}
            maxLength={1}
            keyboardType="numeric"
          />
        ))}
      </View>
      <TouchableOpacity onPress={handleResendCode}>
        <Text style={styles.resendCodeText}>Resend the code</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleVerify} disabled={loading}>
        <Text style={[styles.verifyButton, loading && { opacity: 0.5 }]}>
          {loading ? "Verifying..." : "Verify"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Verify;
