const { db } = require("../config/firebaseAdmin");

const requireAdmin = async (req, res, next) => {
    const uid = req.user.uid;

    try {
        const userDoc = await db.collection("users").doc(uid).get();
        if (!userDoc.exists) {
            return res.status(403).json({ error: "User not found." });
        }

        const role = userDoc.data().role || "student";
        if (role !== "admin") {
            return res.status(403).json({ error: "Admin role required." });
        }

        next();
    } catch (err) {
        return res.status(500).json({ error: "Failed to verify admin role." });
    }
};

module.exports = requireAdmin;