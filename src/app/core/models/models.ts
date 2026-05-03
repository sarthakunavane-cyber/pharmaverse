
export enum Page {
  Home = 'Home',
  InteractionDetector = 'InteractionDetector',
  PrescriptionReader = 'PrescriptionReader',
  PillIdentifier = 'PillIdentifier',
  DoseCalculator = 'DoseCalculator',
  SymptomChecker = 'SymptomChecker',
  ClinicalTrialFinder = 'ClinicalTrialFinder',
  OtcSafetyGuide = 'OtcSafetyGuide',
  MedicationGuideGenerator = 'MedicationGuideGenerator',
  PharmacistChatbot = 'PharmacistChatbot',
  LivePharmacist = 'LivePharmacist',
  TextToSpeech = 'TextToSpeech',
  Educational = 'Educational',
  DoctorsCorner = 'DoctorsCorner',
  References = 'References',
}

export enum InteractionCategory {
  Safe = 'SAFE_TO_USE_TOGETHER',
  Caution = 'USE_WITH_CAUTION',
  Avoid = 'AVOID_USING_TOGETHER',
}

export enum Severity {
  Minor = 'Minor',
  Moderate = 'Moderate',
  Major = 'Major',
}

export interface InteractionResult {
  interactingPair: string;
  interactionCategory: InteractionCategory;
  summary: string;
  mechanism: string;
  evidenceLevel: string;
  sideEffects: string;
  severity: Severity;
  riskFactors?: string[];
  alternatives?: string;
  interactionScore?: number; // Added client-side
}

export interface TrialSource {
  uri: string;
  title: string;
}

export interface DrugDetails {
    description: string;
    indications: string;
    sideEffects: string;
    warnings: string;
    relatedDrugs: string;
    sources?: TrialSource[];
}

export interface PrescriptionItem {
  drugName: string;
  genericName: string;
  dosage: string;
  frequency: string;
  details?: DrugDetails;
}

export interface PrescriptionAnalysisResult {
    patientName: string;
    patientAge: string;
    patientGender: string;
    doctorName: string;
    doctorRegistrationNumber: string;
    clinicName: string;
    prescriptionDate: string;
    medications: PrescriptionItem[];
}

export interface PillIdentification {
    drugName: string;
    strength: string;
    manufacturer: string;
    sideEffects: string;
    indications: string;
}

export interface DoseResult {
    recommendedDose: string;
    maxSafeDose: string;
    adjustmentNotes: string;
}

export interface ClinicalTrial {
    trialTitle: string;
    sponsor: string;
    phase: string;
    location: string;
    contact: string;
    summary: string;
    sources: TrialSource[];
}
  
export interface OtcGuide {
    indications: string;
    warnings: string;
    safeDose: string;
    maxDose: string;
    contraindications: string;
    sideEffects: string;
    interactions: string;
    sources: TrialSource[];
}

export interface PotentialCondition {
    condition: string;
    description: string;
    probability?: 'High' | 'Medium' | 'Low';
    reasoning?: string;
}

export interface SymptomAnalysisResult {
    isEmergency?: boolean;
    possibleConditions: PotentialCondition[];
    recommendedActions: string[];
    disclaimer: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

export interface MedicationGuide {
    drugName: string;
    mechanismOfAction: string;
    dosing: string;
    sideEffects: string;
    warnings: string;
}

