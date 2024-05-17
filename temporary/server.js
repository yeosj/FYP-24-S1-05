// server.js
const express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");

const app = express();
const port = process.env.PORT || 3000;

// Initialize Firebase Admin
const serviceAccount = require("../login-app-13fff-firebase-adminsdk-fxanp-fbf624de44.json"); // Update the path to your Firebase admin SDK

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://your-https://console.firebase.google.com/u/0/project/login-app-13fff/overview?consoleUI=FIREBASE-id.firebaseio.com", // Replace with your Firebase database URL
});

// Middlewares
app.use(bodyParser.json());

// Define routes
app.post("/collect", (req, res) => {
  const data = req.body;
  // Process and store the data in Firebase or perform any analysis
  admin
    .firestore()
    .collection("interactions")
    .add(data)
    .then(() => res.status(200).send("Data stored successfully"))
    .catch((error) => res.status(500).send(error.message));
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
