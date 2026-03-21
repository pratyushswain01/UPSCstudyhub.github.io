import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { processEvaluation } from './aiProcessor.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/evaluate', upload.array('answerSheets', 25), async (req, res) => {
    const startTime = Date.now();
    try {
        if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No files uploaded.' });

        const feedback = await processEvaluation(req.body, req.files);
        const analysisTime = ((Date.now() - startTime) / 1000).toFixed(2);

        res.json({ ...feedback, analysisTime });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
