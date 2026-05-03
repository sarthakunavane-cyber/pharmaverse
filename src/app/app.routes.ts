import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { InteractionDetector } from './features/interaction-detector/interaction-detector';
import { PrescriptionReader } from './features/prescription-reader/prescription-reader';
import { PillIdentifier } from './features/pill-identifier/pill-identifier';
import { DoseCalculator } from './features/dose-calculator/dose-calculator';
import { ClinicalTrialFinder } from './features/clinical-trial-finder/clinical-trial-finder';
import { OtcSafetyGuide } from './features/otc-safety-guide/otc-safety-guide';
import { MedicationGuideGenerator } from './features/medication-guide-generator/medication-guide-generator';
import { PharmacistChatbot } from './features/pharmacist-chatbot/pharmacist-chatbot';
import { LivePharmacist } from './features/live-pharmacist/live-pharmacist';
import { TextToSpeech } from './features/text-to-speech/text-to-speech';
import { SymptomChecker } from './features/symptom-checker/symptom-checker';
import { Educational } from './features/educational/educational';
import { DoctorsCorner } from './features/doctors-corner/doctors-corner';
import { References } from './features/references/references';
import { Feedback } from './features/feedback/feedback';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: Home },
    { path: 'interaction-detector', component: InteractionDetector },
    { path: 'prescription-reader', component: PrescriptionReader },
    { path: 'pill-identifier', component: PillIdentifier },
    { path: 'dose-calculator', component: DoseCalculator },
    { path: 'clinical-trial-finder', component: ClinicalTrialFinder },
    { path: 'otc-safety-guide', component: OtcSafetyGuide },
    { path: 'medication-guide-generator', component: MedicationGuideGenerator },
    { path: 'pharmacist-chatbot', component: PharmacistChatbot },
    { path: 'live-pharmacist', component: LivePharmacist },
    { path: 'text-to-speech', component: TextToSpeech },
    { path: 'symptom-checker', component: SymptomChecker },
    { path: 'educational', component: Educational },
    { path: 'doctors-corner', component: DoctorsCorner },
    { path: 'references', component: References },
    { path: 'feedback', component: Feedback },
    { path: '**', redirectTo: 'home' }
];

