// This is the complete code for your functions/index.js file.
// It contains all the backend logic for your app.

const { onCall } = require("firebase-functions/v2/https");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { google } = require("googleapis");

// --- ⚙️ SETUP & CONFIGURATION ---
// IMPORTANT: Set your API key securely in your project's terminal by running:
// firebase functions:config:set gemini.key="AIzaSyAeHKwuFBVTyHwLeQxIjQkl4mB_q5MmUOM"
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

// --- ✨ 1. AI SUMMARY FUNCTION ---
exports.generateSummary = onCall(async (request) => {
    const topicName = request.data.topic;
    if (!topicName) {
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with a "topic" argument.');
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `You are an expert tutor for the Indian UPSC civil services exam. Provide a concise, well-structured summary of the key concepts for the topic: "${topicName}". Use markdown for formatting.`;
        
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        return { summaryText: text };

    } catch (error) {
        console.error("Error calling Gemini API for summary:", error);
        throw new functions.https.HttpsError('internal', 'Failed to generate AI summary.');
    }
});

// --- 📝 2. AI PRACTICE QUESTIONS FUNCTION ---
exports.generatePracticeQuestions = onCall(async (request) => {
    const topicName = request.data.topic;
    if (!topicName) {
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with a "topic" argument.');
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(
            `You are an expert question creator for the Indian UPSC civil services exam. Generate 3 multiple-choice questions based on the topic: "${topicName}".
            Return the result as a single JSON object with a key "questions" which is an array of objects. Each object should have keys: "question", "options" (an object with A, B, C, D), "answer", and "explanation".`
        );
        const text = result.response.text();
        
        // The AI returns a JSON string, which we parse into a real object before sending it
        return JSON.parse(text);

    } catch (error) {
        console.error("Error calling Gemini API for questions:", error);
        throw new functions.https.HttpsError('internal', 'Failed to generate AI questions.');
    }
});

// --- 📊 3. EXPORT TO GOOGLE SHEETS FUNCTION ---
exports.exportTestsToSheet = onCall(async (request) => {
    const tests = request.data.tests;
    if (!tests || !Array.isArray(tests)) {
         throw new functions.https.HttpsError('invalid-argument', 'The function must be called with a "tests" array.');
    }

    const auth = new google.auth.GoogleAuth({
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    
    const sheets = google.sheets({ version: "v4", auth });

    // Convert the array of test objects into an array of arrays for the sheet
    const rows = tests.map(test => [
        test.id,
        test.subject || 'General',
        test.testName,
        test.totalQuestions || 0,
        test.durationMinutes || 0
    ]);

    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId: "1Puo4E_lo98eD5P30-GuZjugl_7JgL9FviOLyAZV0VG4", // ⚠️ REMEMBER TO PASTE YOUR SHEET ID HERE
            range: "Sheet1!A1",
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [
                    ["Test ID", "Subject", "Test Name", "Questions", "Duration (Mins)"], // Header Row
                    ...rows
                ],
            },
        });
        return { success: true, message: "Exported successfully!" };
    } catch (error) {
        console.error("Error writing to sheet: ", error);
        throw new functions.https.HttpsError('internal', 'Failed to export to Google Sheet.');
    }
});
