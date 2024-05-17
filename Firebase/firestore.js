import { db } from "./firebase";

// Function to add a device
export const addDevice = async (deviceData) => {
  try {
    const docRef = await db.collection("devices").add(deviceData);
    console.log("Device added with ID:", docRef.id);
  } catch (error) {
    console.error("Error adding device:", error);
  }
};

// Function to remove a device
export const removeDevice = async (deviceId) => {
  try {
    await db.collection("devices").doc(deviceId).delete();
    console.log("Device removed");
  } catch (error) {
    console.error("Error removing device:", error);
  }
};
