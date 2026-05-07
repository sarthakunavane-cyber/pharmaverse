import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import mongoose from 'mongoose';
import * as geminiService from './services/gemini.service';
import * as authService from './services/auth.service';
import { User } from './models/User';
import { Feedback } from './models/Feedback';

dotenv.config({ path: '../.env.local' });

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Connect to MongoDB
const MONGODB_URI = process.env['MONGODB_URI'] || 
                    "mongodb+srv://sarthakunavanel_db_user:S6u3lc0RfyVubVHt@cluster0.37ywqew.mongodb.net/?appName=Cluster0";

console.log('🚀 Attempting to connect to MongoDB Atlas...');

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅✅✅ SUCCESS: Connected to MongoDB Atlas!'))
    .catch(err => {
        console.error('❌ DATABASE CONNECTION ERROR:');
        console.error(err.message);
    });

const upload = multer({ limits: { fileSize: 50 * 1024 * 1024 } });

// Middleware to check auth
const authenticate = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return next(); 

    const decoded = authService.verifyToken(token);
    if (decoded) req.user = decoded;
    next();
};

app.use(authenticate);

async function saveToHistory(userId: string, type: string, data: any) {
    try {
        await User.findByIdAndUpdate(userId, {
            $push: {
                history: { type, data, timestamp: new Date() }
            }
        });
    } catch (e) {
        console.error('History Error:', e);
    }
}

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const result = await authService.register(email, password, name);
        res.json(result);
    } catch (e: any) {
        res.status(400).json({ error: e.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.json(result);
    } catch (e: any) {
        res.status(400).json({ error: e.message });
    }
});

app.get('/api/user/history', async (req: any, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const user = await User.findById(req.user.id);
        res.json(user?.history || []);
    } catch (e) {
        res.status(500).json({ error: 'Could not fetch history' });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

app.post('/api/interactions/herb', async (req, res) => {
    try {
        const { drugName, herbName, language } = req.body;
        const result = await geminiService.fetchDrugHerbInteraction(drugName, herbName, language);
        if ((req as any).user) {
            await saveToHistory((req as any).user.id, 'herb-interaction', { drugName, herbName, result });
        }
        res.json(result);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/interactions/drug', async (req, res) => {
    try {
        const { drug1, drug2, language } = req.body;
        const result = await geminiService.fetchDrugDrugInteraction(drug1, drug2, language);
        if ((req as any).user) {
            await saveToHistory((req as any).user.id, 'drug-interaction', { drug1, drug2, result });
        }
        res.json(result);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/prescription/extract', async (req, res) => {
    try {
        const { imageData, mimeType, language } = req.body;
        const result = await geminiService.extractPrescriptionDetails(imageData, mimeType, language);
        if ((req as any).user) {
            await saveToHistory((req as any).user.id, 'prescription', { result });
        }
        res.json(result);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/symptoms/analyze', async (req, res) => {
    try {
        const { symptoms, language } = req.body;
        const result = await geminiService.analyzeSymptoms(symptoms, language);
        if ((req as any).user) {
            await saveToHistory((req as any).user.id, 'symptoms', { symptoms, result });
        }
        res.json(result);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/drug/details', async (req, res) => {
    try {
        const { drugName, language } = req.body;
        const result = await geminiService.getDrugInformation(drugName, language);
        res.json(result);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/chat', async (req, res) => {
    try {
        const { prompt, language } = req.body;
        const { GoogleGenAI } = require("@google/genai");
        const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
        const ai = new GoogleGenAI({ apiKey: apiKey as string });
        
        const response = await ai.models.generateContent({
             model: 'gemini-3.1-flash-preview',
             contents: `System: You are an expert pharmacist AI. Answer in ${language}.\nUser: ${prompt}`,
        });
        res.json({ text: response.text });
    } catch (e: any) {
         res.status(500).json({ error: e.message });
    }
});

app.post('/api/feedback', async (req, res) => {
    try {
        const feedback = new Feedback({
            ...req.body,
            timestamp: new Date()
        });
        await feedback.save();
        res.json({ success: true });
    } catch (e: any) {
        res.status(500).json({ error: 'Could not save feedback' });
    }
});

app.get('/api/feedback', async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ timestamp: -1 });
        res.json(feedbacks);
    } catch (e) {
        res.status(500).json({ error: 'Could not fetch feedback' });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
