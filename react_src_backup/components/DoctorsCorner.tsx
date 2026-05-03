import React from 'react';
import { REFERENCE_LINKS } from '../constants';
import { useTranslation } from '../hooks/useTranslation';

const professionalResources = [
    { name: 'PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/', description: 'A free resource supporting the search and retrieval of biomedical and life sciences literature.' },
    { name: 'Cochrane Library', url: 'https://www.cochranelibrary.com/', description: 'A collection of high-quality, independent evidence to inform healthcare decision-making.' },
    { name: 'Natural Medicines Database', url: 'https://naturalmedicines.therapeuticresearch.com/', description: 'An authoritative resource on dietary supplements, natural medicines, and complementary alternative and integrative therapies.'},
];

const DoctorsCorner: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">{t('doctorsCorner.title')}</h2>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-8">{t('doctorsCorner.subtitle')}</p>
      
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 border-b dark:border-gray-600 pb-2">{t('doctorsCorner.section1Title')}</h3>
        <ul className="space-y-4">
          {professionalResources.map((link) => (
            <li key={link.name}>
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 hover:underline">
                {link.name}
              </a>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{link.description}</p>
            </li>
          ))}
        </ul>

        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 border-b dark:border-gray-600 pb-2 pt-4">{t('doctorsCorner.section2Title')}</h3>
        <ul className="space-y-2 list-disc list-inside">
          {REFERENCE_LINKS.map((link) => (
            <li key={link.name}>
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 hover:underline">
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DoctorsCorner;