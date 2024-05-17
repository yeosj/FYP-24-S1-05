import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Button,
  ScrollView,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { db } from "../../../Firebase/firebase";
import DateTimePicker from "@react-native-community/datetimepicker";

const Dashboard = () => {
  const [signatureCounts, setSignatureCounts] = useState([]);
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 30))
  ); // Default start date 30 days ago
  const [endDate, setEndDate] = useState(new Date()); // Default end date is today
  const [loading, setLoading] = useState(true);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      console.log("Fetching alerts from", startDate, "to", endDate); // Debug log

      try {
        const startDateString = startDate.toISOString();
        const endDateString = endDate.toISOString();

        const alertsRef = db.collection("FYP_suricata_alerts");
        const snapshot = await alertsRef
          .where("timestamp", ">=", startDateString)
          .where("timestamp", "<=", endDateString)
          .get();

        if (snapshot.empty) {
          console.log("No matching documents.");
          setSignatureCounts([]);
          setLoading(false);
          return;
        }

        const alertsData = snapshot.docs
          .map((doc) => {
            const data = doc.data();
            if (data.alert) {
              return data.alert;
            } else if (data.anomaly) {
              return { signature: `Anomaly: ${data.anomaly.event}` };
            } else {
              console.warn("Missing alert or anomaly in document:", data);
              return null;
            }
          })
          .filter((alert) => alert !== null);

        const counts = alertsData.reduce((acc, alert) => {
          if (alert.signature) {
            const signature = alert.signature;
            if (!acc[signature]) {
              acc[signature] = 0;
            }
            acc[signature]++;
          } else {
            console.warn("Missing signature in alert:", alert);
          }
          return acc;
        }, {});

        console.log("Counts:", counts); // Debug log

        const formattedData = Object.entries(counts).map(([key, value]) => ({
          name: key,
          count: value,
          color: getRandomColor(), // Assign a random color
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        }));

        setSignatureCounts(formattedData);
      } catch (error) {
        console.error("Error fetching alerts: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [startDate, endDate]);

  const getRandomColor = () => {
    let color = Math.floor(Math.random() * 16777215).toString(16);
    while (color.length < 6) {
      color = "0" + color;
    }
    return "#" + color;
  };

  const onChangeStart = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartPicker(false);
    setStartDate(currentDate);
  };

  const onChangeEnd = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndPicker(false);
    setEndDate(currentDate);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Attack Signatures</Text>

        <Button
          onPress={() => setShowStartPicker(true)}
          title="Select Start Date"
        />
        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={onChangeStart}
          />
        )}

        <Button
          onPress={() => setShowEndPicker(true)}
          title="Select End Date"
        />
        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={onChangeEnd}
          />
        )}

        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <>
            <PieChart
              data={signatureCounts}
              width={Dimensions.get("window").width - 40}
              height={220}
              chartConfig={{
                backgroundColor: "#1cc910",
                backgroundGradientFrom: "#eff3ff",
                backgroundGradientTo: "#efefef",
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              accessor="count"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
            <View style={styles.countContainer}>
              {signatureCounts.map((item, index) => (
                <Text key={index} style={styles.countText}>
                  {item.name}: {item.count}
                </Text>
              ))}
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  datePicker: {
    width: 200,
    marginBottom: 20,
  },
  countContainer: {
    marginTop: 20,
    width: "100%",
    paddingHorizontal: 20,
  },
  countText: {
    fontSize: 16,
    marginVertical: 5,
  },
});

export default Dashboard;
