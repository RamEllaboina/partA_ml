const admin = require('firebase-admin');
const firebase = require('firebase/app');
const dotenv = require('dotenv');

dotenv.config();

// Check if environment variables are loaded
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
if (!serviceAccountPath) {
    console.error('ERROR: FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set');
    console.error('Please copy .env.example to .env and configure your Firebase settings');
    process.exit(1);
}

try {
    var serviceAccount = require(serviceAccountPath);
} catch (error) {
    console.error('ERROR: Cannot load service account key file:', serviceAccountPath);
    console.error('Please ensure the file exists and is valid JSON');
    process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

// Initialize Firebase Client SDK
const firebaseConfig = {
  apiKey: "AIzaSyDnX4esFOPT-O0c7G7hH3-4BdPZG8OtwsI",
  authDomain: "employee-system-d8369.firebaseapp.com",
  databaseURL: "https://employee-system-d8369-default-rtdb.firebaseio.com",
  projectId: "employee-system-d8369",
  storageBucket: "employee-system-d8369.firebasestorage.app",
  messagingSenderId: "213480206525",
  appId: "1:213480206525:web:12a3bb13f6c90faa3987d4",
  measurementId: "G-G5Z1B4J7MQ"
};

firebase.initializeApp(firebaseConfig);

module.exports = {
  admin,
  firebase,
  db: admin.database(),
  firestore: admin.firestore(),
  auth: admin.auth()
};
