const express = require("express");
const fs = require("fs");
const cors = require("cors");
const readline = require("readline");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = 3001;

app.use(cors()); // Enable CORS

async function run() {
  const uri =
    "mongodb+srv://chengyi:Chuachengyi123@suricata.mzv9hvz.mongodb.net/";
  const client = new MongoClient(uri);
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB.");

    const database = client.db("Suricata");
    const collection = database.collection("Logs");

    const fileStream = fs.createReadStream(
      "D://UOW//CSIT321//Suricata//eve.json"
    );
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    const operations = [];

    for await (const line of rl) {
      try {
        const doc = JSON.parse(line);
        // Check if the event_type is "alert"
        if (doc.event_type === "alert") {
          // Push an upsert operation for the document
          operations.push({
            updateOne: {
              filter: { timestamp: doc.timestamp }, // unique identifier in your document
              update: { $set: doc },
              upsert: true,
            },
          });
        }
      } catch (parseError) {
        console.error("Error parsing line:", parseError);
      }
    }

    // Execute the bulk operation
    if (operations.length > 0) {
      const result = await collection.bulkWrite(operations);
      console.log(`${result.upsertedCount} documents were updated.`);
    } else {
      console.log("No operations to perform.");
    }
  } catch (err) {
    console.error("An error occurred:", err);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);

const EVE_JSON_PATH = "D://UOW//CSIT321//Suricata//eve.json";

// Watch the EVE_JSON_PATH file for changes and update MongoDB accordingly
let timeoutId = null;
let isUpdating = false;

fs.watch(EVE_JSON_PATH, (eventType) => {
  if (eventType === "change" && !isUpdating) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(async () => {
      isUpdating = true;
      console.log("eve.json has been changed. Updating MongoDB...");
      await run().catch(console.dir);
      isUpdating = false;
    }, 1000); // Adjust debounce time as needed
  }
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
