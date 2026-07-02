const { auth } = require("../config/firebaseAdmin");

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized: no token" });
    }

    const idToken = authHeader.split("Bearer ")[1];

    try {
        const decodedToken = await auth.verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Unauthorized: invalid token" });
    }
};

module.exports = verifyToken;