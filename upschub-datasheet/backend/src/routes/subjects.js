const express = require("express");
const { db } = require("../config/firebaseAdmin");
const router = express.Router();

// GET all subjects (or by query)
router.get("/", async (req, res) => {
    try {
        const snapshot = await db.collection("subjects").get();
        const subjects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json({ subjects });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET subject by id
router.get("/:id", async (req, res) => {
    try {
        const doc = await db.collection("subjects").doc(req.params.id).get();
        if (!doc.exists) {
            return res.status(404).json({ error: "Subject not found." });
        }
        res.json({ subject: { id: doc.id, ...doc.data() } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST new subject (admin only)
router.post("/", requireAdmin, async (req, res) => {
    const { name, icon, totalChapters } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Name is required." });
    }

    try {
        const ref = await db.collection("subjects").add({
            name,
            icon: icon || "📄",
            totalChapters: totalChapters || 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
        res.status(201).json({ id: ref.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update subject
router.put("/:id", requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { name, icon, totalChapters } = req.body;

    try {
        const ref = db.collection("subjects").doc(id);
        await ref.update({
            ...(name !== undefined && { name }),
            ...(icon !== undefined && { icon }),
            ...(totalChapters !== undefined && { totalChapters }),
            updatedAt: new Date().toISOString(),
        });
        res.json({});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;