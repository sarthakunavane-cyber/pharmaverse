


import { GoogleGenAI, Type, Chat, Modality } from "@google/genai";
import { 
    InteractionResult, 
    InteractionCategory, 
    PrescriptionAnalysisResult, 
    PillIdentification, 
    DoseResult, 
    ClinicalTrial, 
    OtcGuide, 
    DrugDetails, 
    MedicationGuide,
    SymptomAnalysisResult,
} from '../types';

let _genAI: any = null;
const getGenAI = () => {
    if (!_genAI) {
        const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error("GEMINI_API_KEY is not defined in environment variables");
        _genAI = new GoogleGenAI({ apiKey: apiKey as string });
    }
    return _genAI;
};

// Compatibility wrapper to fix SDK syntax issues
const ai: any = {
    models: {
        generateContent: async (args: any) => {
            try {
                const genAI = getGenAI();
                const model = genAI.getGenerativeModel({ 
                    model: args.model,
                    tools: args.config?.tools,
                    generationConfig: {
                        responseMimeType: args.config?.responseMimeType,
                        responseSchema: args.config?.responseSchema,
                        responseModalities: args.config?.responseModalities,
                        speechConfig: args.config?.speechConfig
                    }
                });

                // Handle both string and array/object contents
                const result = await model.generateContent(args.contents?.parts ? args.contents.parts : args.contents);
                const response = await result.response;
                
                // Robustly get text whether it's a function or property
                const responseText = typeof response.text === 'function' ? response.text() : response.text;

                // Return a structure that matches what the rest of the code expects
                return {
                    text: responseText,
                    candidates: (response as any).candidates || []
                };
            } catch (error: any) {
                console.error("SDK Wrapper Error:", error);
                throw error;
            }
        }
    },
    chats: {
        create: (args: any) => {
            const model = getGenAI().getGenerativeModel({ 
                model: args.model || chatModel,
                systemInstruction: args.config?.systemInstruction
            });
            return model.startChat(args.config);
        }
    }
};

const textModel = 'gemini-1.5-flash';
const visionModel = 'gemini-1.5-flash';
const groundingModel = 'gemini-1.5-flash';
const transcriptionModel = 'gemini-1.5-flash';
const chatModel = 'gemini-1.5-flash';
const ttsModel = 'gemini-1.5-flash';

// --- Schemas for JSON validation and repair ---
const interactionSchema = {
    type: Type.OBJECT,
    properties: {
        interactingPair: { 
            type: Type.STRING,
            description: 'The pair of substances that are interacting, formatted as "Substance A + Substance B".'
        },
        interactionCategory: {
            type: Type.STRING,
            enum: [InteractionCategory.Safe, InteractionCategory.Caution, InteractionCategory.Avoid]
        },
        summary: { type: Type.STRING },
        mechanism: { type: Type.STRING },
        evidenceLevel: { type: Type.STRING, description: "A structured evidence rating, e.g., 'Level A: Strong evidence'" },
        sideEffects: { type: Type.STRING },
        severity: { type: Type.STRING, enum: ['Minor', 'Moderate', 'Major'] },
        riskFactors: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of specific clinical risk factors from the provided list." },
        alternatives: { type: Type.STRING, description: "If severity is Moderate or Major, provide safer alternative drugs or herbs." },
    },
    required: ['interactingPair', 'interactionCategory', 'summary', 'mechanism', 'evidenceLevel', 'sideEffects', 'severity']
};

const prescriptionSchema = {
    type: Type.OBJECT,
    properties: {
        patientName: { type: Type.STRING, description: "Patient's full name. State 'Not specified' if not found." },
        patientAge: { type: Type.STRING, description: "Patient's age. State 'Not specified' if not found." },
        patientGender: { type: Type.STRING, description: "Patient's gender. State 'Not specified' if not found." },
        doctorName: { type: Type.STRING, description: "Doctor's full name. State 'Not specified' if not found." },
        doctorRegistrationNumber: { type: Type.STRING, description: "Doctor's official registration number. State 'Not specified' if not found." },
        clinicName: { type: Type.STRING, description: "Name of the clinic or hospital. State 'Not specified' if not found." },
        prescriptionDate: { type: Type.STRING, description: "Date the prescription was written. State 'Not specified' if not found." },
        medications: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    drugName: { type: Type.STRING },
                    genericName: { type: Type.STRING },
                    dosage: { type: Type.STRING },
                    frequency: { type: Type.STRING },
                },
                required: ['drugName', 'genericName', 'dosage', 'frequency'],
            }
        }
    },
    required: ['patientName', 'patientAge', 'patientGender', 'doctorName', 'doctorRegistrationNumber', 'clinicName', 'prescriptionDate', 'medications']
};

