require("dotenv").config(); // Load environment variables from .env file
const firebase = require("firebase-admin");
const path = require("path");

// Initialize Firebase Admin SDK using credentials from the environment variables
const firebaseConfig = {
  credential: firebase.credential.cert(
    require(process.env.FIREBASE_CREDENTIALS_PATH)
  ),
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
};

// Initialize Firebase Admin SDK if it hasn't been initialized yet
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // Use the default app if already initialized
}

module.exports = firebase;
