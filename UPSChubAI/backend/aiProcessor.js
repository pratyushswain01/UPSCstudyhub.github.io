import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import FormData from 'form-data';
import 'dotenv/config';

// Gemini AI client (this part stays the same)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

// --- NEW FUNCTION: Uses the free OCR.space API ---
async function getTextFromImage(imageBuffer) {
    // Note: The OCR.space free tier has a 1MB file limit.
    if (imageBuffer.length > 1 * 1024 * 1024) {
        throw new Error('Image file is too large for the free OCR service (max 1MB).');
    }

    const form = new FormData();
    form.append('apikey', process.env.OCR_SPACE_API_KEY);
    form.append('language', 'eng'); // English language
    form.append('isOverlayRequired', 'false');
    form.append('file', imageBuffer, { filename: 'image.jpg' });

    try {
        const response = await axios.post('https://api.ocr.space/parse/image', form, {
            headers: form.getHeaders(),
        });

        if (response.data && !response.data.IsErroredOnProcessing) {
            return response.data.ParsedResults[0].ParsedText;
        } else {
            throw new Error(response.data.ErrorMessage || 'Failed to process image with OCR.space');
        }
    } catch (error) {
        console.error("OCR.space API Error:", error.message);
        throw new Error('The OCR service failed to read the image.');
    }
}

// --- UPDATED Main Function ---
export async function processEvaluation(formData, files) {
    if (!files || files.length === 0) throw new Error('No answer sheets were uploaded.');

    const firstFileBuffer = files[0].buffer;
    let transcribedText = '';
    let questionToEvaluate = formData.question;

    // --- THIS IS THE CHANGE: We call our new function instead of Google's ---
    transcribedText = await getTextFromImage(firstFileBuffer);

    if (!transcribedText) throw new Error('Could not detect any text in the image.');
    if (!questionToEvaluate) questionToEvaluate = transcribedText.split('\n').slice(0, 3).join('\n');

    const prompt = createAdvancedUPSCExaminerPrompt(formData, questionToEvaluate, transcribedText);
    const aiResult = await model.generateContent(prompt);
    const responseText = aiResult.response.text();
    const cleanedJsonString = responseText.replace(/^```json\s*|```\s*$/g, '');

    try {
        const feedbackJson = JSON.parse(cleanedJsonString);
        return { ...feedbackJson, transcribedText };
    } catch (e) {
        console.error("Failed to parse AI response:", cleanedJsonString);
        throw new Error("AI returned an invalid response format.");
    }
}

function createAdvancedUPSCExaminerPrompt(data, question, answer) {
    // This prompt function does not need to change
    return `You are an expert UPSC Mains examiner for UPSChub. Your task is to provide a critical and constructive evaluation based on these parameters: Paper Type: ${data.paper}, Total Marks: ${data.marks}, Your Evaluation Style: Be **${data.evaluator}**. The Question is: "${question}". The Candidate's Answer is: "${answer}". You MUST respond with ONLY a valid JSON object with the keys: "score", "wordCount", "strengths", "improvements", and "modelAnswerPoints".`;
}
