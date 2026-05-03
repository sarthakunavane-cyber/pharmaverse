import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import * as geminiService from './services/gemini.service';

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

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
