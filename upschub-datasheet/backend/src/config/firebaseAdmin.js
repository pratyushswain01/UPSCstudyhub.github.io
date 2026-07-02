const admin = require("firebase-admin");
const fs = require("fs");
require("dotenv").config();

const serviceAccountPath = process.env.FIREBASE_PRIVATE_KEY_FILE;

if (!fs.existsSync(serviceAccountPath)) {
    throw new Error(`Service account key file not found: ${serviceAccountPath}`);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID,
});

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

module.exports = { db, auth, storage };