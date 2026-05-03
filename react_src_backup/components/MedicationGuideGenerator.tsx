import React, { useState, useEffect, useRef } from 'react';
import { generateMedicationGuide } from '../services/geminiService';
import { MedicationGuide } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../context/LanguageContext';
import { SearchIcon } from './icons/SearchIcon';

const MedicationGuideGenerator: React.FC = () => {
    const [drugName, setDrugName] = useState('');
    const [guide, setGuide] = useState<MedicationGuide | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
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
        setGuide(null);
        try {
            const result = await generateMedicationGuide(drugName, language);
            setGuide(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : t('common.error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-lime-50 p-6 rounded-2xl">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-800">{t('medicationGuide.title')}</h2>
                <p className="mt-2 text-gray-600">{t('medicationGuide.subtitle')}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={drugName}
                        onChange={(e) => setDrugName(e.target.value)}
                        placeholder={t('medicationGuide.drugPlaceholder')}
                        className={`flex-grow px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-lime-500 focus:border-lime-500 transition-colors text-gray-900 ${
                          drugName ? 'bg-lime-50' : 'bg-white'
                        }`}
                        required
                    />
                    <button type="submit" disabled={loading} className="flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 disabled:from-gray-400 disabled:to-gray-500">
                         {loading ? t('medicationGuide.generating') : <><SearchIcon /> {t('medicationGuide.getGuideButton')}</>}
                    </button>
                </form>
            </div>

            {loading && <div className="text-center">{t('common.loading')}</div>}
            {error && <div className="text-center text-red-600 bg-red-100 p-3 rounded-md">{error}</div>}
            
            {guide && (
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h3 className="text-2xl font-bold text-center mb-4">{t('medicationGuide.resultsTitle')}: {guide.drugName}</h3>
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-700">{t('medicationGuide.results.mechanismOfAction')}</h4>
                            <p className="text-gray-800">{guide.mechanismOfAction}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-700">{t('medicationGuide.results.dosing')}</h4>
                            <p className="text-gray-800">{guide.dosing}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-700">{t('medicationGuide.results.sideEffects')}</h4>
                            <p className="text-gray-800">{guide.sideEffects}</p>
                        </div>
                        <div className="bg-orange-100 p-3 rounded-lg border-l-4 border-orange-500">
                            <h4 className="font-semibold text-orange-900">{t('medicationGuide.results.warnings')}</h4>
                            <p className="text-orange-900">{guide.warnings}</p>
                        </div>
                    </div>
                </div>
            )}
            
            {!guide && !loading && (
                 <div className="mt-12 text-center text-gray-500">
                    <p>{t('medicationGuide.startMessage')}</p>
                 </div>
            )}
        </div>
    );
};

export default MedicationGuideGenerator;