"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateText = exports.generateSpeech = exports.transcribeAudio = exports.createChat = exports.generateMedicationGuide = exports.getOtcGuide = exports.findClinicalTrials = exports.analyzeSymptoms = exports.calculateDose = exports.identifyPillFromPackage = exports.identifyPillByName = exports.identifyPill = exports.getDrugInformation = exports.extractPrescriptionDetails = exports.fetchPolypharmacyInteraction = exports.fetchDrugFoodInteraction = exports.fetchDrugSupplementInteraction = exports.fetchDrugDrugInteraction = exports.fetchDrugHerbInteraction = void 0;
const genai_1 = require("@google/genai");
const types_1 = require("../types");
let _aiInstance = null;
const ai = new Proxy({}, {
    get(target, prop) {
        if (!_aiInstance) {
            const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
            if (!apiKey)
                throw new Error("GEMINI_API_KEY is not defined");
            _aiInstance = new genai_1.GoogleGenAI({ apiKey: apiKey });
        }
        return _aiInstance[prop];
    }
});
const textModel = 'gemini-2.5-flash';
const visionModel = 'gemini-2.5-flash';
const groundingModel = 'gemini-2.5-flash';
const transcriptionModel = 'gemini-2.5-flash';
const chatModel = 'gemini-2.5-flash';
const ttsModel = 'gemini-2.5-flash';
// --- Schemas for JSON validation and repair ---
const interactionSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        interactingPair: {
            type: genai_1.Type.STRING,
            description: 'The pair of substances that are interacting, formatted as "Substance A + Substance B".'
        },
        interactionCategory: {
            type: genai_1.Type.STRING,
            enum: [types_1.InteractionCategory.Safe, types_1.InteractionCategory.Caution, types_1.InteractionCategory.Avoid]
        },
        summary: { type: genai_1.Type.STRING },
        mechanism: { type: genai_1.Type.STRING },
        evidenceLevel: { type: genai_1.Type.STRING, description: "A structured evidence rating, e.g., 'Level A: Strong evidence'" },
        sideEffects: { type: genai_1.Type.STRING },
        severity: { type: genai_1.Type.STRING, enum: ['Minor', 'Moderate', 'Major'] },
        riskFactors: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING }, description: "A list of specific clinical risk factors from the provided list." },
        alternatives: { type: genai_1.Type.STRING, description: "If severity is Moderate or Major, provide safer alternative drugs or herbs." },
    },
    required: ['interactingPair', 'interactionCategory', 'summary', 'mechanism', 'evidenceLevel', 'sideEffects', 'severity']
};
const prescriptionSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        patientName: { type: genai_1.Type.STRING, description: "Patient's full name. State 'Not specified' if not found." },
        patientAge: { type: genai_1.Type.STRING, description: "Patient's age. State 'Not specified' if not found." },
        patientGender: { type: genai_1.Type.STRING, description: "Patient's gender. State 'Not specified' if not found." },
        doctorName: { type: genai_1.Type.STRING, description: "Doctor's full name. State 'Not specified' if not found." },
        doctorRegistrationNumber: { type: genai_1.Type.STRING, description: "Doctor's official registration number. State 'Not specified' if not found." },
        clinicName: { type: genai_1.Type.STRING, description: "Name of the clinic or hospital. State 'Not specified' if not found." },
        prescriptionDate: { type: genai_1.Type.STRING, description: "Date the prescription was written. State 'Not specified' if not found." },
        medications: {
            type: genai_1.Type.ARRAY,
            items: {
                type: genai_1.Type.OBJECT,
                properties: {
                    drugName: { type: genai_1.Type.STRING },
                    genericName: { type: genai_1.Type.STRING },
                    dosage: { type: genai_1.Type.STRING },
                    frequency: { type: genai_1.Type.STRING },
                },
                required: ['drugName', 'genericName', 'dosage', 'frequency'],
            }
        }
    },
    required: ['patientName', 'patientAge', 'patientGender', 'doctorName', 'doctorRegistrationNumber', 'clinicName', 'prescriptionDate', 'medications']
};
const pillSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        drugName: { type: genai_1.Type.STRING },
        strength: { type: genai_1.Type.STRING },
        manufacturer: { type: genai_1.Type.STRING },
        sideEffects: { type: genai_1.Type.STRING },
        indications: { type: genai_1.Type.STRING },
    },
    required: ['drugName', 'strength', 'manufacturer', 'sideEffects', 'indications']
};
const doseSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        recommendedDose: { type: genai_1.Type.STRING },
        maxSafeDose: { type: genai_1.Type.STRING },
        adjustmentNotes: { type: genai_1.Type.STRING },
    },
    required: ['recommendedDose', 'maxSafeDose', 'adjustmentNotes']
};
const symptomSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        potentialConditions: {
            type: genai_1.Type.ARRAY,
            items: {
                type: genai_1.Type.OBJECT,
                properties: {
                    condition: { type: genai_1.Type.STRING },
                    description: { type: genai_1.Type.STRING },
                    nextSteps: { type: genai_1.Type.STRING },
                    confidence: { type: genai_1.Type.STRING, enum: ['High', 'Medium', 'Low'] },
                    reasoning: { type: genai_1.Type.STRING, description: "Explain why these symptoms could suggest this condition." },
                },
                required: ['condition', 'description', 'nextSteps', 'confidence', 'reasoning'],
            },
        },
        disclaimer: { type: genai_1.Type.STRING },
        emergencyWarning: { type: genai_1.Type.STRING, description: "A clear warning if any described symptoms warrant immediate medical attention. If not applicable, this must be an empty string." }
    },
    required: ['potentialConditions', 'disclaimer'],
};
const clinicalTrialSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        trialTitle: { type: genai_1.Type.STRING },
        sponsor: { type: genai_1.Type.STRING },
        phase: { type: genai_1.Type.STRING },
        location: { type: genai_1.Type.STRING },
        contact: { type: genai_1.Type.STRING },
        summary: { type: genai_1.Type.STRING },
    },
    required: ['trialTitle', 'sponsor', 'phase', 'location', 'contact', 'summary'],
};
const otcGuideSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        indications: { type: genai_1.Type.STRING },
        warnings: { type: genai_1.Type.STRING },
        safeDose: { type: genai_1.Type.STRING },
        maxDose: { type: genai_1.Type.STRING },
        contraindications: { type: genai_1.Type.STRING },
        sideEffects: { type: genai_1.Type.STRING },
        interactions: { type: genai_1.Type.STRING },
    },
    required: ['indications', 'warnings', 'safeDose', 'maxDose', 'contraindications', 'sideEffects', 'interactions']
};
// --- Generic JSON Parsing and Repair Function ---
function extractJsonFromString(text) {
    let cleanText = text.trim();
    if (cleanText.startsWith('```json'))
        cleanText = cleanText.substring(7);
    else if (cleanText.startsWith('```'))
        cleanText = cleanText.substring(3);
    if (cleanText.endsWith('```'))
        cleanText = cleanText.substring(0, cleanText.length - 3);
    cleanText = cleanText.trim();
    const firstBrace = cleanText.indexOf('{');
    const firstBracket = cleanText.indexOf('[');
    let startIdx = -1;
    if (firstBrace !== -1 && firstBracket !== -1)
        startIdx = Math.min(firstBrace, firstBracket);
    else if (firstBrace !== -1)
        startIdx = firstBrace;
    else
        startIdx = firstBracket;
    if (startIdx === -1)
        throw new Error("No JSON structure found in response.");
    const isArray = cleanText[startIdx] === '[';
    const endChar = isArray ? ']' : '}';
    const endIdx = cleanText.lastIndexOf(endChar);
    if (endIdx === -1 || endIdx < startIdx)
        throw new Error("No closing JSON structure found.");
    return cleanText.substring(startIdx, endIdx + 1).trim();
}
async function parseAndRepairJson(textResponse, schema) {
    try {
        return JSON.parse(extractJsonFromString(textResponse));
    }
    catch (e) {
        console.warn("Initial response was not valid JSON, asking model to repair.");
        const repairPrompt = `The following text is intended to be a JSON object but is malformed. Please correct it so that it conforms to the provided schema and return ONLY the valid JSON object. Do not include any explanatory text or markdown.
        
        Text to fix:
        ${textResponse}
        
        The response MUST be valid JSON.`;
        const response = await ai.models.generateContent({
            model: textModel,
            contents: repairPrompt,
            config: { responseMimeType: "application/json", responseSchema: schema }
        });
        try {
            return JSON.parse(extractJsonFromString(response.text || ""));
        }
        catch (repairError) {
            console.error("Failed to parse even the repaired JSON response.", repairError, "Repaired text:", response.text);
            throw new Error("Failed to get valid JSON from the model after repair attempt.");
        }
    }
}
// --- Interaction Checker ---
const interactionPromptAddition = `
Classify the severity as 'Minor', 'Moderate', or 'Major'.
Provide the evidence level as a short, clear string (e.g., 'Level A: Strong evidence', 'Level B: Moderate evidence').
Identify a list of specific clinical risk factors from this list: ['QT_PROLONGATION', 'BLEEDING_RISK', 'SEROTONIN_SYNDROME', 'CNS_DEPRESSION', 'HYPOTENSION', 'HYPERKALEMIA', 'NEPHROTOXICITY', 'HEPATOTOXICITY']. If none apply, return an empty array.
If the severity is 'Moderate' or 'Major', suggest safer alternatives in the 'alternatives' field. Otherwise, leave it empty.
Base your analysis on information from reputable sources like the FDA, EMA, and national health guidelines. Explicitly state if the evidence is preliminary or well-established. Note any conflicting information between sources.
`;
const fetchDrugHerbInteraction = async (drugName, herbName, language) => {
    const prompt = `You are an expert clinical pharmacologist AI. Analyze the potential interaction between the drug "${drugName}" and the herb "${herbName}". Provide a detailed analysis based on reputable, peer-reviewed pharmacological sources. ${interactionPromptAddition} The "interactingPair" field in the JSON should be formatted as "${drugName} + ${herbName}". Respond in ${language}.`;
    const response = await ai.models.generateContent({ model: textModel, contents: prompt, config: { responseMimeType: "application/json", responseSchema: interactionSchema } });
    return parseAndRepairJson((response.text || ""), interactionSchema);
};
exports.fetchDrugHerbInteraction = fetchDrugHerbInteraction;
const fetchDrugDrugInteraction = async (drug1, drug2, language) => {
    const prompt = `You are an expert clinical pharmacologist AI. Analyze the potential interaction between the drug "${drug1}" and the drug "${drug2}". Provide a detailed analysis based on reputable, peer-reviewed pharmacological sources. ${interactionPromptAddition} The "interactingPair" field in the JSON should be formatted as "${drug1} + ${drug2}". Respond in ${language}.`;
    const response = await ai.models.generateContent({ model: textModel, contents: prompt, config: { responseMimeType: "application/json", responseSchema: interactionSchema } });
    return parseAndRepairJson((response.text || ""), interactionSchema);
};
exports.fetchDrugDrugInteraction = fetchDrugDrugInteraction;
const fetchDrugSupplementInteraction = async (drug, supplement, language) => {
    const prompt = `You are an expert clinical pharmacologist AI. Analyze the potential interaction between the drug "${drug}" and the dietary supplement "${supplement}". Provide a detailed analysis based on reputable, peer-reviewed pharmacological sources. ${interactionPromptAddition} The "interactingPair" field in the JSON should be formatted as "${drug} + ${supplement}". Respond in ${language}.`;
    const response = await ai.models.generateContent({ model: textModel, contents: prompt, config: { responseMimeType: "application/json", responseSchema: interactionSchema } });
    return parseAndRepairJson((response.text || ""), interactionSchema);
};
exports.fetchDrugSupplementInteraction = fetchDrugSupplementInteraction;
const fetchDrugFoodInteraction = async (drug, food, language) => {
    const prompt = `You are an expert clinical pharmacologist AI. Analyze the potential interaction between the drug "${drug}" and the food item "${food}". Provide a detailed analysis based on reputable, peer-reviewed pharmacological sources. ${interactionPromptAddition} The "interactingPair" field in the JSON should be formatted as "${drug} + ${food}". Respond in ${language}.`;
    const response = await ai.models.generateContent({ model: textModel, contents: prompt, config: { responseMimeType: "application/json", responseSchema: interactionSchema } });
    return parseAndRepairJson((response.text || ""), interactionSchema);
};
exports.fetchDrugFoodInteraction = fetchDrugFoodInteraction;
const fetchPolypharmacyInteraction = async (drugs, language) => {
    const drugListString = drugs.join(', ');
    const prompt = `You are an expert clinical pharmacist AI. Analyze interactions for: ${drugListString}. 
For EACH clinically significant interaction, provide a separate JSON object. Your response MUST be a single, valid JSON array of objects.
Base your analysis on reputable, peer-reviewed pharmacological sources.
If no significant interactions are found, return an empty array [].
Focus on interactions that require monitoring, dosage adjustment, or avoidance. Prioritize the most severe interactions first.
${interactionPromptAddition}
Respond in ${language}.`;
    const response = await ai.models.generateContent({ model: textModel, contents: prompt, config: { responseMimeType: "application/json", responseSchema: { type: genai_1.Type.ARRAY, items: interactionSchema } } });
    return parseAndRepairJson((response.text || ""), { type: genai_1.Type.ARRAY, items: interactionSchema });
};
exports.fetchPolypharmacyInteraction = fetchPolypharmacyInteraction;
// --- Prescription Reader ---
const extractPrescriptionDetails = async (imageData, mimeType, language) => {
    const visionPrompt = `You are an expert AI specializing in extracting information from medical prescriptions. Analyze the provided image and extract the details. Your primary goal is accuracy. Prioritize correctness over completeness. If a detail is ambiguous, handwritten and unclear, or unreadable, it is better to state 'Not specified' than to guess incorrectly. Your output MUST be a single, valid JSON object and nothing else.
    
**Important Rules:**
- If any piece of information is not present or is unreadable, use the string "Not specified". Do NOT invent or infer information that is not clearly present.
- Pay close attention to medical abbreviations (e.g., 'OD', 'BD', 'SOS').
- Do NOT add any extra text, explanations, or markdown like \`\`\`json. The entire output must be ONLY the JSON object.
- Respond in ${language}.`;
    try {
        const response = await ai.models.generateContent({
            model: visionModel,
            contents: { parts: [{ inlineData: { mimeType, data: imageData } }, { text: visionPrompt }] },
            config: { responseMimeType: "application/json", responseSchema: prescriptionSchema },
        });
        return await parseAndRepairJson((response.text || ""), prescriptionSchema);
    }
    catch (error) {
        let errorMessage = error.message || "An unknown error occurred.";
        // Try to parse if it's a JSON string from the SDK
        try {
            if (errorMessage.startsWith('{')) {
                const parsed = JSON.parse(errorMessage);
                errorMessage = parsed.error?.message || parsed.message || errorMessage;
            }
        }
        catch (e) { /* ignore parse error */ }
        if (errorMessage.includes('SAFETY')) {
            throw new Error("Prescription analysis failed due to safety reasons. Please ensure the image is appropriate.");
        }
        if (errorMessage.includes('503') || errorMessage.includes('UNAVAILABLE') || errorMessage.includes('high demand')) {
            throw new Error("The AI service is currently overloaded due to high demand. Please wait a moment and try again.");
        }
        if (errorMessage.includes('Quota exceeded') || errorMessage.includes('quota')) {
            throw new Error("API Quota exceeded. Please try again in a few seconds or check your API plan limits.");
        }
        if (errorMessage.includes('400') || errorMessage.includes('Unable to process')) {
            throw new Error("Image might be unreadable. Could not analyze the prescription image. Please ensure the image is clear and well-lit.");
        }
        throw new Error("Analysis error: " + (errorMessage.length > 150 ? "Service temporarily unavailable" : errorMessage));
    }
};
exports.extractPrescriptionDetails = extractPrescriptionDetails;
const getDrugInformation = async (drugName, language) => {
    // FIX: Updated prompt to explicitly request JSON, and removed responseMimeType and responseSchema when using googleSearch tool.
    const prompt = `Provide a concise guide for the drug "${drugName}". Your response must be a single, valid JSON object with the following keys: "description", "indications", "sideEffects", "warnings", "relatedDrugs". Include a brief description, primary indications, common side effects, important warnings, and related drugs/alternatives. Base your answer on up-to-date web information, prioritizing official drug regulators (like FDA or CDSCO). Respond in ${language}.`;
    try {
        const response = await ai.models.generateContent({
            model: groundingModel,
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            }
        });
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk) => ({ uri: chunk.web?.uri || '', title: chunk.web?.title || '' })) || [];
        const drugDetailsSchema = {
            type: genai_1.Type.OBJECT,
            properties: {
                description: { type: genai_1.Type.STRING },
                indications: { type: genai_1.Type.STRING },
                sideEffects: { type: genai_1.Type.STRING },
                warnings: { type: genai_1.Type.STRING },
                relatedDrugs: { type: genai_1.Type.STRING },
            },
            required: ['description', 'indications', 'sideEffects', 'warnings', 'relatedDrugs']
        };
        const details = await parseAndRepairJson((response.text || ""), drugDetailsSchema);
        return { ...details, sources };
    }
    catch (error) {
        throw new Error(`Could not retrieve details for ${drugName}.`);
    }
};
exports.getDrugInformation = getDrugInformation;
// --- Pill Identifier ---
const identifyPill = async (imageData, mimeType, language) => {
    const visionPrompt = `Identify the pill in this image. Use any visible imprints (text, numbers, logos) as the primary identifier. If imprints are unclear, state that identification is uncertain and include a warning to consult a pharmacist. PRIORITIZE SAFETY. A wrong identification is dangerous. If you cannot identify the pill with high confidence, set "drugName" to "Unknown" and add a warning to the "sideEffects" field. Your response MUST be a single, valid JSON object. Do not include any other text or markdown. Respond in ${language}.`;
    const response = await ai.models.generateContent({ model: visionModel, contents: { parts: [{ inlineData: { mimeType, data: imageData } }, { text: visionPrompt }] }, config: { responseMimeType: "application/json", responseSchema: pillSchema } });
    return parseAndRepairJson((response.text || ""), pillSchema);
};
exports.identifyPill = identifyPill;
const identifyPillByName = async (pillName, language) => {
    const prompt = `Provide details for the pill named "${pillName}". Base your answer on authoritative drug databases. Include drug name, common strength, manufacturer, side effects, and indications. If you cannot find the pill, set "drugName" to "Unknown". Your response MUST be a single, valid JSON object. Respond in ${language}.`;
    const response = await ai.models.generateContent({ model: textModel, contents: prompt, config: { responseMimeType: "application/json", responseSchema: pillSchema } });
    return parseAndRepairJson((response.text || ""), pillSchema);
};
exports.identifyPillByName = identifyPillByName;
const identifyPillFromPackage = async (imageData, mimeType, language) => {
    const visionPrompt = `Analyze the medicine package image. Extract the drug name, strength, manufacturer, common side effects, and indications. If details are unclear, state that identification is uncertain. PRIORITIZE SAFETY. If you cannot identify the drug from the package, set "drugName" to "Unknown" and add a warning to the "sideEffects" field. Your response MUST be a single, valid JSON object. Respond in ${language}.`;
    const response = await ai.models.generateContent({ model: visionModel, contents: { parts: [{ inlineData: { mimeType, data: imageData } }, { text: visionPrompt }] }, config: { responseMimeType: "application/json", responseSchema: pillSchema } });
    return parseAndRepairJson((response.text || ""), pillSchema);
};
exports.identifyPillFromPackage = identifyPillFromPackage;
// --- Dose Calculator ---
const calculateDose = async (details, language) => {
    const prompt = `As an expert AI, calculate the pharmaceutical dose based on these details:
- Drug: ${details.drug}, Indication: ${details.indication}
- Patient: ${details.age} years, ${details.weight} kg, ${details.gender}
- Organ Function: Renal=${details.renalStatus}, Hepatic=${details.hepaticStatus}

Base your calculation on standard, evidence-based dosing guidelines.
In 'adjustmentNotes', ALWAYS start with a clear disclaimer: 'This is an AI-generated calculation and MUST be verified by a qualified healthcare professional before use.' Emphasize critical warnings, like necessary dosage adjustments for specific patient groups.
Respond in ${language}.`;
    const response = await ai.models.generateContent({ model: textModel, contents: prompt, config: { responseMimeType: "application/json", responseSchema: doseSchema } });
    return parseAndRepairJson((response.text || ""), doseSchema);
};
exports.calculateDose = calculateDose;
// --- Symptom Checker ---
const analyzeSymptoms = async (symptoms, language) => {
    const prompt = `Analyze symptoms: "${symptoms}".
Provide a list of potential conditions, most likely first. For each, provide a brief description, next steps, confidence level ('High', 'Medium', 'Low'), and reasoning. 
If symptoms could indicate a medical emergency, populate 'emergencyWarning' with a direct message to seek immediate help.
You MUST include a disclaimer that this is not a medical diagnosis and a professional must be consulted.
Respond in ${language}.`;
    const response = await ai.models.generateContent({ model: textModel, contents: prompt, config: { responseMimeType: "application/json", responseSchema: symptomSchema } });
    return parseAndRepairJson((response.text || ""), symptomSchema);
};
exports.analyzeSymptoms = analyzeSymptoms;
// --- Clinical Trial Finder ---
const findClinicalTrials = async (query, language) => {
    const prompt = `Find ongoing clinical trials in India related to "${query}". For each trial, provide title, sponsor, phase, location, contact, and summary. Prioritize info from Clinical Trials Registry-India (CTRI). Respond in ${language}. Your response must be a JSON array.`;
    const response = await ai.models.generateContent({ model: groundingModel, contents: prompt, config: { tools: [{ googleSearch: {} }] } });
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk) => ({ uri: chunk.web?.uri || '', title: chunk.web?.title || '' })) || [];
    const trials = await parseAndRepairJson((response.text || ""), { type: genai_1.Type.ARRAY, items: clinicalTrialSchema });
    return trials.map(trial => ({ ...trial, sources }));
};
exports.findClinicalTrials = findClinicalTrials;
// --- OTC Safety Guide ---
const getOtcGuide = async (drugName, language) => {
    const prompt = `Provide a comprehensive safety guide for the OTC medicine "${drugName}". Your response must be a single, valid JSON object. You MUST include sections for indications, warnings, safeDose, maxDose, contraindications, sideEffects, and interactions. Base your answer on up-to-date web info from official drug regulators. Respond in ${language}.`;
    const response = await ai.models.generateContent({ model: groundingModel, contents: prompt, config: { tools: [{ googleSearch: {} }] } });
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk) => ({ uri: chunk.web?.uri || '', title: chunk.web?.title || '' })) || [];
    const guide = await parseAndRepairJson((response.text || ""), otcGuideSchema);
    return { ...guide, sources };
};
exports.getOtcGuide = getOtcGuide;
// --- Medication Guide Generator ---
const generateMedicationGuide = async (drugName, language) => {
    const prompt = `Generate a patient-friendly medication guide for "${drugName}". Rewrite the standard monograph (Mechanism of Action, dosing, side effects, warnings) in simple, easy-to-understand language. Avoid jargon. Use analogies if helpful. Your response MUST be a single, valid JSON object. Respond in ${language}.`;
    const schema = {
        type: genai_1.Type.OBJECT,
        properties: { drugName: { type: genai_1.Type.STRING }, mechanismOfAction: { type: genai_1.Type.STRING }, dosing: { type: genai_1.Type.STRING }, sideEffects: { type: genai_1.Type.STRING }, warnings: { type: genai_1.Type.STRING }, },
        required: ['drugName', 'mechanismOfAction', 'dosing', 'sideEffects', 'warnings']
    };
    const response = await ai.models.generateContent({ model: textModel, contents: prompt, config: { responseMimeType: "application/json", responseSchema: schema } });
    return parseAndRepairJson((response.text || ""), schema);
};
exports.generateMedicationGuide = generateMedicationGuide;
// --- Pharmacist Chatbot ---
const createChat = (language) => {
    return ai.chats.create({
        model: chatModel,
        config: {
            systemInstruction: `You are a virtual pharmacist AI. Your role is to answer questions about medicines, herbs, and their safe use. You are for educational purposes only. If a query is about a medical diagnosis, emergency, or complex, you MUST direct the user to consult a registered physician or pharmacist. Refuse to answer non-health related questions politely. Respond in ${language}.`,
        },
    });
};
exports.createChat = createChat;
// --- Audio Transcription ---
const transcribeAudio = async (audioData, mimeType) => {
    const prompt = 'Transcribe this audio recording of a user asking a question for a pharmacist chatbot.';
    const response = await ai.models.generateContent({ model: transcriptionModel, contents: { parts: [{ inlineData: { mimeType, data: audioData } }, { text: prompt }] } });
    return (response.text || "");
};
exports.transcribeAudio = transcribeAudio;
// --- Text-to-Speech ---
const generateSpeech = async (text, voice) => {
    const response = await ai.models.generateContent({
        model: ttsModel,
        contents: [{ parts: [{ text }] }],
        config: { responseModalities: [genai_1.Modality.AUDIO], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } } },
    });
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio)
        throw new Error('No audio data received from API.');
    return base64Audio;
};
exports.generateSpeech = generateSpeech;
const translateText = async (text, targetLanguage) => {
    if (!text.trim())
        return "";
    const langMap = { en: 'English', hi: 'Hindi', mr: 'Marathi' };
    const prompt = `Translate the following text to ${langMap[targetLanguage]}. Only return the translated text, nothing else. Text: "${text}"`;
    const response = await ai.models.generateContent({ model: textModel, contents: prompt });
    return (response.text || "").trim();
};
exports.translateText = translateText;
//# sourceMappingURL=gemini.service.js.map