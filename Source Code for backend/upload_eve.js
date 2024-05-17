const chokidar = require('chokidar');
const fs = require('fs');
const readline = require('readline');
const admin = require('firebase-admin');

// Load Firebase service account credentials
const serviceAccount = require('/etc/suricata-firebase/login-app-13fff-firebase-adminsdk-fxanp-17b5e15a0e.json');

// Initialize the Firebase app
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Initialize Firestore
const db = admin.firestore();
const alertsCollection = db.collection('FYP_suricata_alerts'); // Change to your desired collection name

const monitoredFile = '/var/log/suricata/alerts.json';

// Keep track of the last processed offset to upload only new alerts
let lastOffset = 0;

// Function to process new alerts and upload to Firestore
async function processNewAlerts(filePath, startOffset) {
  const fileStream = fs.createReadStream(filePath, { start: startOffset });
  const rl = readline.createInterface({ input: fileStream });

  let currentOffset = startOffset;

  // Prefix to remove before JSON parsing
  const prefix = '@GCP: ';

  for await (const line of rl) {
    currentOffset += Buffer.byteLength(line, 'utf8') + 1; // +1 for newline character

    let cleanLine = line;

    // Remove the prefix if it exists
    if (cleanLine.startsWith(prefix)) {
      cleanLine = cleanLine.slice(prefix.length);
    }

    try {
      // Parse the cleaned line as JSON
      const alert = JSON.parse(cleanLine);
      await alertsCollection.add(alert); // Upload to Firestore
    } catch (error) {
      console.error('Error parsing or uploading alert:', error.message, 'Line:', line);
    }
  }

  return currentOffset; // Return the new offset for the next read
}

// Monitor the eve.json file for changes
const watcher = chokidar.watch(monitoredFile, {
  persistent: true,
  ignoreInitial: true
});

// Trigger the upload when the file is changed or appended
watcher.on('change', async (path) => {
  console.log(`File ${path} has been changed. Uploading new alerts to Firestore...`);
  lastOffset = await processNewAlerts(path, lastOffset);
});