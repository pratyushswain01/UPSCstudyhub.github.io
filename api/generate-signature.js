// api/generate-signature.js

const jwt = require('jsonwebtoken');

// ⚠️ IMPORTANT: These keys MUST be set as Environment Variables in Vercel!
// They are accessed here securely via process.env
const SDK_KEY = process.env.ZOOM_VIDEO_SDK_KEY; 
const SDK_SECRET = process.env.ZOOM_VIDEO_SDK_SECRET;

// Vercel Serverless function handler
module.exports = (req, res) => {
  // 1. Check for required keys
  if (!SDK_KEY || !SDK_SECRET) {
    res.status(500).json({ error: 'Server misconfiguration: Zoom SDK keys are missing.' });
    return;
  }

  // 2. Extract necessary data from the frontend request
  // We expect the frontend to send us these details via a POST request
  const { sessionName, role, userId, signatureRole } = req.body; 

  if (!sessionName || role === undefined || !userId || signatureRole === undefined) {
    res.status(400).json({ error: 'Missing required parameters: sessionName, role, userId, or signatureRole.' });
    return;
  }

  // 3. Define the JWT Payload (Zoom's Required Format)
  // The 'exp' (expiration) is set to 2 hours from now (current time in seconds + 7200)
  const payload = {
    app_key: SDK_KEY,
    iat: Math.floor(Date.now() / 1000), // Current time in seconds
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 2), // Expires in 2 hours
    token_exp: Math.floor(Date.now() / 1000) + (60 * 60 * 2), // Session token expiry
    session_key: sessionName, // The unique identifier for the class session
    user_identity: userId,    // Unique ID for the UPSChub student/teacher
    role: parseInt(signatureRole) // 1 for Host (Teacher), 0 for Participant (Student)
  };

  try {
    // 4. Sign the JWT using the SDK SECRET
    const token = jwt.sign(payload, SDK_SECRET, { algorithm: 'HS256' });

    // 5. Return the signature (token) to the frontend
    res.status(200).json({ signature: token });
  } catch (error) {
    console.error('JWT Signing Error:', error);
    res.status(500).json({ error: 'Failed to generate access signature.' });
  }
};
