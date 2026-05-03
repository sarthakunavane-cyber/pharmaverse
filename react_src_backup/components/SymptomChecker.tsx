
import React, { useState, useEffect, useRef } from 'react';
import { analyzeSymptoms } from '../services/geminiService';
import { SymptomAnalysisResult, PotentialCondition } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../context/LanguageContext';
import { SearchIcon } from './icons/SearchIcon';
import { AlertIcon } from './icons/AlertIcon';

const SymptomChecker: React.FC = () => {
    const [symptoms, setSymptoms] = useState('');
    const [result, setResult] = useState<SymptomAnalysisResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();
    const { language } = useLanguage();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const analysis = await analyzeSymptoms(symptoms, language);
            setResult(analysis);
        } catch (err) {
            setError(err instanceof Error ? err.message : t('common.error'));
        } finally {
            setLoading(false);
        }
    };

    const getConfidenceColor = (confidence: 'High' | 'Medium' | 'Low' | undefined) => {
        switch (confidence) {
            case 'High': return 'bg-red-200 text-red-800 dark:bg-red-900/50 dark:text-red-300';
            case 'Medium': return 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
            case 'Low': return 'bg-blue-200 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
            default: return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    }

    return (
        <div className="max-w-3xl mx-auto bg-indigo-50 dark:bg-slate-900/50 p-6 rounded-2xl">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100">{t('symptomChecker.title')}</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{t('symptomChecker.subtitle')}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('symptomChecker.inputLabel')}</label>
                    <textarea
                        ref={textareaRef}
                        id="symptoms"
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        placeholder={t('symptomChecker.inputPlaceholder')}
                        className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
                        required
                    />
                    <button type="submit" disabled={loading} className="mt-4 w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-500">
                        {loading ? t('symptomChecker.analyzing') : <><div className="w-5 h-5 mr-2"><SearchIcon /></div>{t('symptomChecker.analyzeButton')}</>}
                    </button>
                </form>
            </div>

            {loading && <div className="text-center mt-4">{t('common.loading')}</div>}
            {error && <div className="text-center text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300 p-3 rounded-md mt-4">{error}</div>}

            {result && (
                <div className="mt-8 space-y-6">
                    <div className="bg-yellow-100 dark:bg-yellow-900/40 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-200 p-4 rounded-r-lg" role="alert">
                        <h4 className="font-bold">{t('symptomChecker.disclaimerTitle')}</h4>
                        <p className="text-sm">{result.disclaimer}</p>
                    </div>

                    {result.emergencyWarning && (
                        <div className="bg-red-100 dark:bg-red-900/40 border-l-4 border-red-500 text-red-800 dark:text-red-200 p-4 rounded-r-lg flex items-center" role="alert">
                            <div className="w-8 h-8 mr-3"><AlertIcon/></div>
                            <div>
                                <h4 className="font-bold text-red-900 dark:text-red-100">{t('symptomChecker.emergencyWarningTitle')}</h4>
                                <p className="text-sm">{result.emergencyWarning}</p>
                            </div>
                        </div>
                    )}
                    
                    <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">{t('symptomChecker.resultsTitle')}</h3>
                    
                    <div className="space-y-4">
                        {result.potentialConditions.map((item, index) => (
                            <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-lg font-bold text-indigo-700 dark:text-indigo-300">{item.condition}</h4>
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getConfidenceColor(item.confidence)}`}>
                                        {t(`symptomChecker.confidence.${item.confidence || 'Medium'}`)}
                                    </span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm">{item.description}</p>
                                
                                {item.reasoning && (
                                    <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-md mb-3 border-l-4 border-indigo-300 dark:border-indigo-600">
                                        <h5 className="font-semibold text-sm text-indigo-800 dark:text-indigo-200">{t('symptomChecker.reasoning')}</h5>
                                        <p className="text-indigo-700 dark:text-indigo-300 text-sm mt-1">{item.reasoning}</p>
                                    </div>
                                )}

                                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
                                    <h5 className="font-semibold text-sm text-gray-700 dark:text-gray-200">{t('symptomChecker.nextSteps')}</h5>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{item.nextSteps}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SymptomChecker;