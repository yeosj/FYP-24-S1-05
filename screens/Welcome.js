import { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { firebase } from "../config";

const Welcome = () => {
  const [users, setUsers] = useState([]);
  const timestampRef = firebase.firestore().collection("timestamp");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await timestampRef.get();
        const usersData = [];
        querySnapshot.forEach((doc) => {
          const { stamp, time } = doc.data();
          usersData.push({
            id: doc.id,
            time,
            stamp,
          });
        });
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    return () => {};
  }, []);

  return (
    <View style={{ flex: 1, marginTop: 100 }}>
      <Text style={{ fontWeight: "bold" }}>Log</Text>
      <FlatList
        style={{ height: "100%" }}
        data={users}
        numColumns={1}
        renderItem={({ item }) => (
          <Pressable onPress={() => console.log("Item pressed")}>
            <View
              style={{
                padding: 20,
                borderBottomWidth: 1,
                borderBottomColor: "lightgray",
              }}
            >
              <Text>{item.time}</Text>
              <Text>{item.stamp}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
};

export default Welcome;
