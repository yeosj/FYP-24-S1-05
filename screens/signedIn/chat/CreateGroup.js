// CreateGroup.js
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

const CreateGroup = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [emails, setEmails] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      const currentUserEmail = auth.currentUser.email;
      console.log("Current User Email:", currentUserEmail);

      // Check if all emails exist in the users collection
      const q = query(
        collection(db, "users"),
        where("email", "in", [currentUserEmail, ...emails])
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.size !== emails.length + 1) {
        setError("One or more email addresses do not exist.");
        return;
      }

      await addDoc(collection(db, "chats"), {
        users: [currentUserEmail, ...emails],
        messages: [],
        isGroup: true,
        groupName,
      })
        .then((doc) => navigation.navigate("Chat", { id: doc.id }))
        .catch((e) => alert(e.message));
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  };

  const onChange = (text) => {
    if (text[text.length - 1] === " ") {
      if (
        !/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
          email
        )
      ) {
        setError("Please type correct email.");
      } else if (email === "" || email === " ") {
        setError("Email can't be empty.");
      } else {
        setEmail("");
        setEmails([...emails, text.substr(0, text.length - 1)]);
      }
    } else {
      setEmail(text);
      if (error) setError("");
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.content}>
        <Text style={styles.title}>Create a Group</Text>
        <TextInput
          keyboardType="email-address"
          textContentType="emailAddress"
          style={styles.input}
          placeholder="Emails"
          value={email}
          onChangeText={(text) => onChange(text)}
        />
        <Text style={styles.errorText}>{error}</Text>

        <View style={styles.tagContainer}>
          {emails.map((email, index) => (
            <View style={styles.tags} key={index}>
              <Text style={styles.tagText}>{email}</Text>
              <TouchableOpacity
                style={styles.tagDelete}
                onPress={() => setEmails(emails.filter((em) => em !== email))}
              >
                <Ionicons
                  name="close-circle-outline"
                  color={colors.secondaryColor}
                  size={20}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TextInput
          keyboardType="default"
          style={styles.input}
          placeholder="Group Name"
          onChangeText={(text) => setGroupName(text)}
        />

        <TouchableOpacity
          style={styles.btn}
          activeOpacity={0.7}
          onPress={handleSubmit}
        >
          <Ionicons
            name="chatbubble-outline"
            color={colors.secondaryColor}
            size={16}
          />
          <Text style={styles.btnText}>
            {emails.length > 0
              ? `Start Chat With ${emails.length} People`
              : "Start"}
          </Text>
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
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tags: {
    flexDirection: "row",
    marginRight: 10,
    backgroundColor: colors.thirdColor,
    borderRadius: 100,
    paddingVertical: 2,
    paddingHorizontal: 5,
    alignItems: "center",
    marginTop: 7,
  },
  tagDelete: {
    marginLeft: 5,
  },
  tagText: {
    color: colors.secondaryColor,
  },
  errorText: {
    color: "#ff0000",
  },
});

export default CreateGroup;
