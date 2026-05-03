import React, { useState, useEffect, useRef } from 'react';
import { findClinicalTrials } from '../services/geminiService';
import { ClinicalTrial } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../context/LanguageContext';
import { SearchIcon } from './icons/SearchIcon';

const ClinicalTrialFinder: React.FC = () => {
    const [query, setQuery] = useState('');
    const [trials, setTrials] = useState<ClinicalTrial[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searched, setSearched] = useState(false);
    const { t } = useTranslation();
    const { language } = useLanguage();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setTrials([]);
        setSearched(true);
        try {
            const results = await findClinicalTrials(query, language);
            setTrials(results);
        } catch (err) {
            setError(err instanceof Error ? err.message : t('common.error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-purple-50 p-6 rounded-2xl">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-800">{t('clinicalTrialFinder.title')}</h2>
                <p className="mt-2 text-gray-600">{t('clinicalTrialFinder.subtitle')}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
                <form onSubmit={handleSubmit}>
                    <div className="border-b border-gray-200 pb-4">
                        <h3 className="text-lg font-semibold text-gray-800">{t('clinicalTrialFinder.filters.title')}</h3>
                        <p className="text-sm text-gray-500">{t('clinicalTrialFinder.filters.subtitle')}</p>
                    </div>
                    <div className="mt-4">
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={t('clinicalTrialFinder.filters.searchPlaceholder')}
                            className={`w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 ${
                                query ? 'bg-teal-50' : 'bg-white'
                            }`}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                        {/* These are UI mockups for now, as the API doesn't support structured filtering */}
                        <select className="w-full px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm text-gray-900"><option>{t('clinicalTrialFinder.filters.allPhases')}</option></select>
                        <select className="w-full px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm text-gray-900"><option>{t('clinicalTrialFinder.filters.allLocations')}</option></select>
                        <select className="w-full px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm text-gray-900"><option>{t('clinicalTrialFinder.filters.allStatus')}</option></select>
                    </div>
                     <div className="mt-6 flex justify-end gap-3">
                         <button type="button" className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">{t('clinicalTrialFinder.filters.clear')}</button>
                        <button type="submit" disabled={loading} className="flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 transition-all">
                            {loading ? t('clinicalTrialFinder.searching') : <><SearchIcon /> {t('clinicalTrialFinder.searchButton')}</>}
                        </button>
                    </div>
                </form>
            </div>

            {loading && <div className="text-center">{t('common.loading')}</div>}
            {error && <div className="text-center text-red-600 bg-red-100 p-3 rounded-md">{error}</div>}

            {searched && !loading && trials.length === 0 && !error && (
                <div className="text-center text-gray-500">{t('clinicalTrialFinder.noResults')}</div>
            )}

            {trials.length > 0 && (
                <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-center text-gray-800">{t('clinicalTrialFinder.resultsTitle')}</h3>
                    {trials.map((trial, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                            <h4 className="text-xl font-bold text-purple-700">{trial.trialTitle}</h4>
                            <p className="text-sm text-gray-500"><strong>Sponsor:</strong> {trial.sponsor} | <strong>Phase:</strong> {trial.phase}</p>
                            <p className="text-sm text-gray-500"><strong>Location:</strong> {trial.location}</p>
                            <p className="mt-2 text-gray-600">{trial.summary}</p>
                            {trial.contact && <p className="mt-2 text-sm"><strong>Contact:</strong> {trial.contact}</p>}
                            {trial.sources && trial.sources.length > 0 && (
                                <div className="mt-4">
                                    <h5 className="font-semibold text-sm">{t('common.sources')}:</h5>
                                    <ul className="list-disc list-inside text-sm">
                                        {trial.sources.map((source, idx) => (
                                            <li key={idx}>
                                                <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">{source.title || source.uri}</a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ClinicalTrialFinder;