const pillSchema = {
    type: Type.OBJECT,
    properties: {
        drugName: { type: Type.STRING },
        strength: { type: Type.STRING },
        manufacturer: { type: Type.STRING },
        sideEffects: { type: Type.STRING },
        indications: { type: Type.STRING },
    },
    required: ['drugName', 'strength', 'manufacturer', 'sideEffects', 'indications']
};

const doseSchema = {
    type: Type.OBJECT,
    properties: {
        recommendedDose: { type: Type.STRING },
        maxSafeDose: { type: Type.STRING },
        adjustmentNotes: { type: Type.STRING },
    },
    required: ['recommendedDose', 'maxSafeDose', 'adjustmentNotes']
};

const symptomSchema = {
    type: Type.OBJECT,
    properties: {
        potentialConditions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    condition: { type: Type.STRING },
                    description: { type: Type.STRING },
                    nextSteps: { type: Type.STRING },
                    confidence: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
                    reasoning: { type: Type.STRING, description: "Explain why these symptoms could suggest this condition." },
                },
                required: ['condition', 'description', 'nextSteps', 'confidence', 'reasoning'],
            },
        },
        disclaimer: { type: Type.STRING },
        emergencyWarning: { type: Type.STRING, description: "A clear warning if any described symptoms warrant immediate medical attention. If not applicable, this must be an empty string." }
    },
    required: ['potentialConditions', 'disclaimer'],
};

const clinicalTrialSchema = {
    type: Type.OBJECT,
    properties: {
        trialTitle: { type: Type.STRING },
        sponsor: { type: Type.STRING },
        phase: { type: Type.STRING },
        location: { type: Type.STRING },
        contact: { type: Type.STRING },
        summary: { type: Type.STRING },
    },
    required: ['trialTitle', 'sponsor', 'phase', 'location', 'contact', 'summary'],
};

const otcGuideSchema = {
    type: Type.OBJECT,
    properties: {
        indications: { type: Type.STRING },
        warnings: { type: Type.STRING },
        safeDose: { type: Type.STRING },
        maxDose: { type: Type.STRING },
        contraindications: { type: Type.STRING },
        sideEffects: { type: Type.STRING },
        interactions: { type: Type.STRING },
    },
    required: ['indications', 'warnings', 'safeDose', 'maxDose', 'contraindications', 'sideEffects', 'interactions']
};


