import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

const EducationalSection: React.FC = () => {
  const { t, getLocalizedContent } = useTranslation();
  const articles = getLocalizedContent('educational.articles');

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">{t('educational.title')}</h2>
      <div className="space-y-8">
        {articles.map((article, index) => (
          <div key={index} className="border-l-4 border-teal-500 pl-4">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">{article.title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{article.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationalSection;