import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList } from "react-native";
import { firebase } from "../../../Firebase/firebase"; // Ensure this path is correct

const Current = () => {
  const [users, setUsers] = useState([]);
  const currentUserId = firebase.auth().currentUser?.uid;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await firebase
        .firestore()
        .collection("users")
        .get();
      const usersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Users fetched successfully:", usersList);
      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const toggleUserActiveStatus = async (userId, isActive, userRole) => {
    if (userId === currentUserId) {
      Alert.alert(
        "Action Forbidden",
        "You cannot toggle your own active status."
      );
      return;
    }

    if (userRole === "network admin") {
      Alert.alert(
        "Action Forbidden",
        "You cannot toggle the active status of network admins."
      );
      return;
    }

    try {
      await firebase.firestore().doc(`users/${userId}`).update({
        isActive: !isActive,
      });
      const updatedUsers = users.map((user) =>
        user.id === userId ? { ...user, isActive: !isActive } : user
      );
      setUsers(updatedUsers);
      console.log("User active status updated:", userId, !isActive);
    } catch (error) {
      console.error("Failed to toggle user active status:", error);
      Alert.alert("Error", "Failed to toggle user active status.");
    }
  };

  return (
    <View>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
            }}
          >
            <Text>
              {item.firstName} {item.lastName} - Active:{" "}
              {item.isActive ? "Yes" : "No"}
            </Text>
            <Button
              title="Toggle Active Status"
              onPress={() => toggleUserActiveStatus(item.id, item.isActive)}
            />
          </View>
        )}
      />
    </View>
  );
};

export default Current;