// --- Generic JSON Parsing and Repair Function ---
async function parseAndRepairJson<T>(textResponse: string, schema: any): Promise<T> {
    try {
        // Find the first '{' or '[' and the last '}' or ']'
        const startIdx = Math.max(textResponse.indexOf('{'), textResponse.indexOf('['));
        const endIdx = Math.max(textResponse.lastIndexOf('}'), textResponse.lastIndexOf(']'));
        
        if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
            throw new Error("No JSON structure found in response.");
        }
        
        const cleanText = textResponse.substring(startIdx, endIdx + 1).trim();
        return JSON.parse(cleanText) as T;
    } catch (e) {
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
             const repairText = response.text;
             const rStartIdx = Math.max(repairText.indexOf('{'), repairText.indexOf('['));
             const rEndIdx = Math.max(repairText.lastIndexOf('}'), repairText.lastIndexOf(']'));
             const cleanedRepair = repairText.substring(rStartIdx, rEndIdx + 1).trim();
             return JSON.parse(cleanedRepair) as T;
        } catch (repairError) {
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

export const fetchDrugHerbInteraction = async (drugName: string, herbName: string, language: string): Promise<InteractionResult> => {
    const prompt = `You are an expert clinical pharmacologist AI. Analyze the potential interaction between the drug "${drugName}" and the herb "${herbName}". Provide a detailed analysis based on reputable, peer-reviewed pharmacological sources. ${interactionPromptAddition} The "interactingPair" field in the JSON should be formatted as "${drugName} + ${herbName}". Respond in ${language}.`;
    const response = await ai.models.generateContent({ model: textModel, contents: prompt, config: { responseMimeType: "application/json", responseSchema: interactionSchema } });
    return parseAndRepairJson<InteractionResult>((response.text || ""), interactionSchema);
};

export const fetchDrugDrugInteraction = async (drug1: string, drug2: string, language: string): Promise<InteractionResult> => {
    const prompt = `You are an expert clinical pharmacologist AI. Analyze the potential interaction between the drug "${drug1}" and the drug "${drug2}". Provide a detailed analysis based on reputable, peer-reviewed pharmacological sources. ${interactionPromptAddition} The "interactingPair" field in the JSON should be formatted as "${drug1} + ${drug2}". Respond in ${language}.`;
    const response = await ai.models.generateContent({ model: textModel, contents: prompt, config: { responseMimeType: "application/json", responseSchema: interactionSchema } });
    return parseAndRepairJson<InteractionResult>((response.text || ""), interactionSchema);
};

export const fetchDrugSupplementInteraction = async (drug: string, supplement: string, language: string): Promise<InteractionResult> => {
    const prompt = `You are an expert clinical pharmacologist AI. Analyze the potential interaction between the drug "${drug}" and the dietary supplement "${supplement}". Provide a detailed analysis based on reputable, peer-reviewed pharmacological sources. ${interactionPromptAddition} The "interactingPair" field in the JSON should be formatted as "${drug} + ${supplement}". Respond in ${language}.`;
    const response = await ai.models.generateContent({ model: textModel, contents: prompt, config: { responseMimeType: "application/json", responseSchema: interactionSchema } });
    return parseAndRepairJson<InteractionResult>((response.text || ""), interactionSchema);
};

export const fetchDrugFoodInteraction = async (drug: string, food: string, language: string): Promise<InteractionResult> => {
    const prompt = `You are an expert clinical pharmacologist AI. Analyze the potential interaction between the drug "${drug}" and the food item "${food}". Provide a detailed analysis based on reputable, peer-reviewed pharmacological sources. ${interactionPromptAddition} The "interactingPair" field in the JSON should be formatted as "${drug} + ${food}". Respond in ${language}.`;
    const response = await ai.models.generateContent({ model: textModel, contents: prompt, config: { responseMimeType: "application/json", responseSchema: interactionSchema } });
    return parseAndRepairJson<InteractionResult>((response.text || ""), interactionSchema);
};

export const fetchPolypharmacyInteraction = async (drugs: string[], language: string): Promise<InteractionResult[]> => {
    const drugListString = drugs.join(', ');
    const prompt = `You are an expert clinical pharmacist AI. Analyze interactions for: ${drugListString}. 
For EACH clinically significant interaction, provide a separate JSON object. Your response MUST be a single, valid JSON array of objects.
Base your analysis on reputable, peer-reviewed pharmacological sources.
If no significant interactions are found, return an empty array [].
Focus on interactions that require monitoring, dosage adjustment, or avoidance. Prioritize the most severe interactions first.
${interactionPromptAddition}
Respond in ${language}.`;
    const response = await ai.models.generateContent({ model: textModel, contents: prompt, config: { responseMimeType: "application/json", responseSchema: { type: Type.ARRAY, items: interactionSchema } } });
    return parseAndRepairJson<InteractionResult[]>((response.text || ""), { type: Type.ARRAY, items: interactionSchema });
};

// --- Prescription Reader ---
export const extractPrescriptionDetails = async (imageData: string, mimeType: string, language: string): Promise<PrescriptionAnalysisResult> => {
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

        return await parseAndRepairJson<PrescriptionAnalysisResult>((response.text || ""), prescriptionSchema);

    } catch (error) {
        let errorMessage = (error as Error).message || "An unknown error occurred.";
        
        // Try to parse if it's a JSON string from the SDK
        try {
            if (errorMessage.startsWith('{')) {
                const parsed = JSON.parse(errorMessage);
                errorMessage = parsed.error?.message || parsed.message || errorMessage;
            }
        } catch (e) { /* ignore parse error */ }

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

export const getDrugInformation = async (drugName: string, language: string): Promise<DrugDetails> => {
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
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({ uri: chunk.web?.uri || '', title: chunk.web?.title || '' })) || [];
        const drugDetailsSchema = {
            type: Type.OBJECT,
            properties: {
                description: { type: Type.STRING },
                indications: { type: Type.STRING },
                sideEffects: { type: Type.STRING },
                warnings: { type: Type.STRING },
                relatedDrugs: { type: Type.STRING },
            },
            required: ['description', 'indications', 'sideEffects', 'warnings', 'relatedDrugs']
        };
        const details = await parseAndRepairJson<Omit<DrugDetails, 'sources'>>((response.text || ""), drugDetailsSchema);
        return { ...details, sources };
    } catch (error) {
        throw new Error(`Could not retrieve details for ${drugName}.`);
    }
};

