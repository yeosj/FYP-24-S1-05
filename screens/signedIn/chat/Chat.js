import React, { useState, useCallback, useEffect } from "react";
import {
  Bubble,
  GiftedChat,
  InputToolbar,
  Send,
} from "react-native-gifted-chat";
import { colors } from "../config/constants";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "../../../Firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

const renderBubble = (props) => {
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: colors.thirdColor,
        },
        left: {
          backgroundColor: colors.secondaryColorAlt,
        },
      }}
      textStyle={{
        right: {
          color: colors.primaryColor,
        },
        left: {
          color: colors.primaryTextColor,
        },
      }}
    />
  );
};

const scrollToBottomComponent = () => {
  return <Ionicons name="arrow-down-outline" size={20} />;
};

const renderInputToolbar = (props) => {
  return (
    <InputToolbar
      {...props}
      containerStyle={{
        backgroundColor: colors.secondaryColor,
        borderTopWidth: 0,
        borderBottomWidth: 0,
        paddingHorizontal: 0,
        paddingVertical: 0,
        marginTop: 0,
        marginBottom: 0,
      }}
      placeholder={"Your message..."}
      textInputStyle={{
        color: colors.primaryTextColor,
        fontSize: 15,
      }}
    />
  );
};

const renderSend = (props) => {
  return (
    <Send {...props}>
      <View>
        <Ionicons
          name="send"
          size={24}
          style={{
            marginBottom: 10,
            marginRight: 10,
          }}
          color={colors.thirdColor}
        />
      </View>
    </Send>
  );
};

const Chat = ({ route, navigation }) => {
  const [messages, setMessages] = useState([]);
  const [uid, setUID] = useState("");
  const [name, setName] = useState("");
  const chatsRef = collection(db, "chats", route.params.id, "messages");

  useEffect(() => {
    const q = query(chatsRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      await setMessages(
        snapshot.docs.map((doc) => ({
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
        }))
      );
    });

    return () => unsubscribe();
  }, [route.params.id]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (usr) => {
      if (usr) {
        setUID(usr.uid);
        setName(usr.displayName);
      } else {
        navigation.navigate("SignIn");
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const onSend = useCallback(
    async (m = []) => {
      const newMessage = m[0];
      await addDoc(chatsRef, {
        ...newMessage,
        createdAt: new Date(),
      });
    },
    [route.params.id, messages]
  );

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: uid,
        name: name,
      }}
      multiline={false}
      renderBubble={renderBubble}
      scrollToBottom
      scrollToBottomComponent={scrollToBottomComponent}
      renderInputToolbar={renderInputToolbar}
      renderSend={renderSend}
    />
  );
};

export default Chat;
