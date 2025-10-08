import { ImageAnnotatorClient } from '@google-cloud/vision';
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

// Initialize Clients using environment variables
const visionClient = new ImageAnnotatorClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

export async function processEvaluation(formData, files) {
    if (!files || files.length === 0) throw new Error('No answer sheets were uploaded.');

    const firstFileBuffer = files[0].buffer;
    let transcribedText = '';
    let questionToEvaluate = formData.question;

    const [result] = await visionClient.textDetection(firstFileBuffer);
    transcribedText = result.fullTextAnnotation ? result.fullTextAnnotation.text : '';

    if (!transcribedText) throw new Error('Could not detect text. Please use a clearer image.');
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
    return `You are an expert UPSC Mains examiner for UPSChub. Your task is to provide a critical and constructive evaluation based on these parameters: Paper Type: ${data.paper}, Total Marks: ${data.marks}, Your Evaluation Style: Be **${data.evaluator}**. The Question is: "${question}". The Candidate's Answer is: "${answer}". You MUST respond with ONLY a valid JSON object with the keys: "score", "wordCount", "strengths", "improvements", and "modelAnswerPoints".`;
}
