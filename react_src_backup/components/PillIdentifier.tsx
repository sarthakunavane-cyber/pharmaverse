import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { identifyPill, identifyPillByName, identifyPillFromPackage } from '../services/geminiService';
import { PillIdentification } from '../types';
import { fileToBase64 } from '../utils/imageUtils';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../context/LanguageContext';
import { UploadIcon } from './icons/UploadIcon';
import { SearchIcon } from './icons/SearchIcon';

type IdentificationMode = 'pillImage' | 'name' | 'packageImage';

const PillIdentifier: React.FC = () => {
  const [identificationMode, setIdentificationMode] = useState<IdentificationMode>('pillImage');
  const [pillName, setPillName] = useState('');
  const [pillData, setPillData] = useState<PillIdentification | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const { t, getLocalizedContent } = useTranslation();
  const { language } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (identificationMode === 'name') {
        inputRef.current?.focus();
    }
  }, [identificationMode]);

  const executeNameSearch = async (name: string) => {
    if (!name.trim()) return;

    setLoading(true);
    setError(null);
    setPillData(null);
    setImage(null);

    try {
      const data = await identifyPillByName(name, language);
      setPillData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('common.error');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleNameSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    executeNameSearch(pillName);
  };

  const analyzeImage = useCallback(async (base64Image: string, mimeType: string) => {
    setLoading(true);
    setError(null);
    setPillData(null);
    setPillName('');
    setImage(`data:${mimeType};base64,${base64Image}`);

    try {
      const data = identificationMode === 'pillImage'
        ? await identifyPill(base64Image, mimeType, language)
        : await identifyPillFromPackage(base64Image, mimeType, language);
      setPillData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('common.error');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [language, t, identificationMode]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      const { base64, mimeType } = await fileToBase64(file);
      analyzeImage(base64, mimeType);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error processing file.");
    }
  }, [analyzeImage]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
    multiple: false,
    noClick: true,
    noKeyboard: true,
  });

  const clearState = () => {
    setImage(null);
    setPillData(null);
    setError(null);
    setPillName('');
  };

  const handleModeChange = (mode: IdentificationMode) => {
    if (loading) return;
    setIdentificationMode(mode);
    clearState();
  };

  const tabs = [
    { mode: 'pillImage', label: t('pillIdentifier.identifyByPill') },
    { mode: 'name', label: t('pillIdentifier.identifyByName') },
    { mode: 'packageImage', label: t('pillIdentifier.identifyByPackage') },
  ];

  const examples = getLocalizedContent(`pillIdentifier.examples.${identificationMode}`);

  return (
    <div className="max-w-4xl mx-auto bg-teal-50 p-6 rounded-2xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-800">{t('pillIdentifier.title')}</h2>
        <p className="mt-2 text-gray-600">{t('pillIdentifier.subtitle')}</p>
      </div>

      <div className="mb-8 flex justify-center border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.mode}
            onClick={() => handleModeChange(tab.mode as IdentificationMode)}
            className={`px-4 py-3 text-sm font-semibold transition-colors duration-200 focus:outline-none ${
              identificationMode === tab.mode
                ? 'border-b-2 border-teal-500 text-teal-600'
                : 'text-gray-500 hover:text-teal-500'
            }`}
            aria-current={identificationMode === tab.mode ? 'page' : undefined}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {!pillData && (
        <>
            {identificationMode === 'name' && (
                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                    <form onSubmit={handleNameSearch}>
                        <label htmlFor="pillName" className="block text-sm font-medium text-gray-700 mb-1">{t('pillIdentifier.drugLabel')}</label>
                        <div className="flex gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                id="pillName"
                                value={pillName}
                                onChange={(e) => setPillName(e.target.value)}
                                placeholder={t('pillIdentifier.namePlaceholder')}
                                className="flex-grow px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 disabled:bg-gray-100 bg-white text-gray-900"
                                required
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-36 flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 disabled:from-gray-400 disabled:to-gray-500 transition-all"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {t('pillIdentifier.searching')}
                                    </>
                                ) : (
                                    <>
                                        <SearchIcon />
                                        <span className="ml-2">{t('pillIdentifier.searchButton')}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {(identificationMode === 'pillImage' || identificationMode === 'packageImage') && !image && (
                <div
                    {...getRootProps()}
                    className={`p-10 border-2 border-dashed rounded-xl text-center transition-colors ${
                    isDragActive ? 'border-teal-500 bg-teal-100' : 'border-gray-300 bg-white'
                    }`}
                >
                    <input {...getInputProps()} />
                    <div
                    role="button"
                    tabIndex={0}
                    onClick={open}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }}}
                    className="flex flex-col items-center justify-center text-teal-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-teal-500 rounded-lg"
                    >
                    <UploadIcon />
                    <p className="mt-4 font-semibold">
                        {identificationMode === 'pillImage'
                        ? t('pillIdentifier.uploadLabel')
                        : t('pillIdentifier.packageUploadLabel')}
                    </p>
                    <p className="text-sm text-gray-500">{t('prescriptionReader.orDrag')}</p>
                    </div>
                </div>
            )}
            
            {image && (
                <div className="mt-8 text-center bg-white p-6 rounded-xl shadow-lg">
                    <img src={image} alt="Pill or package preview" className="max-w-xs mx-auto rounded-lg shadow-md" />
                    {loading && (
                        <div className="mt-4 flex items-center justify-center text-gray-600">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                            <p className="ml-3">{t('pillIdentifier.analyzingImage')}</p>
                        </div>
                    )}
                </div>
            )}
            
            {identificationMode === 'name' && !loading && !image && examples && examples.length > 0 && (
                <div className="mt-12">
                    <h3 className="text-xl font-bold text-center text-gray-700 mb-6">{t('pillIdentifier.examples.title')}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {examples.map((example: { name: string }, index: number) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setPillName(example.name);
                                    executeNameSearch(example.name);
                                }}
                                className="p-3 bg-white border border-gray-300 rounded-lg text-teal-700 font-semibold hover:bg-teal-100 hover:border-teal-400 transition-all text-sm"
                            >
                                {example.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </>
      )}

      {error && <div className="text-center text-red-500 mt-4 bg-red-100 p-3 rounded-lg">{error}</div>}

      {pillData && (
        <div className="mt-8 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">{t('pillIdentifier.resultsTitle')}</h3>
          {image && !loading && (
            <div className="mb-6 text-center">
              <img src={image} alt="Pill or package preview" className="max-w-xs mx-auto rounded-lg shadow-md" />
            </div>
          )}
          {pillData.drugName === 'Unknown' ? (
            <p className="text-center text-gray-600">Could not identify the pill.</p>
          ) : (
            <div className="space-y-4">
              <p><strong className="text-gray-600 font-semibold">Drug Name:</strong> {pillData.drugName}</p>
              <p><strong className="text-gray-600 font-semibold">Strength:</strong> {pillData.strength}</p>
              <p><strong className="text-gray-600 font-semibold">Manufacturer:</strong> {pillData.manufacturer}</p>
              <p><strong className="text-gray-600 font-semibold">Indications:</strong> {pillData.indications}</p>
              <p><strong className="text-gray-600 font-semibold">Side Effects:</strong> {pillData.sideEffects}</p>
            </div>
          )}
          <div className="text-center mt-8">
            <button
              onClick={clearState}
              className="px-6 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {t('pillIdentifier.newSearch')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PillIdentifier;