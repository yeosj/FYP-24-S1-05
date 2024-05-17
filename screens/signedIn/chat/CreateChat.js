// CreateChat.js
import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { colors } from "../config/constants";
import { Ionicons } from "@expo/vector-icons";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../../Firebase/firebase";

const CreateChat = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (email === "" || email === " ") {
      setError("Email can't be empty.");
    } else if (
      !/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
        email
      )
    ) {
      setError("Please type correct email.");
    } else {
      if (error) setError("");
      try {
        const currentUserEmail = auth.currentUser.email;
        console.log("Current User Email:", currentUserEmail);

        // Check if the recipient email exists in the users collection
        const q = query(collection(db, "users"), where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError("Email address does not exist.");
          return;
        }

        const docRef = await addDoc(collection(db, "chats"), {
          users: [currentUserEmail, email],
          messages: [],
          isGroup: false,
        });
        navigation.navigate("Chat", { id: docRef.id });
      } catch (e) {
        alert(e.message);
      }
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.content}>
        <Text style={styles.title}>Start a Chat</Text>
        <TextInput
          keyboardType="email-address"
          textContentType="emailAddress"
          style={styles.input}
          placeholder="Email"
          onChangeText={(text) => setEmail(text)}
        />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.btn}
          activeOpacity={0.7}
          onPress={handleSubmit}
        >
          <Ionicons
            name="chatbox-outline"
            color={colors.secondaryColor}
            size={16}
          />
          <Text style={styles.btnText}>Chat!</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: colors.thirdColor,
  },
  input: {
    backgroundColor: colors.secondaryColor,
    fontSize: 15,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 6,
    marginTop: 15,
    marginBottom: 4,
    color: colors.thirdColor,
  },
  text: {
    color: colors.secondaryTextColor,
    marginRight: 5,
    marginStart: 3,
  },
  textAlt: {
    color: colors.thirdColor,
  },
  btn: {
    backgroundColor: colors.thirdColor,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    borderRadius: 6,
    marginTop: 20,
    flexDirection: "row",
  },
  btnText: {
    color: colors.secondaryColor,
    marginLeft: 8,
  },
  errorText: {
    color: "#ff0000",
  },
});

export default CreateChat;
