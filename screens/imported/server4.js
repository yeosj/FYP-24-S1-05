const express = require("express");
const cors = require("cors");
const fs = require("fs");
const readline = require("readline");
const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  writeBatch,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} = require("firebase/firestore/lite");

const app = express();
const PORT = 3001;

app.use(cors()); // Enable CORS

const firebaseConfig = {
  apiKey: "AIzaSyAh3tSaWVLkQnuOZKZTotzbm1PMVimiQxc",
  authDomain: "login-app-13fff.firebaseapp.com",
  projectId: "login-app-13fff",
  storageBucket: "login-app-13fff.appspot.com",
  messagingSenderId: "559655406635",
  appId: "1:559655406635:web:ae5d15ca338da233f1ee6e",
};

// Initialize Firebase and Firestore
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

function createNewBatch() {
  return writeBatch(db);
}

async function parseAndUploadLogs(filePath) {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let batch = createNewBatch();
  let batchCounter = 0;
  let totalInserted = 0;

  for await (const line of rl) {
    try {
      const docData = JSON.parse(line);
      if (docData.timestamp) {
        const newDocRef = doc(db, "Alerts", docData.timestamp.toString());
        batch.set(newDocRef, docData);
        batchCounter++;
        totalInserted++;

        if (batchCounter === 500) {
          await batch.commit();
          console.log(`${batchCounter} documents were inserted.`);
          batch = createNewBatch();
          batchCounter = 0;
        }
      }
    } catch (parseError) {
      console.error("Error parsing line:", parseError);
    }
  }

  if (batchCounter > 0) {
    await batch.commit();
    console.log(`${batchCounter} documents were inserted in the final batch.`);
  }

  console.log(`${totalInserted} total documents were uploaded to Firestore.`);
}

const EVE_JSON_PATH = "/Users/shijie/Desktop/Ubuntu_Suricata/alerteve.json";
parseAndUploadLogs(EVE_JSON_PATH);

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
