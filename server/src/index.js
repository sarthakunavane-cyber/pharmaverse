"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const multer_1 = __importDefault(require("multer"));
const mongoose_1 = __importDefault(require("mongoose"));
const geminiService = __importStar(require("./services/gemini.service"));
const authService = __importStar(require("./services/auth.service"));
const User_1 = require("./models/User");
const Feedback_1 = require("./models/Feedback");
dotenv_1.default.config({ path: '../.env.local' });
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '50mb' }));
// Connect to MongoDB
const MONGODB_URI = process.env['MONGODB_URI'] ||
    "mongodb+srv://sarthakunavanel_db_user:S6u3lc0RfyVubVHt@cluster0.37ywqew.mongodb.net/?appName=Cluster0";
console.log('🚀 Attempting to connect to MongoDB Atlas...');
mongoose_1.default.connect(MONGODB_URI)
    .then(() => console.log('✅✅✅ SUCCESS: Connected to MongoDB Atlas!'))
    .catch(err => {
    console.error('❌ DATABASE CONNECTION ERROR:');
    console.error(err.message);
});
const upload = (0, multer_1.default)({ limits: { fileSize: 50 * 1024 * 1024 } });
// Middleware to check auth
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token)
        return next();
    const decoded = authService.verifyToken(token);
    if (decoded)
        req.user = decoded;
    next();
};
app.use(authenticate);
async function saveToHistory(userId, type, data) {
    try {
        await User_1.User.findByIdAndUpdate(userId, {
            $push: {
                history: { type, data, timestamp: new Date() }
            }
        });
    }
    catch (e) {
        console.error('History Error:', e);
    }
}
// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const result = await authService.register(email, password, name);
        res.json(result);
    }
    catch (e) {
        res.status(400).json({ error: e.message });
    }
});
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.json(result);
    }
    catch (e) {
        res.status(400).json({ error: e.message });
    }
});
app.get('/api/user/history', async (req, res) => {
    if (!req.user)
        return res.status(401).json({ error: 'Unauthorized' });
    try {
        const user = await User_1.User.findById(req.user.id);
        res.json(user?.history || []);
    }
    catch (e) {
        res.status(500).json({ error: 'Could not fetch history' });
    }
});
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', database: mongoose_1.default.connection.readyState === 1 ? 'connected' : 'disconnected' });
});
app.post('/api/interactions/herb', async (req, res) => {
    try {
        const { drugName, herbName, language } = req.body;
        const result = await geminiService.fetchDrugHerbInteraction(drugName, herbName, language);
        if (req.user) {
            await saveToHistory(req.user.id, 'herb-interaction', { drugName, herbName, result });
        }
        res.json(result);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
app.post('/api/interactions/drug', async (req, res) => {
    try {
        const { drug1, drug2, language } = req.body;
        const result = await geminiService.fetchDrugDrugInteraction(drug1, drug2, language);
        if (req.user) {
            await saveToHistory(req.user.id, 'drug-interaction', { drug1, drug2, result });
        }
        res.json(result);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
app.post('/api/interactions/supplement', async (req, res) => {
    try {
        const { drug, supplement, language } = req.body;
        const result = await geminiService.fetchDrugSupplementInteraction(drug, supplement, language);
        if (req.user) {
            await saveToHistory(req.user.id, 'supplement-interaction', { drug, supplement, result });
        }
        res.json(result);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
app.post('/api/interactions/food', async (req, res) => {
    try {
        const { drug, food, language } = req.body;
        const result = await geminiService.fetchDrugFoodInteraction(drug, food, language);
        if (req.user) {
            await saveToHistory(req.user.id, 'food-interaction', { drug, food, result });
        }
        res.json(result);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
app.post('/api/interactions/polypharmacy', async (req, res) => {
    try {
        const { drugs, language } = req.body;
        const result = await geminiService.fetchPolypharmacyInteraction(drugs, language);
        if (req.user) {
            await saveToHistory(req.user.id, 'polypharmacy', { drugs, result });
        }
        res.json(result);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
app.post('/api/prescription/extract', async (req, res) => {
    try {
        const { imageData, mimeType, language } = req.body;
        const result = await geminiService.extractPrescriptionDetails(imageData, mimeType, language);
        if (req.user) {
            await saveToHistory(req.user.id, 'prescription', { result });
        }
        res.json(result);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
app.post('/api/symptoms/analyze', async (req, res) => {
    try {
        const { symptoms, language } = req.body;
        const result = await geminiService.analyzeSymptoms(symptoms, language);
        if (req.user) {
            await saveToHistory(req.user.id, 'symptoms', { symptoms, result });
        }
        res.json(result);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
app.post('/api/drug/details', async (req, res) => {
    try {
        const { drugName, language } = req.body;
        const result = await geminiService.getDrugInformation(drugName, language);
        res.json(result);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
app.post('/api/chat', async (req, res) => {
    try {
        const { prompt, language } = req.body;
        const { GoogleGenAI } = require("@google/genai");
        const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
        const ai = new GoogleGenAI({ apiKey: apiKey });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `System: You are an expert pharmacist AI. Answer in ${language}.\nUser: ${prompt}`,
        });
        res.json({ text: response.text });
    }
    catch (e) {
        console.error('CHAT ERROR FULL:', e);
        res.status(500).json({ error: e.message || 'Unknown AI Error' });
    }
});
app.post('/api/feedback', async (req, res) => {
    try {
        const feedback = new Feedback_1.Feedback({
            ...req.body,
            timestamp: new Date()
        });
        await feedback.save();
        res.json({ success: true });
    }
    catch (e) {
        res.status(500).json({ error: 'Could not save feedback' });
    }
});
app.get('/api/feedback', async (req, res) => {
    try {
        const feedbacks = await Feedback_1.Feedback.find().sort({ timestamp: -1 });
        res.json(feedbacks);
    }
    catch (e) {
        res.status(500).json({ error: 'Could not fetch feedback' });
    }
});
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
//# sourceMappingURL=index.js.map