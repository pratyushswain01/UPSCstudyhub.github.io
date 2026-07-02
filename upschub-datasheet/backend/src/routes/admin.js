const express = require("express");
const { db, auth } = require("../config/firebaseAdmin");
const router = express.Router();

// Example: get total resources and downloads
router.get("/analytics", requireAdmin, async (req, res) => {
    try {
        const subjectSnap = await db.collection("subjects").get();
        const chapterSnaps = await Promise.all(
            subjectSnap.docs.map(subject =>
                subject.ref.collection("chapters").get()
            )
        );
        const resourceSnaps = await Promise.all(
            chapterSnaps.flatMap(chapterSnap =>
                chapterSnap.docs.map(chapter =>
                    chapter.ref.collection("resources").get()
                )
            )
        );

        const totalChapters = chapterSnaps.reduce((sum, snap) => sum + snap.size, 0);
        const totalResources = resourceSnaps.reduce((sum, snap) => sum + snap.size, 0);

        // Get user count (students + admins)
        const userCount = await auth.listUsers().then(list => list.users.length);

        res.json({
            totalSubjects: subjectSnap.size,
            totalChapters,
            totalResources,
            totalUsers: userCount,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;