// --- Pill Identifier ---
export const identifyPill = async (imageData: string, mimeType: string, language: string): Promise<PillIdentification> => {
    const visionPrompt = `Identify the pill in this image. Use any visible imprints (text, numbers, logos) as the primary identifier. If imprints are unclear, state that identification is uncertain and include a warning to consult a pharmacist. PRIORITIZE SAFETY. A wrong identification is dangerous. If you cannot identify the pill with high confidence, set "drugName" to "Unknown" and add a warning to the "sideEffects" field. Your response MUST be a single, valid JSON object. Do not include any other text or markdown. Respond in ${language}.`;
    const response = await ai.models.generateContent({ model: visionModel, contents: { parts: [{ inlineData: { mimeType, data: imageData } }, { text: visionPrompt }] }, config: { responseMimeType: "application/json", responseSchema: pillSchema } });
    return parseAndRepairJson<PillIdentification>((response.text || ""), pillSchema);
};

export const identifyPillByName = async (pillName: string, language: string): Promise<PillIdentification> => {
    const prompt = `Provide details for the pill named "${pillName}". Base your answer on authoritative drug databases. Include drug name, common strength, manufacturer, side effects, and indications. If you cannot find the pill, set "drugName" to "Unknown". Your response MUST be a single, valid JSON object. Respond in ${language}.`;
    const response = await ai.models.generateContent({ model: textModel, contents: prompt, config: { responseMimeType: "application/json", responseSchema: pillSchema } });
    return parseAndRepairJson<PillIdentification>((response.text || ""), pillSchema);
};

export const identifyPillFromPackage = async (imageData: string, mimeType: string, language: string): Promise<PillIdentification> => {
    const visionPrompt = `Analyze the medicine package image. Extract the drug name, strength, manufacturer, common side effects, and indications. If details are unclear, state that identification is uncertain. PRIORITIZE SAFETY. If you cannot identify the drug from the package, set "drugName" to "Unknown" and add a warning to the "sideEffects" field. Your response MUST be a single, valid JSON object. Respond in ${language}.`;
    const response = await ai.models.generateContent({ model: visionModel, contents: { parts: [{ inlineData: { mimeType, data: imageData } }, { text: visionPrompt }] }, config: { responseMimeType: "application/json", responseSchema: pillSchema } });
    return parseAndRepairJson<PillIdentification>((response.text || ""), pillSchema);
};

// --- Dose Calculator ---
export const calculateDose = async (details: { drug: string, age: string, weight: string, gender: string, indication: string, renalStatus: string, hepaticStatus: string }, language: string): Promise<DoseResult> => {
    const prompt = `As an expert AI, calculate the pharmaceutical dose based on these details:
- Drug: ${details.drug}, Indication: ${details.indication}
- Patient: ${details.age} years, ${details.weight} kg, ${details.gender}
- Organ Function: Renal=${details.renalStatus}, Hepatic=${details.hepaticStatus}

Base your calculation on standard, evidence-based dosing guidelines.
In 'adjustmentNotes', ALWAYS start with a clear disclaimer: 'This is an AI-generated calculation and MUST be verified by a qualified healthcare professional before use.' Emphasize critical warnings, like necessary dosage adjustments for specific patient groups.
Respond in ${language}.`;
    const response = await ai.models.generateContent({ model: textModel, contents: prompt, config: { responseMimeType: "application/json", responseSchema: doseSchema } });
    return parseAndRepairJson<DoseResult>((response.text || ""), doseSchema);
};

// --- Symptom Checker ---
export const analyzeSymptoms = async (symptoms: string, language: string): Promise<SymptomAnalysisResult> => {
    const prompt = `Analyze symptoms: "${symptoms}".
Provide a list of potential conditions, most likely first. For each, provide a brief description, next steps, confidence level ('High', 'Medium', 'Low'), and reasoning. 
If symptoms could indicate a medical emergency, populate 'emergencyWarning' with a direct message to seek immediate help.
You MUST include a disclaimer that this is not a medical diagnosis and a professional must be consulted.
Respond in ${language}.`;
    const response = await ai.models.generateContent({ model: textModel, contents: prompt, config: { responseMimeType: "application/json", responseSchema: symptomSchema } });
    return parseAndRepairJson<SymptomAnalysisResult>((response.text || ""), symptomSchema);
};

