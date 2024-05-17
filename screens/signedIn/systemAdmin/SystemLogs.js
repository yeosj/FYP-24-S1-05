import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TextInput } from "react-native";
import { db, firebase } from "../../../Firebase/firebase";

const SystemLogs = () => {
  const [logs, setLogs] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const user = firebase.auth().currentUser;
        if (user) {
          const userDoc = await db.collection("users").doc(user.uid).get();
          if (userDoc.exists) {
            setUserRole(userDoc.data().userRole);
          }
        }
      } catch (error) {
        console.error("Error fetching user role: ", error);
      }
    };

    const fetchLogs = async () => {
      try {
        const querySnapshot = await db
          .collection("suricata_syslog")
          .orderBy("timestamp", "desc")
          .get();
        const logsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLogs(logsData);
      } catch (error) {
        console.error("Error fetching logs: ", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchData = async () => {
      await fetchUserRole();
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (userRole === "system admin" || userRole === "network admin") {
      fetchLogs();
    } else {
      setLoading(false);
    }
  }, [userRole]);

  const fetchLogs = async () => {
    try {
      const querySnapshot = await db
        .collection("suricata_syslog")
        .orderBy("timestamp", "desc")
        .get();
      const logsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLogs(logsData);
    } catch (error) {
      console.error("Error fetching logs: ", error);
    }
  };

  const filteredLogs = logs.filter((log) =>
    log.log.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search logs..."
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
      <ScrollView>
        {filteredLogs.map((log) => (
          <View key={log.id} style={styles.logEntry}>
            <Text style={styles.logText}>
              Date: {new Date(log.timestamp.seconds * 1000).toLocaleString()}
            </Text>
            <Text style={styles.logText}>Log: {log.log}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  logEntry: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  logText: {
    marginBottom: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SystemLogs;
