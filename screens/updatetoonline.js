const { MongoClient, ServerApiVersion } = require("mongodb");
const fs = require("fs");
const readline = require("readline");
//const uri = "mongodb+srv://chengyi:Chuachengyi123@suricata.mzv9hvz.mongodb.net/?retryWrites=true&w=majority&appName=Suricata";
const uri =
  "mongodb+srv://admin:admin123@mobileids.hnmvzn9.mongodb.net/?retryWrites=true&w=majority&appName=mobileids";

const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB.");

    // Specify the database and collection
    const database = client.db("Suricata");
    const collection = database.collection("Logs");

    // Create an interface for reading from eve.json
    const fileStream = fs.createReadStream(
      "//wsl$/Ubuntu/var/log/suricata/eve.json"
    );
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    const documents = [];

    // Read and parse each line of the eve.json file
    for await (const line of rl) {
      try {
        const doc = JSON.parse(line);
        documents.push(doc);
      } catch (parseError) {
        console.error("Error parsing line:", parseError);
      }
    }

    // Insert the documents into the collection
    if (documents.length > 0) {
      const result = await collection.insertMany(documents);
      console.log(`${result.insertedCount} documents were inserted.`);
    } else {
      console.log("No documents to insert.");
    }
  } catch (err) {
    console.error("An error occurred:", err);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
