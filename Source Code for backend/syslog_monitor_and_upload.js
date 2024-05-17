
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
const alertsCollection = db.collection('suricata_syslog'); // Adjusted collection name

const monitoredFile = '/var/log/syslog'; // Changed to syslog

let lastOffset = 0;

// Function to process new alerts from syslog and upload to Firestore
async function processNewAlerts(filePath, startOffset) {
  const fileStream = fs.createReadStream(filePath, { start: startOffset });
  const rl = readline.createInterface({ input: fileStream });

  let currentOffset = startOffset;

  for await (const line of rl) {
    currentOffset += Buffer.byteLength(line, 'utf8') + 1; // +1 for newline character

    if (line.includes('suricata')) { // Check if the line contains the keyword 'suricata'
      try {
        // Extract relevant parts or transform here if needed
        const logEntry = { timestamp: new Date(), log: line };
        await alertsCollection.add(logEntry); // Upload to Firestore
      } catch (error) {
        console.error('Error parsing or uploading log entry:', error);
      }
    }
  }

  return currentOffset; // Return the new offset for the next read
}

// Monitor the syslog file for changes
const watcher = chokidar.watch(monitoredFile, {
  persistent: true,
  ignoreInitial: true
});

// Trigger the upload when the file is changed or appended
watcher.on('change', async (path) => {
  console.log(`File ${path} has been changed. Uploading new log entries to Firestore...`);
  lastOffset = await processNewAlerts(path, lastOffset);
});
