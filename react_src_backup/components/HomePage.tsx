import React, { useState, useEffect } from 'react';
import { Page } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { InteractionIcon } from './icons/InteractionIcon';
import { UploadIcon } from './icons/UploadIcon';
import { CameraIcon } from './icons/CameraIcon';
import { CalculatorIcon } from './icons/CalculatorIcon';
import { ChatIcon } from './icons/ChatIcon';
import { FlaskIcon } from './icons/FlaskIcon';
import { BookIcon } from './icons/BookIcon';
import { LiveIcon } from './icons/LiveIcon';
import { TtsIcon } from './icons/TtsIcon';
import { StethoscopeIcon } from './icons/StethoscopeIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';

interface HomePageProps {
  setCurrentPage: (page: Page) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setCurrentPage }) => {
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  const tools = [
    { page: Page.InteractionDetector, icon: <InteractionIcon />, color: 'red' },
    { page: Page.PrescriptionReader, icon: <UploadIcon />, color: 'blue' },
    { page: Page.SymptomChecker, icon: <StethoscopeIcon />, color: 'indigo' },
    { page: Page.PillIdentifier, icon: <CameraIcon />, color: 'teal' },
    { page: Page.DoseCalculator, icon: <CalculatorIcon />, color: 'yellow' },
    { page: Page.ClinicalTrialFinder, icon: <FlaskIcon />, color: 'purple' },
    { page: Page.OtcSafetyGuide, icon: <BookIcon />, color: 'green' },
    { page: Page.MedicationGuideGenerator, icon: <DocumentTextIcon />, color: 'lime' },
    { page: Page.PharmacistChatbot, icon: <ChatIcon />, color: 'cyan' },
    { page: Page.LivePharmacist, icon: <LiveIcon />, color: 'rose' },
    { page: Page.TextToSpeech, icon: <TtsIcon />, color: 'pink' },
  ];

  const getToolDescription = (page: Page) => {
    const pageName = Page[page];
    return t(`home.tools.${pageName}.description`);
  };

  const colors = {
    red: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-800 dark:text-red-300', hoverBorder: 'hover:border-red-400 dark:hover:border-red-600', glow: 'hover:shadow-[0_0_20px_theme(colors.red.300)] dark:hover:shadow-[0_0_20px_theme(colors.red.500)]' },
    blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-800 dark:text-blue-300', hoverBorder: 'hover:border-blue-400 dark:hover:border-blue-600', glow: 'hover:shadow-[0_0_20px_theme(colors.blue.300)] dark:hover:shadow-[0_0_20px_theme(colors.blue.500)]' },
    teal: { bg: 'bg-teal-100 dark:bg-teal-900/30', text: 'text-teal-800 dark:text-teal-300', hoverBorder: 'hover:border-teal-400 dark:hover:border-teal-600', glow: 'hover:shadow-[0_0_20px_theme(colors.teal.300)] dark:hover:shadow-[0_0_20px_theme(colors.teal.500)]' },
    yellow: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-800 dark:text-yellow-300', hoverBorder: 'hover:border-yellow-400 dark:hover:border-yellow-600', glow: 'hover:shadow-[0_0_20px_theme(colors.yellow.300)] dark:hover:shadow-[0_0_20px_theme(colors.yellow.500)]' },
    purple: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-800 dark:text-purple-300', hoverBorder: 'hover:border-purple-400 dark:hover:border-purple-600', glow: 'hover:shadow-[0_0_20px_theme(colors.purple.300)] dark:hover:shadow-[0_0_20px_theme(colors.purple.500)]' },
    green: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-300', hoverBorder: 'hover:border-green-400 dark:hover:border-green-600', glow: 'hover:shadow-[0_0_20px_theme(colors.green.300)] dark:hover:shadow-[0_0_20px_theme(colors.green.500)]' },
    lime: { bg: 'bg-lime-100 dark:bg-lime-900/30', text: 'text-lime-800 dark:text-lime-300', hoverBorder: 'hover:border-lime-400 dark:hover:border-lime-600', glow: 'hover:shadow-[0_0_20px_theme(colors.lime.300)] dark:hover:shadow-[0_0_20px_theme(colors.lime.500)]' },
    cyan: { bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-800 dark:text-cyan-300', hoverBorder: 'hover:border-cyan-400 dark:hover:border-cyan-600', glow: 'hover:shadow-[0_0_20px_theme(colors.cyan.300)] dark:hover:shadow-[0_0_20px_theme(colors.cyan.500)]' },
    indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-800 dark:text-indigo-300', hoverBorder: 'hover:border-indigo-400 dark:hover:border-indigo-600', glow: 'hover:shadow-[0_0_20px_theme(colors.indigo.300)] dark:hover:shadow-[0_0_20px_theme(colors.indigo.500)]' },
    rose: { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-800 dark:text-rose-300', hoverBorder: 'hover:border-rose-400 dark:hover:border-rose-600', glow: 'hover:shadow-[0_0_20px_theme(colors.rose.300)] dark:hover:shadow-[0_0_20px_theme(colors.rose.500)]' },
    pink: { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-800 dark:text-pink-300', hoverBorder: 'hover:border-pink-400 dark:hover:border-pink-600', glow: 'hover:shadow-[0_0_20px_theme(colors.pink.300)] dark:hover:shadow-[0_0_20px_theme(colors.pink.500)]' },
  };

  return (
    <div>
      <style>{`
            .fade-in-down {
                opacity: 0;
                transform: translateY(-20px);
                transition: opacity 0.6s ease-out, transform 0.6s ease-out;
            }
            .fade-in-down.mounted {
                opacity: 1;
                transform: translateY(0);
            }
            .fade-in-up {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.5s ease-out, transform 0.5s ease-out;
            }
            .fade-in-up.mounted {
                opacity: 1;
                transform: translateY(0);
            }
            .tool-card:hover .tool-icon {
                animation: icon-jiggle 0.4s;
            }
            @keyframes icon-jiggle {
                0%, 100% { transform: rotate(0deg) scale(1.1); }
                25% { transform: rotate(-5deg) scale(1.1); }
                75% { transform: rotate(5deg) scale(1.1); }
            }
      `}</style>
      
      <div className="text-center">
        <h2 className={`text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100 leading-tight fade-in-down ${isMounted ? 'mounted' : ''}`} style={{transitionDelay: '200ms'}}>
          {t('home.title')}
        </h2>
        <p className={`mt-4 max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300 fade-in-down ${isMounted ? 'mounted' : ''}`} style={{transitionDelay: '400ms'}}>
          {t('home.mission')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12 w-full max-w-7xl mx-auto">
          {tools.map((tool, index) => {
            const toolColor = tool.color as keyof typeof colors;
            return (
              <button
                key={tool.page}
                onClick={() => setCurrentPage(tool.page)}
                className={`group p-6 rounded-2xl text-left bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-md transition-all duration-300 transform hover:-translate-y-2 tool-card fade-in-up ${isMounted ? 'mounted' : ''} ${colors[toolColor].hoverBorder} ${colors[toolColor].glow} focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 focus:ring-teal-500`}
                style={{ transitionDelay: `${500 + index * 75}ms` }}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${colors[toolColor].bg} mb-4 transition-transform shadow-md tool-icon`}>
                  {React.cloneElement(tool.icon, { className: `h-8 w-8 ${colors[toolColor].text}` })}
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  {t(`pages.${Page[tool.page]}`)}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                  {getToolDescription(tool.page)}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomePage;