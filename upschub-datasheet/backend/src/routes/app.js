require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { db } = require("./config/firebaseAdmin");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Middleware to verify Firebase ID token
app.use("/api", require("./middleware/verifyToken"));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/subjects", require("./routes/subjects"));
app.use("/api/chapters", require("./routes/chapters"));
app.use("/api/resources", require("./routes/resources"));
app.use("/api/admin", require("./routes/admin"));

// Health check
app.get("/health", (req, res) => {
    res.json({ status: "ok", dbReady: true });
});

app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
    console.log(`Firebase project: ${process.env.FIREBASE_PROJECT_ID}`);
});