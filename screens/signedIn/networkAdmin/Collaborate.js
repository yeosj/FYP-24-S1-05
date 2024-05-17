import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ChatList from "../chat/ChatList";
import Chat from "../chat/Chat";
import CreateChat from "../chat/CreateChat";

const Stack = createStackNavigator();

const Collaborate = () => {
  return (
    <Stack.Navigator initialRouteName="ChatList">
      <Stack.Screen
        name="ChatList"
        component={ChatList}
        options={{ title: "Chats" }}
      />
      <Stack.Screen name="Chat" component={Chat} options={{ title: "Chat" }} />
      <Stack.Screen
        name="CreateChat"
        component={CreateChat}
        options={{ title: "New Chat" }}
      />
    </Stack.Navigator>
  );
};

export default Collaborate;
