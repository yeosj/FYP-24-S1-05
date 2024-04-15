import React from "react";

const EventsDisplay = ({ eventsData }) => {
  // Filter eventsData to only include events with an event_type of "alert"
  const alertEvents = eventsData.filter(
    (event) => event.event_type === "alert"
  );

  return (
    <div>
      {alertEvents.map((event, index) => (
        <div
          key={index}
          style={{
            marginBottom: "20px",
            padding: "10px",
            border: "1px solid #ccc",
          }}
        >
          <h3>Alert Event {index + 1}</h3>
          <p>
            <strong>Timestamp:</strong> {event.timestamp}
          </p>
          <p>
            <strong>Source IP:</strong> {event.src_ip}
          </p>
          <p>
            <strong>Destination IP:</strong> {event.dest_ip}
          </p>
          {/* Display additional details about the alert */}
          <div>
            <h4>Alert Details</h4>
            <p>
              <strong>Action:</strong> {event.alert.action}
            </p>
            <p>
              <strong>Signature:</strong> {event.alert.signature}
            </p>
            <p>
              <strong>Category:</strong> {event.alert.category}
            </p>
            {/* Similarly for other nested fields */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventsDisplay;
