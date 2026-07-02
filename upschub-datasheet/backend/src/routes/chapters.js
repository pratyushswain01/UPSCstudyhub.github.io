const express = require("express");
const { db } = require("../config/firebaseAdmin");
const router = express.Router();

// GET chapters by subjectId
router.get("/subject/:subjectId", async (req, res) => {
    const { subjectId } = req.params;
    try {
        const snapshot = await db
            .collection("subjects")
            .doc(subjectId)
            .collection("chapters")
            .get();

        const chapters = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json({ chapters });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST new chapter
router.post("/", requireAdmin, async (req, res) => {
    const { subjectId, chapterName, number } = req.body;

    if (!subjectId || !chapterName || number === undefined) {
        return res.status(400).json({ error: "subjectId, chapterName, number required." });
    }

    try {
        const ref = await db
            .collection("subjects")
            .doc(subjectId)
            .collection("chapters")
            .add({
                subjectId,
                chapterName,
                number,
                resources: 0,
                completed: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
        res.status(201).json({ id: ref.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update chapter
router.put("/:id", requireAdmin, async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const ref = db.collection("chapters").doc(id);
        await ref.update({
            ...updates,
            updatedAt: new Date().toISOString(),
        });
        res.json({});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;