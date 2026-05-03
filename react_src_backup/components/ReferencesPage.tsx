import React from 'react';
import { REFERENCE_LINKS } from '../constants';
import { useTranslation } from '../hooks/useTranslation';

const ReferencesPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">{t('references.title')}</h2>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
        {t('references.subtitle')}
      </p>
      <div className="space-y-4">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {REFERENCE_LINKS.map((link, index) => (
            <li key={index} className="py-4 flex items-center justify-between">
              <span className="font-medium text-gray-700 dark:text-gray-200">{link.name}</span>
              <a 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-teal-700 bg-teal-100 hover:bg-teal-200 dark:bg-teal-900/50 dark:text-teal-300 dark:hover:bg-teal-900/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
              >
                {t('references.visitSite')}
                <svg className="ml-2 -mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ReferencesPage;