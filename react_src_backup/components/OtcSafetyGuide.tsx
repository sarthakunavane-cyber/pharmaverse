import React, { useState, useEffect, useRef } from 'react';
import { getOtcGuide } from '../services/geminiService';
import { OtcGuide } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../context/LanguageContext';
import { SearchIcon } from './icons/SearchIcon';

const OtcSafetyGuide: React.FC = () => {
    const [drugName, setDrugName] = useState('');
    const [guide, setGuide] = useState<OtcGuide | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { t, getLocalizedContent } = useTranslation();
    const { language } = useLanguage();
    const rules = getLocalizedContent('otcGuide.rules');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setGuide(null);
        try {
            const result = await getOtcGuide(drugName, language);
            setGuide(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : t('common.error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-green-50 p-6 rounded-2xl">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-800">{t('otcGuide.title')}</h2>
                <p className="mt-2 text-gray-600">{t('otcGuide.subtitle')}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={drugName}
                        onChange={(e) => setDrugName(e.target.value)}
                        placeholder={t('otcGuide.drugPlaceholder')}
                        className={`flex-grow px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition-colors text-gray-900 ${
                          drugName ? 'bg-green-50' : 'bg-white'
                        }`}
                        required
                    />
                    <button type="submit" disabled={loading} className="flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 disabled:from-gray-400 disabled:to-gray-500">
                         {loading ? t('otcGuide.gettingGuide') : <><SearchIcon /> {t('otcGuide.getGuideButton')}</>}
                    </button>
                </form>
            </div>

            {loading && <div className="text-center">{t('common.loading')}</div>}
            {error && <div className="text-center text-red-600 bg-red-100 p-3 rounded-md">{error}</div>}
            
            {guide && (
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h3 className="text-2xl font-bold text-center mb-4">{t('otcGuide.resultsTitle')}: {drugName}</h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-gray-700">{t('otcGuide.results.indications')}</h4>
                            <p className="text-gray-800">{guide.indications}</p>
                        </div>

                        <div className="bg-orange-100 p-3 rounded-lg border-l-4 border-orange-500">
                            <h4 className="font-semibold text-orange-900">{t('otcGuide.results.warnings')}</h4>
                            <p className="text-orange-900">{guide.warnings}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                             <div className="bg-green-100 p-3 rounded-lg border-l-4 border-green-500">
                                <h4 className="font-semibold text-green-900">{t('otcGuide.results.safeDose')}</h4>
                                <p className="text-green-900">{guide.safeDose}</p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-lg border-l-4 border-yellow-500">
                                <h4 className="font-semibold text-yellow-900">{t('otcGuide.results.maxDose')}</h4>
                                <p className="text-yellow-900">{guide.maxDose}</p>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-700">{t('otcGuide.results.contraindications')}</h4>
                            <p className="text-gray-800">{guide.contraindications}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-700">{t('otcGuide.results.sideEffects')}</h4>
                            <p className="text-gray-800">{guide.sideEffects}</p>
                        </div>
                         <div>
                            <h4 className="font-semibold text-gray-700">{t('otcGuide.results.interactions')}</h4>
                            <p className="text-gray-800">{guide.interactions}</p>
                        </div>
                         {guide.sources && guide.sources.length > 0 && (
                            <div className="mt-4 border-t pt-4">
                                <h5 className="font-semibold text-sm">{t('common.sources')}:</h5>
                                <ul className="list-disc list-inside text-sm mt-2">
                                    {guide.sources.map((source, idx) => (
                                        <li key={idx}>
                                            <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">{source.title || source.uri}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {!guide && !loading && (
                 <div className="mt-12">
                    <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">{t('otcGuide.rulesTitle')}</h3>
                    <div className="space-y-4">
                        {rules.map((rule, index) => (
                            <div key={index} className="flex items-start bg-white p-4 rounded-lg shadow-md">
                                <div className="text-3xl mr-4">{rule.emoji}</div>
                                <div>
                                    <h4 className="font-semibold text-green-800">{rule.title}</h4>
                                    <p className="text-sm text-gray-600">{rule.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OtcSafetyGuide;