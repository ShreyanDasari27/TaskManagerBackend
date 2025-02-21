const express = require("express");
const admin = require("firebase-admin");
const { initializeApp } = require("firebase/app");
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require("firebase/auth");
const { getFirestore, collection, addDoc, getDocs, query, where } = require("firebase/firestore");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Load Firebase Admin credentials
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log("Connected to Firebase Admin SDK!");

// Firebase client-side configuration
const firebaseConfig = {
  apiKey: "AIzaSyCN1Op4gNcFCdJVrmZyZ36PEcJYBZVa6Mo",
  authDomain: "taskmanagerapp-e0707.firebaseapp.com",
  projectId: "taskmanagerapp-e0707",
  storageBucket: "taskmanagerapp-e0707.appspot.com",
  messagingSenderId: "812471834156",
  appId: "1:812471834156:web:b54a94c3b78e5ae03b2389",
  measurementId: "G-TD5CHYQ5RM",
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

console.log("Firebase App initialized!");

// Middleware to parse JSON data
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Routes to serve HTML pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/tasks", (req, res) => {
  res.sendFile(path.join(__dirname, "tasks.html"));
});

// API Route for User Signup
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    res.json({ message: "User created successfully!", user: userCredential.user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// API Route for User Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    res.json({ message: "Login successful!", user: userCredential.user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
