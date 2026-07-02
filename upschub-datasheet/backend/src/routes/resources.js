const express = require("express");
const { db, storage } = require("../config/firebaseAdmin");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();

// GET resources by chapterId
router.get("/chapter/:chapterId", async (req, res) => {
    const { chapterId } = req.params;
    try {
        const snapshot = await db
            .collection("chapters")
            .doc(chapterId)
            .collection("resources")
            .get();

        const resources = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json({ resources });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST new resource (upload + meta)
router.post("/", requireAdmin, async (req, res) => {
    const {
        subjectId,
        chapterId,
        title,
        type,
        size,
        thumbnailUrl,
        upload = true,
    } = req.body;

    if (!subjectId || !chapterId || !title || !type) {
        return res.status(400).json({ error: "subjectId, chapterId, title, type required." });
    }

    try {
        const fileName = `${uuidv4()}.pdf`;
        const bucket = storage.bucket();

        let pdfUrl;

        if (upload) {
            // In a real app, you’d receive file via `multer` or client‑side upload.
            // Here we simulate by requiring a `pdfPath` or using your own process.
            // Example ref that you can extend with `multer`:
            // const fileRef = bucket.file(`resources/${fileName}`);
            // await fileRef.save(fileBuffer, { ... });
            // pdfUrl = await fileRef.getSignedUrl({ action: "read", ... });

            // For now, just return a placeholder URL you can plug back into your frontend.
            pdfUrl = `https://storage.googleapis.com/${bucket.name}/resources/${fileName}`;
        } else {
            pdfUrl = req.body.pdfUrl; // if you store pre‑generated URLs in Firestore
        }

        const ref = await db
            .collection("chapters")
            .doc(chapterId)
            .collection("resources")
            .add({
                chapterId,
                title,
                type,
                pdfUrl,
                thumbnail: thumbnailUrl || "/icons/pdf-icon.png",
                size: size || "0 MB",
                uploadedAt: new Date().toISOString(),
            });

        // Update chapter resources count
        const chapterRef = db.collection("chapters").doc(chapterId);
        const chapterSnap = await chapterRef.get();
        if (chapterSnap.exists) {
            await chapterRef.update({
                resources: (chapterSnap.data().resources || 0) + 1,
            });
        }

        res.status(201).json({ id: ref.id, pdfUrl });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE resource
router.delete("/:id", requireAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const ref = db.collection("resources").doc(id);
        const doc = await ref.get();
        if (!doc.exists) {
            return res.status(404).json({ error: "Resource not found." });
        }
        const data = doc.data();

        // Delete from Firestore
        await ref.delete();

        // In real world, you can also delete the file from Storage:
        // const bucket = storage.bucket();
        // const file = bucket.file(data.pdfUrl.replace(/^https?:\/\/.*?\/.*?\/(.*)$/, "$1"));
        // await file.delete();

        res.json({});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;