const fs = require("fs");
const readline = require("readline");
const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function readAndInsertNDJSON(filePath) {
  const jsonData = [];
  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    jsonData.push(JSON.parse(line));
  }

  // Now jsonData is fully populated
  console.log("Number of records to insert:", jsonData.length);

  if (jsonData.length > 0) {
    await client.connect();
    const database = client.db("Suricata");
    const collection = database.collection("Log");
    const result = await collection.insertMany(jsonData);
    console.log(`${result.insertedCount} documents were inserted`);
    await client.close();
  } else {
    console.log("No data to insert.");
  }
}

// Replace 'path/to/your/eve.json' with your actual file path
readAndInsertNDJSON(
  "/Users/shijie/Desktop/CSCI321/MobileIDS/mobileids/client/screens/eve.json"
).catch(console.error);
