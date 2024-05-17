// ChatList.js
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import ContactRow from "../../../components/ContactRow";
import Divider from "../../../components/Divider";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../../Firebase/firebase";
import { onSnapshot, collection, query, where } from "firebase/firestore";
import { colors } from "../config/constants";

const ChatList = ({ navigation }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (usr) => {
      if (!usr) return navigation.navigate("SignIn");
    });
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (usr) => {
      if (usr) {
        onSnapshot(
          query(
            collection(db, "chats"),
            where("users", "array-contains", usr.email)
          ),
          async (snapshot) => {
            await setChats(
              snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            );
          }
        );
      }
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.messageStartContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("CreateChat")}>
          <Text style={styles.messageStartText}>New Message</Text>
        </TouchableOpacity>
      </View>
      <Divider />
      <ScrollView>
        {chats.map((chat, index) => (
          <React.Fragment key={index}>
            <ContactRow
              name={
                chat.isGroup
                  ? chat.groupName
                  : chat.users.find((x) => x !== auth.currentUser.email)
              }
              subtitle={
                chat.messages.length === 0
                  ? "No messages"
                  : `${
                      chat.messages[0].user.name ===
                      auth.currentUser.displayName
                        ? "You"
                        : chat.messages[0].user.name
                    }: ${chat.messages[0].text}`
              }
              onPress={() => navigation.navigate("Chat", { id: chat.id })}
            />
            <Divider />
          </React.Fragment>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  messageStartContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  messageStartText: {
    color: colors.thirdColor,
    fontSize: 16,
  },
});

export default ChatList;
