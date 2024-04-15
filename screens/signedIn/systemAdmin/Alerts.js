import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Button,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import { firebase } from "../../../Firebase/suricatalogs";
import { Ionicons } from "@expo/vector-icons";

const Alerts = () => {
  const [alertData, setAlertData] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [showUnread, setShowUnread] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allAlertsLoaded, setAllAlertsLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, [showUnread]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const logsRef = firebase.firestore().collection("Alerts");
      let query = logsRef.orderBy("timestamp", "desc").limit(10);

      if (lastVisible) {
        query = query.startAfter(lastVisible);
      }

      const snapshot = await query.get();

      const logsData = snapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });

      if (lastVisible) {
        setAlertData([...alertData, ...logsData]);
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

  const loadMore = async () => {
    try {
      if (!loading && !allAlertsLoaded) {
        setLoading(true);
        const logsRef = firebase.firestore().collection("Alerts");
        let query = logsRef.limit(10);

        if (showUnread) {
          query = query.where("read", "==", false);
        }

        query = query.orderBy("timestamp", "desc");

        if (lastVisible) {
          query = query.startAfter(lastVisible);
        }

        const snapshot = await query.get();

        const logsData = snapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });

        setAlertData([...alertData, ...logsData]);

        if (snapshot.docs.length > 0) {
          setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        } else {
          setAllAlertsLoaded(true);
        }
      }
    } catch (error) {
      console.error("Error fetching more data:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      const batch = firebase.firestore().batch();
      const snapshot = await firebase
        .firestore()
        .collection("Alerts")
        .where("read", "==", false)
        .get();

      snapshot.docs.forEach((doc) => {
        const docRef = firebase.firestore().collection("Alerts").doc(doc.id);
        batch.update(docRef, { read: true });
      });

      await batch.commit();
      showToast("All messages marked as read");
    } catch (error) {
      console.error("Error marking all as read:", error);
      showToast("Error marking messages as read");
    }
  };
  const showToast = (message) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    }
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
    switch (item.alert.severity) {
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
        label = "Unknown";
        color = "black";
    }
    return { label, color };
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.itemContainer,
        { backgroundColor: item.read ? "#FFF" : "#FEE" },
      ]}
    >
      <View style={styles.readIndicator}></View>
      <Text style={styles.itemTitle}>Alert</Text>
      <View style={styles.alertDetails}>
        <View style={styles.alertDetailItem}>
          <Text style={styles.detailLabel}>Signature:</Text>
          <Text style={styles.detailText}>{item.alert?.signature}</Text>
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

  // const renderFooter = () => (
  //   <View style={{ alignItems: "center", marginVertical: 20 }}>
  //     <Button title="Load More" onPress={loadMore} />
  //   </View>
  // );

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity style={styles.refreshControl} onPress={onRefresh}>
        <Ionicons name="refresh" size={24} color="black" />
      </TouchableOpacity>

      <FlatList
        data={alertData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() =>
          loading && !allAlertsLoaded ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : null
        }
      />
    </View>
  );
};
const styles = StyleSheet.create({
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "green", // Adjust color as needed
    marginRight: 10,
  },
  severityContainer: {
    backgroundColor: "red", // default background color
    borderRadius: 5, // adjust the border radius as needed
    paddingHorizontal: 5, // adjust padding as needed
    marginVertical: 2, // adjust margin as needed
  },
  severityText: {
    color: "black", // text color
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
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
  tabItem: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "black",
  },
  activeTabText: {
    fontWeight: "bold",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
  },
  readIndicator: {
    width: 5,
    height: "100%",
    marginRight: 10,
    backgroundColor: "#FF6347", // Adjust color as needed
  },
});

export default Alerts;
