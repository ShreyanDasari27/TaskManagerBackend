const express = require("express");
const admin = require("firebase-admin");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Load Firebase Admin credentials from an environment variable
// Make sure that process.env.FIREBASE_CONFIG contains a valid JSON string.
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Optionally, set the databaseURL if needed:
  // databaseURL: "https://<your-project-id>.firebaseio.com"
});

console.log("Connected to Firebase Admin SDK!");

// Firebase configuration (used only for REST API calls during login)
const firebaseConfig = {
  apiKey: "AIzaSyCN1Op4gNcFCdJVrmZyZ36PEcJYBZVa6Mo",
  authDomain: "taskmanagerapp-e0707.firebaseapp.com",
  projectId: "taskmanagerapp-e0707",
  storageBucket: "taskmanagerapp-e0707.appspot.com",
  messagingSenderId: "812471834156",
  appId: "1:812471834156:web:b54a94c3b78e5ae03b2389",
  measurementId: "G-TD5CHYQ5RM",
};

// Use Firebase Admin Firestore
const db = admin.firestore();
console.log("Firebase Firestore initialized!");

// Middleware to parse JSON data
app.use(express.json());

// Serve static files (HTML, CSS, JS) from the current directory
app.use(express.static(path.join(__dirname)));

// Routes to serve HTML pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/tasks", (req, res) => {
  res.sendFile(path.join(__dirname, "tasks.html"));
});

// API Route for User Signup using admin.auth()
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });
    res.json({ message: "User created successfully!", user: userRecord });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(400).json({ error: error.message });
  }
});

// API Route for User Login using Firebase Auth REST API
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseConfig.apiKey}`,
      {
        email,
        password,
        returnSecureToken: true,
      }
    );
    res.json({ message: "Login successful!", user: response.data });
  } catch (error) {
    console.error("Login error:", error.response.data);
    res.status(400).json({ error: error.response.data.error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
