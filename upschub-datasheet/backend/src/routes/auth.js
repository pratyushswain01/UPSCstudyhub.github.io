const express = require("express");
const router = express.Router();

router.get("/me", (req, res) => {
    res.json({
        uid: req.user.uid,
        email: req.user.email,
        role: req.user.role || "student",
    });
});

module.exports = router;