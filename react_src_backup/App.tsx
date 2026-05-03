import React, { useState } from 'react';
import { Page } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import InteractionChecker from './components/InteractionChecker';
import EducationalSection from './components/EducationalSection';
import DoctorsCorner from './components/DoctorsCorner';
import ReferencesPage from './components/ReferencesPage';
import PrescriptionReader from './components/PrescriptionReader';
import PillIdentifier from './components/PillIdentifier';
import DoseCalculator from './components/DoseCalculator';
import ClinicalTrialFinder from './components/ClinicalTrialFinder';
import OtcSafetyGuide from './components/OtcSafetyGuide';
import PharmacistChatbot from './components/PharmacistChatbot';
import LivePharmacist from './components/LivePharmacist';
import TextToSpeech from './components/TextToSpeech';
import SymptomChecker from './components/SymptomChecker';
import Feedback from './components/Feedback';
import MedicationGuideGenerator from './components/MedicationGuideGenerator';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home:
        return <HomePage setCurrentPage={setCurrentPage} />;
      case Page.InteractionDetector:
        return <InteractionChecker />;
      case Page.PrescriptionReader:
        return <PrescriptionReader />;
       case Page.PillIdentifier:
        return <PillIdentifier />;
       case Page.DoseCalculator:
         return <DoseCalculator />;
      case Page.SymptomChecker:
        return <SymptomChecker />;
      case Page.ClinicalTrialFinder:
        return <ClinicalTrialFinder />;
      case Page.OtcSafetyGuide:
        return <OtcSafetyGuide />;
      case Page.MedicationGuideGenerator:
        return <MedicationGuideGenerator />;
      case Page.PharmacistChatbot:
        return <PharmacistChatbot />;
      case Page.LivePharmacist:
        return <LivePharmacist />;
      case Page.TextToSpeech:
        return <TextToSpeech />;
      case Page.Educational:
        return <EducationalSection />;
      case Page.DoctorsCorner:
        return <DoctorsCorner />;
      case Page.References:
        return <ReferencesPage />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900 font-sans">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {renderPage()}
      </main>
      <Feedback />
      <Footer />
    </div>
  );
};

export default App;