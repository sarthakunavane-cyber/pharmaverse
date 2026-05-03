

import React, { useState, useEffect, useRef } from 'react';
import { calculateDose } from '../services/geminiService';
import { DoseResult } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../context/LanguageContext';
import { CalculatorIcon } from './icons/CalculatorIcon';
import { AlertIcon } from './icons/AlertIcon';

const DoseCalculator: React.FC = () => {
    const [details, setDetails] = useState({
        drug: '',
        age: '',
        weight: '',
        gender: 'Male',
        indication: '',
        renalStatus: 'Normal',
        hepaticStatus: 'Normal',
    });
    const [result, setResult] = useState<DoseResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();
    const { language } = useLanguage();
    const ageInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        ageInputRef.current?.focus();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const doseResult = await calculateDose(details, language);
            setResult(doseResult);
        } catch (err) {
            setError(err instanceof Error ? err.message : t('common.error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-yellow-50 dark:bg-slate-900/50 p-6 rounded-2xl">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100">{t('doseCalculator.title')}</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{t('doseCalculator.subtitle')}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t('doseCalculator.form.patientTitle')}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('doseCalculator.form.patientSubtitle')}</p>
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <input ref={ageInputRef} type="number" name="age" value={details.age} onChange={handleChange} placeholder={t('doseCalculator.form.agePlaceholder')} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" required />
                            <input type="number" name="weight" value={details.weight} onChange={handleChange} placeholder={t('doseCalculator.form.weightPlaceholder')} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" required />
                            <select name="gender" value={details.gender} onChange={handleChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" required>
                                <option value="Male">{t('doseCalculator.form.genders.male')}</option>
                                <option value="Female">{t('doseCalculator.form.genders.female')}</option>
                                <option value="Other">{t('doseCalculator.form.genders.other')}</option>
                            </select>
                        </div>
                    </div>
                    <div>
                         <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t('doseCalculator.form.drugTitle')}</h3>
                         <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input type="text" name="drug" value={details.drug} onChange={handleChange} placeholder={t('doseCalculator.form.drugPlaceholder')} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" required />
                            <input type="text" name="indication" value={details.indication} onChange={handleChange} placeholder={t('doseCalculator.form.indicationPlaceholder')} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" required />
                            <select name="renalStatus" value={details.renalStatus} onChange={handleChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" required>
                                <option value="Normal">{t('doseCalculator.form.status.normal')}</option>
                                <option value="Mild Impairment">{t('doseCalculator.form.status.mild')}</option>
                                <option value="Moderate Impairment">{t('doseCalculator.form.status.moderate')}</option>
                                <option value="Severe Impairment">{t('doseCalculator.form.status.severe')}</option>
                            </select>
                             <select name="hepaticStatus" value={details.hepaticStatus} onChange={handleChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" required>
                                <option value="Normal">{t('doseCalculator.form.status.normal')}</option>
                                <option value="Mild Impairment">{t('doseCalculator.form.status.mild')}</option>
                                <option value="Moderate Impairment">{t('doseCalculator.form.status.moderate')}</option>
                                <option value="Severe Impairment">{t('doseCalculator.form.status.severe')}</option>
                            </select>
                         </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-500">
                        {loading ? t('doseCalculator.calculating') : <><div className="w-5 h-5 mr-2"><CalculatorIcon /></div>{t('doseCalculator.calculateButton')}</>}
                    </button>
                </form>
            </div>
            
            {loading && <div className="text-center mt-4">{t('common.loading')}</div>}
            {error && <div className="text-center text-red-600 bg-red-100 p-3 rounded-md mt-4">{error}</div>}

            {result && (
                <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-4">{t('doseCalculator.resultsTitle')}</h3>
                    <div className="space-y-4">
                        <div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-lg">
                            <h4 className="font-semibold text-green-800 dark:text-green-200">{t('doseCalculator.results.recommended')}</h4>
                            <p className="text-green-900 dark:text-green-100 text-lg font-bold">{result.recommendedDose}</p>
                        </div>
                        <div className="bg-yellow-100 dark:bg-yellow-900/50 p-4 rounded-lg">
                            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">{t('doseCalculator.results.max')}</h4>
                            <p className="text-yellow-900 dark:text-yellow-100 text-lg font-bold">{result.maxSafeDose}</p>
                        </div>
                        <div className="bg-red-100 dark:bg-red-900/50 p-4 rounded-lg border-l-4 border-red-500 flex items-start">
                            <div className="w-6 h-6 mr-3 text-red-600 dark:text-red-300 flex-shrink-0">
                                <AlertIcon />
                            </div>
                            <div>
                                <h4 className="font-bold text-red-800 dark:text-red-200">{t('doseCalculator.results.notes')}</h4>
                                <p className="text-red-700 dark:text-red-200 mt-1">{result.adjustmentNotes}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoseCalculator;