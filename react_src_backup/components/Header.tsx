import React from 'react';
import { Page } from '../types';
import { NAV_LINKS } from '../constants';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../context/LanguageContext';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage }) => {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const handleGoHome = () => setCurrentPage(Page.Home);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center mb-3 sm:mb-0">
            {currentPage !== Page.Home && (
              <button
                onClick={handleGoHome}
                className="mr-3 p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-teal-500"
                aria-label={t('header.goBack')}
              >
                <ArrowLeftIcon />
              </button>
            )}
            <div
              className="flex items-center cursor-pointer group"
              onClick={handleGoHome}
            >
              <div className="p-1.5 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 ml-3 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{t('header.title')}</h1>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <nav className="flex flex-wrap justify-center sm:justify-end space-x-2 sm:space-x-4">
              {NAV_LINKS.map((page) => (
                <button
                  key={Page[page]}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 text-sm sm:text-base rounded-md transition-all duration-300 transform hover:scale-105 ${
                    currentPage === page
                      ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md font-bold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium'
                  }`}
                   aria-current={currentPage === page ? 'page' : undefined}
                >
                  {t(`nav.${Page[page]}`)}
                </button>
              ))}
            </nav>
            <div className="relative">
              <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'en' | 'hi' | 'mr')}
                  className="appearance-none bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 pl-3 pr-8 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                  aria-label={t('language.select')}
              >
                  <option value="en">{t('languages.en')}</option>
                  <option value="hi">{t('languages.hi')}</option>
                  <option value="mr">{t('languages.mr')}</option>
              </select>
               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
