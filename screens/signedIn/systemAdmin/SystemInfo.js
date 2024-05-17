import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import { firebase } from "../../../Firebase/firebase";

// Individual component for device information
const DeviceInfo = ({ label, value }) => (
  <View style={styles.infoContainer}>
    <Text style={styles.label}>{label}</Text>
    <Text>{value}</Text>
  </View>
);
const SystemInfo = () => {
  const [systemInfo, setSystemInfo] = useState(null);

  useEffect(() => {
    // Function to fetch system information from Firebase Firestore
    const fetchSystemInfo = async () => {
      try {
        // Get the current user
        const currentUser = firebase.auth().currentUser;
        if (currentUser) {
          // Fetch the system information for the current user from Firestore
          const userId = currentUser.uid;
          const snapshot = await firebase
            .firestore()
            .collection("users")
            .doc(userId)
            .collection("devices")
            .get();

          // Extract and set the system information
          const systemInfoData = snapshot.docs.map((doc) => doc.data());
          setSystemInfo(systemInfoData);
        }
      } catch (error) {
        console.error("Error fetching system information:", error);
      }
    };

    // Call the fetchSystemInfo function when the component mounts
    fetchSystemInfo();

    // Clean up function to unsubscribe from Firebase listener
    return () => {
      setSystemInfo(null); // Reset systemInfo state
    };
  }, []); // Empty dependency array to run the effect only once

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>System Information</Text>
      <FlatList
        data={systemInfo}
        renderItem={({ item }) => (
          <View>
            <DeviceInfo label="Device Name" value={item.designName} />
            <DeviceInfo label="Brand" value={item.brand} />
            <DeviceInfo
              label="Rooted"
              value={item.isRootedExperimentalAsync ? "Yes" : "No"}
            />
            <DeviceInfo label="Platform API" value={item.platformApiLevel} />
            <DeviceInfo label="Product Name" value={item.productName} />
            <DeviceInfo label="Uptime" value={item.uptime} />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  infoContainer: {
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
  },
});

export default SystemInfo;
