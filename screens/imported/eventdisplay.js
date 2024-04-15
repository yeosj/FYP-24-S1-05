import React from "react";
import { View, Text, StyleSheet } from "react-native";

const EventsDisplay = ({ eventsData }) => {
  return (
    <View>
      {eventsData.map((event, index) => (
        <View key={index} style={styles.container}>
          <Text style={styles.title}>Event {index + 1}</Text>
          <Text>
            <Text style={styles.label}>Timestamp: </Text>
            {event.timestamp}
          </Text>
          <Text>
            <Text style={styles.label}>Event Type: </Text>
            {event.event_type}
          </Text>
          <Text>
            <Text style={styles.label}>Source IP: </Text>
            {event.src_ip}
          </Text>
          <Text>
            <Text style={styles.label}>Destination IP: </Text>
            {event.dest_ip}
          </Text>
          {/* Add more fields as needed */}
          {event.alert && (
            <View>
              <Text style={styles.subTitle}>Alert Details</Text>
              <Text>
                <Text style={styles.label}>Action: </Text>
                {event.alert.action}
              </Text>
              <Text>
                <Text style={styles.label}>Signature: </Text>
                {event.alert.signature}
              </Text>
              <Text>
                <Text style={styles.label}>Category: </Text>
                {event.alert.category}
              </Text>
              {/* Similarly for other nested fields */}
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 10,
  },
  label: {
    fontWeight: "bold",
  },
});

export default EventsDisplay;
