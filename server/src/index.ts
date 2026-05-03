import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import * as geminiService from './services/gemini.service';
import fs from 'fs';
import path from 'path';


dotenv.config({ path: '../.env.local' });

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const upload = multer({ limits: { fileSize: 50 * 1024 * 1024 } });

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.post('/api/interactions/herb', async (req, res) => {
    try {
        const { drugName, herbName, language } = req.body;
        const result = await geminiService.fetchDrugHerbInteraction(drugName, herbName, language);
        res.json(result);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/interactions/drug', async (req, res) => {
    try {
        const { drug1, drug2, language } = req.body;
        const result = await geminiService.fetchDrugDrugInteraction(drug1, drug2, language);
        res.json(result);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/prescription/extract', async (req, res) => {
    try {
        const { imageData, mimeType, language } = req.body;
        const result = await geminiService.extractPrescriptionDetails(imageData, mimeType, language);
        res.json(result);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/symptoms/analyze', async (req, res) => {
    try {
        const { symptoms, language } = req.body;
        const result = await geminiService.analyzeSymptoms(symptoms, language);
        res.json(result);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/chat', async (req, res) => {
    try {
        const { prompt, language } = req.body;
        // The original logic created a chat session. We can just use the generative ai directly or manage session state.
        // For simplicity hitting textModel directly:
        const { GoogleGenAI } = require("@google/genai");
        const ai = new GoogleGenAI({ apiKey: process.env.VITE_GEMINI_API_KEY as string });
        
        const response = await ai.models.generateContent({
             model: 'gemini-flash-lite-latest',
             contents: `System: You are an expert pharmacist AI. Answer in ${language}.\nUser: ${prompt}`,
        });
        res.json({ text: response.text });
    } catch (e: any) {
         res.status(500).json({ error: e.message });
    }
});

app.post('/api/feedback', (req, res) => {
    try {
        const feedback = {
            ...req.body,
            timestamp: new Date().toISOString()
        };

        // Log to console (visible in Render logs)
        console.log('--- NEW FEEDBACK RECEIVED ---');
        console.log(JSON.stringify(feedback, null, 2));
        console.log('-----------------------------');

        // Append to local JSON file
        const filePath = path.join(__dirname, '../feedback.json');
        let allFeedback = [];
        
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            allFeedback = JSON.parse(content || '[]');
        }
        
        allFeedback.push(feedback);
        fs.writeFileSync(filePath, JSON.stringify(allFeedback, null, 2));

        res.json({ success: true });
    } catch (e: any) {
        console.error('Feedback Error:', e);
        res.status(500).json({ error: 'Could not save feedback' });
    }
});

app.get('/api/feedback', (req, res) => {
    try {
        const filePath = path.join(__dirname, '../feedback.json');
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            return res.json(JSON.parse(content || '[]'));
        }
        res.json([]);
    } catch (e) {
        res.status(500).json({ error: 'Could not read feedback' });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
