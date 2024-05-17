import { db } from "../../../Firebase/firebase";

// Function to log an event
const logEvent = async (event) => {
  try {
    await db.collection("systemLogs").add({
      timestamp: new Date(),
      user: event.user,
      action: event.action,
      details: event.details,
    });
    console.log("Event logged successfully");
  } catch (error) {
    console.error("Error logging event:", error);
  }
};

// Function to retrieve logs
export const getLogs = async () => {
  try {
    const logs = await db
      .collection("systemLogs")
      .orderBy("timestamp", "desc")
      .get();
    return logs.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("Error retrieving logs:", error);
    return [];
  }
};
