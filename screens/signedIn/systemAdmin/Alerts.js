import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ToastAndroid,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { firebase } from "../../../Firebase/suricatalogs";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../../signedIn/context/ThemeContext";
import messaging from "@react-native-firebase/messaging";

const Alerts = () => {
  const [alertData, setAlertData] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [showUnread, setShowUnread] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allAlertsLoaded, setAllAlertsLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    fetchAlerts();
  }, [showUnread]);

  const getFCMToken = () => {
    messaging()
      .getToken()
      .then((token) => {
        console.log("token=>>>", token);
      });
  };
  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const logsRef = firebase.firestore().collection("FYP_suricata_alerts");
      let query = logsRef.orderBy("timestamp", "desc");

      if (showUnread) {
        query = query.where("read", "==", false);
      }

      if (lastVisible) {
        query = query.startAfter(lastVisible);
      }

      const snapshot = await query.limit(10).get();

      const logsData = snapshot.docs.map((doc) => {
        const data = doc.data();
        const alert = data.alert || {};
        return {
          id: doc.id,
          ...alert,
          src_ip: data.src_ip,
          src_port: data.src_port,
          timestamp: data.timestamp,
          read: data.read,
        };
      });

      if (lastVisible) {
        setAlertData((prevAlerts) => [...prevAlerts, ...logsData]);
      } else {
        setAlertData(logsData);
      }

      if (snapshot.docs.length > 0) {
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      } else {
        setAllAlertsLoaded(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      const batch = firebase.firestore().batch();
      alertData.forEach((alert) => {
        if (!alert.read) {
          const alertRef = firebase
            .firestore()
            .collection("FYP_suricata_alerts")
            .doc(alert.id);
          batch.update(alertRef, { read: true });
        }
      });

      await batch.commit();
      setAlertData(alertData.map((alert) => ({ ...alert, read: true })));
      showToast("All messages marked as read");
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const showToast = (message) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    }
  };

  const toggleShowUnread = () => {
    setShowUnread(!showUnread);
    setLastVisible(null); // Reset pagination
    setAlertData([]); // Clear current alerts
    setAllAlertsLoaded(false); // Reset all alerts loaded
  };

  const renderTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return <Text>{`${diffMinutes} minutes ago`}</Text>;
      } else {
        return <Text>{`${diffHours} hours ago`}</Text>;
      }
    } else if (diffDays === 1) {
      return <Text>Yesterday</Text>;
    } else {
      return <Text>{date.toLocaleDateString()}</Text>;
    }
  };

  const getSeverityColor = (item) => {
    let label, color;
    switch (item.severity) {
      case 1:
        label = "High Risk";
        color = "red";
        break;
      case 2:
        label = "Moderate Risk";
        color = "orange";
        break;
      case 3:
        label = "Low Risk";
        color = "yellow";
        break;
      default:
        label = "Anomaly";
        color = "white";
    }
    return { label, color };
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.itemContainer,
        { backgroundColor: item.read ? "#FFF" : "#FEE" }, // Example of dynamic styling
        { borderColor: theme === "dark" ? "#FFF" : "#333" }, // Theme-based border color
      ]}
    >
      <View style={styles.readIndicator}></View>
      <Text style={styles.itemTitle}>Alert</Text>
      <View style={styles.alertDetails}>
        <View style={styles.alertDetailItem}>
          <Text style={styles.detailLabel}>Signature:</Text>
          <Text style={styles.detailText}>{item.signature}</Text>
        </View>
        <View style={styles.alertDetailItem}>
          <Text style={styles.detailLabel}>Source IP:</Text>
          <Text style={styles.detailText}>{item.src_ip}</Text>
        </View>
        <View style={styles.alertDetailItem}>
          <Text style={styles.detailLabel}>Source Port:</Text>
          <Text style={styles.detailText}>{item.src_port}</Text>
        </View>
        <View style={styles.alertDetailItem}>
          <Text style={styles.detailLabel}>Timestamp:</Text>
          <Text style={styles.detailText}>
            {renderTimestamp(item.timestamp)}
          </Text>
        </View>
        <View style={styles.alertDetailItem}>
          <Text style={styles.detailLabel}>Severity:</Text>
          <View
            style={[
              styles.severityContainer,
              { backgroundColor: getSeverityColor(item).color },
            ]}
          >
            <Text style={styles.severityText}>
              {getSeverityColor(item).label}
            </Text>
          </View>
        </View>
      </View>
      {!item.read && <View style={styles.unreadIndicator} />}
    </View>
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAlerts().then(() => setRefreshing(false));
  }, []);

  const filteredAlerts = alertData.filter((alert) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (alert.signature &&
        alert.signature.toLowerCase().includes(searchLower)) ||
      (alert.src_ip && alert.src_ip.toLowerCase().includes(searchLower)) ||
      (alert.src_port &&
        alert.src_port.toString().toLowerCase().includes(searchLower)) ||
      (alert.timestamp &&
        new Date(alert.timestamp)
          .toLocaleDateString()
          .toLowerCase()
          .includes(searchLower)) ||
      getSeverityColor(alert).label.toLowerCase().includes(searchLower)
    );
  });

  return (
    <View
      style={{ flex: 1, backgroundColor: theme === "dark" ? "#333" : "#FFF" }}
    >
      <View style={styles.controlPanel}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search..."
        />
        {/* Show Unread Button */}
        <TouchableOpacity
          onPress={toggleShowUnread}
          style={styles.toggleButton}
        >
          <Text style={styles.toggleButtonText}>
            {showUnread ? "Show All" : "Show Unread"}
          </Text>
        </TouchableOpacity>
        {/* Mark All as Read Button */}
        <TouchableOpacity onPress={markAllAsRead} style={styles.markReadButton}>
          <Text style={styles.markReadButtonText}>Mark All as Read</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredAlerts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (!allAlertsLoaded) fetchAlerts();
        }}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
};

const styles = StyleSheet.create({
  controlPanel: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    margin: 5,
    width: "40%",
    backgroundColor: "white",
  },
  toggleButton: {
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
  toggleButtonText: {
    color: "#ffffff",
  },
  markReadButton: {
    padding: 10,
    backgroundColor: "#28a745",
    borderRadius: 5,
  },
  markReadButtonText: {
    color: "#ffffff",
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "green",
    marginRight: 10,
  },
  severityContainer: {
    backgroundColor: "red",
    borderRadius: 5,
    paddingHorizontal: 5,
    marginVertical: 2,
  },
  severityText: {
    color: "black",
  },
  itemTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },
  alertDetails: {
    marginLeft: 15,
  },
  alertDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  detailLabel: {
    fontWeight: "bold",
    marginRight: 5,
  },
  detailText: {
    fontSize: 14,
  },
  itemContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  readIndicator: {
    width: 5,
    height: "100%",
    marginRight: 10,
    backgroundColor: "#FF6347",
  },
});

export default Alerts;