// --- Clinical Trial Finder ---
export const findClinicalTrials = async (query: string, language: string): Promise<ClinicalTrial[]> => {
    const prompt = `Find ongoing clinical trials in India related to "${query}". For each trial, provide title, sponsor, phase, location, contact, and summary. Prioritize info from Clinical Trials Registry-India (CTRI). Respond in ${language}. Your response must be a JSON array.`;
    const response = await ai.models.generateContent({ model: groundingModel, contents: prompt, config: { tools: [{ googleSearch: {} }] } });
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({ uri: chunk.web?.uri || '', title: chunk.web?.title || '' })) || [];
    const trials = await parseAndRepairJson<Omit<ClinicalTrial, 'sources'>[]>((response.text || ""), { type: Type.ARRAY, items: clinicalTrialSchema });
    return trials.map(trial => ({ ...trial, sources }));
};

// --- OTC Safety Guide ---
export const getOtcGuide = async (drugName: string, language: string): Promise<OtcGuide> => {
    const prompt = `Provide a comprehensive safety guide for the OTC medicine "${drugName}". Your response must be a single, valid JSON object. You MUST include sections for indications, warnings, safeDose, maxDose, contraindications, sideEffects, and interactions. Base your answer on up-to-date web info from official drug regulators. Respond in ${language}.`;
    const response = await ai.models.generateContent({ model: groundingModel, contents: prompt, config: { tools: [{ googleSearch: {} }] } });
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({ uri: chunk.web?.uri || '', title: chunk.web?.title || '' })) || [];
    const guide = await parseAndRepairJson<Omit<OtcGuide, 'sources'>>((response.text || ""), otcGuideSchema);
    return { ...guide, sources };
};

// --- Medication Guide Generator ---
export const generateMedicationGuide = async (drugName: string, language: string): Promise<MedicationGuide> => {
    const prompt = `Generate a patient-friendly medication guide for "${drugName}". Rewrite the standard monograph (Mechanism of Action, dosing, side effects, warnings) in simple, easy-to-understand language. Avoid jargon. Use analogies if helpful. Your response MUST be a single, valid JSON object. Respond in ${language}.`;
    const schema = {
        type: Type.OBJECT,
        properties: { drugName: { type: Type.STRING }, mechanismOfAction: { type: Type.STRING }, dosing: { type: Type.STRING }, sideEffects: { type: Type.STRING }, warnings: { type: Type.STRING }, },
        required: ['drugName', 'mechanismOfAction', 'dosing', 'sideEffects', 'warnings']
    };
    const response = await ai.models.generateContent({ model: textModel, contents: prompt, config: { responseMimeType: "application/json", responseSchema: schema } });
    return parseAndRepairJson<MedicationGuide>((response.text || ""), schema);
};

// --- Pharmacist Chatbot ---
export const createChat = (language: string): Chat => {
    return ai.chats.create({
        model: chatModel,
        config: {
            systemInstruction: `You are a virtual pharmacist AI. Your role is to answer questions about medicines, herbs, and their safe use. You are for educational purposes only. If a query is about a medical diagnosis, emergency, or complex, you MUST direct the user to consult a registered physician or pharmacist. Refuse to answer non-health related questions politely. Respond in ${language}.`,
        },
    });
};

// --- Audio Transcription ---
export const transcribeAudio = async (audioData: string, mimeType: string): Promise<string> => {
    const prompt = 'Transcribe this audio recording of a user asking a question for a pharmacist chatbot.';
    const response = await ai.models.generateContent({ model: transcriptionModel, contents: { parts: [ { inlineData: { mimeType, data: audioData } }, { text: prompt } ] } });
    return (response.text || "");
};

// --- Text-to-Speech ---
export const generateSpeech = async (text: string, voice: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: ttsModel,
        contents: [{ parts: [{ text }] }],
        config: { responseModalities: [Modality.AUDIO], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } } },
    });
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error('No audio data received from API.');
    return base64Audio;
};

export const translateText = async (text: string, targetLanguage: 'en' | 'hi' | 'mr'): Promise<string> => {
    if (!text.trim()) return "";
    const langMap = { en: 'English', hi: 'Hindi', mr: 'Marathi' };
    const prompt = `Translate the following text to ${langMap[targetLanguage]}. Only return the translated text, nothing else. Text: "${text}"`;
    const response = await ai.models.generateContent({ model: textModel, contents: prompt });
    return (response.text || "").trim();
};
