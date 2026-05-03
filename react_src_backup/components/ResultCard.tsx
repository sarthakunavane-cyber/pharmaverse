import React from 'react';
import { InteractionResult, InteractionCategory, Severity } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import { WarningIcon } from './icons/WarningIcon';
import { AlertIcon } from './icons/AlertIcon';
import { useTranslation } from '../hooks/useTranslation';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';

interface ResultCardProps {
  result: InteractionResult;
}

const ScoreMeter: React.FC<{ score: number }> = ({ score }) => {
  const getScoreColor = (s: number) => {
    if (s >= 70) return 'bg-red-500';
    if (s >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  const color = getScoreColor(score);
  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
      <div className={`${color} h-2.5 rounded-full`} style={{ width: `${score}%` }}></div>
    </div>
  );
};


const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const { t } = useTranslation();

  const getCategoryStyle = (category: InteractionCategory) => {
    switch (category) {
      case InteractionCategory.Safe:
        return {
          bgColor: 'bg-green-100 dark:bg-green-900/50', borderColor: 'border-green-500', textColor: 'text-green-800 dark:text-green-300',
          icon: <CheckIcon />, title: t('resultCard.category.Safe'),
        };
      case InteractionCategory.Caution:
        return {
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/50', borderColor: 'border-yellow-500', textColor: 'text-yellow-800 dark:text-yellow-300',
          icon: <WarningIcon />, title: t('resultCard.category.Caution'),
        };
      case InteractionCategory.Avoid:
        return {
          bgColor: 'bg-red-100 dark:bg-red-900/50', borderColor: 'border-red-500', textColor: 'text-red-800 dark:text-red-300',
          icon: <AlertIcon />, title: t('resultCard.category.Avoid'),
        };
      default:
        return {
          bgColor: 'bg-gray-100 dark:bg-gray-700', borderColor: 'border-gray-500', textColor: 'text-gray-800 dark:text-gray-300',
          icon: null, title: 'Information',
        };
    }
  };

  const { borderColor, textColor, icon, title, bgColor } = getCategoryStyle(result.interactionCategory);
  const score = result.interactionScore || 0;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border-t-8 ${borderColor} overflow-hidden animate-fade-in`}>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 text-center sm:text-left mb-4 sm:mb-0">{result.interactingPair}</h3>
          <div className={`px-4 py-2 rounded-full ${textColor} ${bgColor} font-bold text-sm flex items-center justify-center`}>
            <div className="w-6 h-6 mr-2">{icon}</div>
            {title}
          </div>
        </div>
      </div>
      
      <div className="px-6 pb-6 space-y-6">
        <div>
          <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">{t('resultCard.summary')}</h4>
          <p className="text-gray-600 dark:text-gray-300">{result.summary}</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
            <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-1">{t('resultCard.severity')}</h4>
            <p className={`font-bold text-lg ${textColor}`}>{result.severity}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
            <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-1">{t('resultCard.evidenceLevel')}</h4>
            <p className="font-bold text-lg text-gray-800 dark:text-gray-100">{result.evidenceLevel}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <h4 className="font-semibold text-sm text-center text-gray-600 dark:text-gray-400 mb-2">{t('resultCard.interactionScore')}</h4>
            <div className="flex items-center">
              <span className={`font-bold text-lg mr-3 ${textColor}`}>{score}</span>
              <ScoreMeter score={score} />
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">{t('resultCard.mechanism')}</h4>
          <p className="text-gray-600 dark:text-gray-300">{result.mechanism}</p>
        </div>

        <div>
          <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">{t('resultCard.sideEffects')}</h4>
          <p className="text-gray-600 dark:text-gray-300">{result.sideEffects}</p>
        </div>
        
        {result.alternatives && result.alternatives.trim() && (result.severity === Severity.Moderate || result.severity === Severity.Major) && (
            <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border-l-4 border-green-400 dark:border-green-700">
                <div className="flex items-center mb-2">
                    <div className="w-6 h-6 mr-2 text-green-700 dark:text-green-300"><ShieldCheckIcon /></div>
                    <h4 className="font-bold text-green-800 dark:text-green-200">{t('resultCard.saferAlternatives')}</h4>
                </div>
                <p className="text-green-700 dark:text-green-300 text-sm">{result.alternatives}</p>
            </div>
        )}

      </div>
       <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
          }
        `}</style>
    </div>
  );
};

export default ResultCard;