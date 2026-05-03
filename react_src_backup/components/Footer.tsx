import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-6 text-center">
        <p className="font-bold text-yellow-300 mb-2">
          {t('footer.disclaimer')}
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          {t('footer.copyright').replace('{year}', currentYear.toString())}
        </p>
      </div>
    </footer>
  );
};

export default Footer;