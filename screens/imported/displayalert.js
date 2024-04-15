import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

const EventsDisplay = ({ eventsData }) => {
  // Filter eventsData to only include events with an event_type of "alert"
  const alertEvents = eventsData.filter(
    (event) => event.event_type === "alert"
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {alertEvents.map((event, index) => (
        <View key={index} style={styles.eventContainer}>
          <Text style={styles.heading}>Alert Event {index + 1}</Text>
          <Text style={styles.info}>
            <Text style={styles.label}>Timestamp:</Text> {event.timestamp}
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>Source IP:</Text> {event.src_ip}
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>Destination IP:</Text> {event.dest_ip}
          </Text>
          {/* Display additional details about the alert */}
          <View>
            <Text style={styles.subheading}>Alert Details</Text>
            <Text style={styles.info}>
              <Text style={styles.label}>Action:</Text> {event.alert.action}
            </Text>
            <Text style={styles.info}>
              <Text style={styles.label}>Signature:</Text>{" "}
              {event.alert.signature}
            </Text>
            <Text style={styles.info}>
              <Text style={styles.label}>Category:</Text> {event.alert.category}
            </Text>
            {/* Similarly for other nested fields */}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  eventContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subheading: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  info: {
    fontSize: 14,
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
  },
});

export default EventsDisplay;
