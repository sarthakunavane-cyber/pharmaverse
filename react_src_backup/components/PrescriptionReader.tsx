import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { extractPrescriptionDetails, getDrugInformation, fetchPolypharmacyInteraction } from '../services/geminiService';
import { PrescriptionAnalysisResult, InteractionResult } from '../types';
import { fileToBase64 } from '../utils/imageUtils';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../context/LanguageContext';
import { UploadIcon } from './icons/UploadIcon';
import ResultCard from './ResultCard';
import { AlertIcon } from './icons/AlertIcon';

const PrescriptionReader: React.FC = () => {
  const [prescriptionData, setPrescriptionData] = useState<PrescriptionAnalysisResult | null>(null);
  const [interactions, setInteractions] = useState<InteractionResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [interactionLoading, setInteractionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const { t, getLocalizedContent } = useTranslation();
  const { language } = useLanguage();
  const steps = getLocalizedContent('prescriptionReader.howItWorks.steps');

  const [expandedDrugIndex, setExpandedDrugIndex] = useState<number | null>(null);
  const [drugDetailsLoading, setDrugDetailsLoading] = useState(false);

  const analyzeImage = useCallback(async (base64Image: string, mimeType: string) => {
    setLoading(true);
    setError(null);
    setPrescriptionData(null);
    setInteractions(null);
    setExpandedDrugIndex(null);
    setImage(`data:${mimeType};base64,${base64Image}`);

    try {
      const data = await extractPrescriptionDetails(base64Image, mimeType, language);
      setPrescriptionData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('common.error');
      if (errorMessage.includes('SAFETY')) {
          setError(t('prescriptionReader.errors.safety'));
      } else if (errorMessage.includes('unreadable')) {
          setError(t('prescriptionReader.errors.unreadable'));
      } else {
          setError(t('common.error'));
      }
    } finally {
      setLoading(false);
    }
  }, [language, t]);
  
  useEffect(() => {
    const checkInteractions = async () => {
        if (prescriptionData && prescriptionData.medications.length > 1) {
            setInteractionLoading(true);
            setInteractions(null);
            try {
                const drugNames = prescriptionData.medications.map(m => m.genericName || m.drugName).filter(Boolean);
                if (drugNames.length > 1) {
                    const interactionResults = await fetchPolypharmacyInteraction(drugNames, language);
                    setInteractions(interactionResults);
                }
            } catch (error) {
                console.error("Error checking interactions:", error);
            } finally {
                setInteractionLoading(false);
            }
        }
    };

    checkInteractions();
  }, [prescriptionData, language]);

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
    setPrescriptionData(null);
    setError(null);
    setExpandedDrugIndex(null);
    setInteractions(null);
  };
  
  const handleToggleDetails = async (index: number) => {
    if (expandedDrugIndex === index) {
        setExpandedDrugIndex(null);
        return;
    }

    setExpandedDrugIndex(index);
    const medication = prescriptionData?.medications[index];

    if (medication && !medication.details) {
        setDrugDetailsLoading(true);
        try {
            const details = await getDrugInformation(medication.genericName || medication.drugName, language);
            setPrescriptionData(prevData => {
                if (!prevData) return null;
                const updatedMedications = [...prevData.medications];
                updatedMedications[index] = { ...updatedMedications[index], details };
                return { ...prevData, medications: updatedMedications };
            });
        } catch (err) {
            alert(err instanceof Error ? err.message : t('common.error'));
        } finally {
            setDrugDetailsLoading(false);
        }
    }
  };


  return (
    <div className="max-w-4xl mx-auto bg-blue-50 dark:bg-slate-900/50 p-6 rounded-2xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100">{t('prescriptionReader.title')}</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">{t('prescriptionReader.subtitle')}</p>
      </div>

      {!image && (
        <>
            <div className="bg-blue-100 dark:bg-blue-900/30 border-l-4 border-blue-500 text-blue-800 dark:text-blue-200 p-4 mb-8 rounded-r-lg" role="alert">
                <p className="font-bold">{t('prescriptionReader.tips.title')}</p>
                <ul className="list-disc list-inside mt-2 text-sm">
                    <li>{t('prescriptionReader.tips.tip1')}</li>
                    <li>{t('prescriptionReader.tips.tip2')}</li>
                    <li>{t('prescriptionReader.tips.tip3')}</li>
                    <li>{t('prescriptionReader.tips.tip4')}</li>
                </ul>
            </div>

            <div
            {...getRootProps()}
            className={`p-10 border-2 border-dashed rounded-xl text-center transition-colors ${
                isDragActive ? 'border-blue-500 bg-blue-100 dark:bg-blue-900/50' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
            }`}
            >
            <input {...getInputProps()} />
            <div
              role="button"
              tabIndex={0}
              onClick={open}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }}}
              className="flex flex-col items-center justify-center text-blue-800 dark:text-blue-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-blue-500 rounded-lg"
            >
                <UploadIcon />
                <p className="mt-4 font-semibold">{t('prescriptionReader.uploadButton')}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('prescriptionReader.orDrag')}</p>
            </div>
            </div>
            
            <div className="mt-12">
                <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">{t('prescriptionReader.howItWorks.title')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                    {steps.map((step, index) => (
                        <div key={index} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md">
                            <div className="text-4xl mb-2">{step.emoji}</div>
                            <h4 className="font-semibold text-blue-800 dark:text-blue-300">{step.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
      )}

      {loading && <div className="text-center text-gray-600 dark:text-gray-300 mt-4">{t('prescriptionReader.analyzing')}</div>}
      {error && <div className="text-center text-red-500 mt-4 bg-red-100 dark:bg-red-900/30 dark:text-red-300 p-3 rounded-lg">{error}</div>}

      {image && !loading && (
          <div className="mt-8 text-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
              <img src={image} alt="Prescription preview" className="max-w-md mx-auto rounded-lg shadow-md" />
              <button onClick={clearState} className="mt-4 px-6 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">{t('common.clear')}</button>
          </div>
      )}

      {prescriptionData && (
        <div className="mt-8 space-y-8">
            <div className="bg-yellow-100 dark:bg-yellow-900/40 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-200 p-4 rounded-r-lg" role="alert">
                <div className="flex">
                    <div className="py-1">
                        <svg className="h-6 w-6 text-yellow-600 dark:text-yellow-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    <div className="ml-3">
                        <p className="font-bold text-yellow-900 dark:text-yellow-100">{t('prescriptionReader.verifyTitle')}</p>
                        <p className="text-sm">{t('prescriptionReader.verifyText')}</p>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">{t('prescriptionReader.resultsTitle')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-slate-700">
                        <h4 className="font-bold text-lg text-gray-700 dark:text-gray-200 mb-3">{t('prescriptionReader.patientInfoTitle')}</h4>
                        <div className="space-y-2 text-sm text-gray-800 dark:text-gray-300">
                            <p><strong className="text-gray-600 dark:text-gray-400">{t('prescriptionReader.patient')}:</strong> {prescriptionData.patientName}</p>
                            <p><strong className="text-gray-600 dark:text-gray-400">{t('prescriptionReader.age')}:</strong> {prescriptionData.patientAge}</p>
                            <p><strong className="text-gray-600 dark:text-gray-400">{t('prescriptionReader.gender')}:</strong> {prescriptionData.patientGender}</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-slate-700">
                        <h4 className="font-bold text-lg text-gray-700 dark:text-gray-200 mb-3">{t('prescriptionReader.doctorInfoTitle')}</h4>
                        <div className="space-y-2 text-sm text-gray-800 dark:text-gray-300">
                            <p><strong className="text-gray-600 dark:text-gray-400">{t('prescriptionReader.doctor')}:</strong> {prescriptionData.doctorName}</p>
                            <p><strong className="text-gray-600 dark:text-gray-400">{t('prescriptionReader.doctorRegNo')}:</strong> {prescriptionData.doctorRegistrationNumber}</p>
                            <p><strong className="text-gray-600 dark:text-gray-400">{t('prescriptionReader.clinic')}:</strong> {prescriptionData.clinicName}</p>
                            <p><strong className="text-gray-600 dark:text-gray-400">{t('prescriptionReader.date')}:</strong> {prescriptionData.prescriptionDate}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-gray-200 dark:border-slate-700 overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 dark:text-gray-200 uppercase bg-gray-100 dark:bg-slate-700">
                            <tr>
                                <th scope="col" className="px-6 py-3">{t('prescriptionReader.table.drug')}</th>
                                <th scope="col" className="px-6 py-3">{t('prescriptionReader.table.dosage')}</th>
                                <th scope="col" className="px-6 py-3">{t('prescriptionReader.table.frequency')}</th>
                                <th scope="col" className="px-6 py-3 text-center">{t('prescriptionReader.table.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prescriptionData.medications.map((item, index) => (
                                <React.Fragment key={index}>
                                    <tr className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                            {item.drugName} <br/> <span className="text-gray-500 dark:text-gray-400 font-normal">({item.genericName})</span>
                                        </th>
                                        <td className="px-6 py-4">{item.dosage}</td>
                                        <td className="px-6 py-4">{item.frequency}</td>
                                        <td className="px-6 py-4 text-center">
                                            <button onClick={() => handleToggleDetails(index)} className="font-medium text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 rounded">
                                                {expandedDrugIndex === index ? t('prescriptionReader.hideDetails') : t('prescriptionReader.viewDetails')}
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedDrugIndex === index && (
                                        <tr className="bg-blue-50 dark:bg-slate-900/50">
                                            <td colSpan={4} className="p-4">
                                                {drugDetailsLoading && <p className="text-center p-4">{t('prescriptionReader.fetchingDetails')}</p>}
                                                {!drugDetailsLoading && item.details && (
                                                    <div className="space-y-3 p-2 text-xs text-gray-700 dark:text-gray-300">
                                                        <div>
                                                            <h5 className="font-bold">{t('prescriptionReader.details.description')}</h5>
                                                            <p>{item.details.description}</p>
                                                        </div>
                                                        <div>
                                                            <h5 className="font-bold">{t('prescriptionReader.details.indications')}</h5>
                                                            <p>{item.details.indications}</p>
                                                        </div>
                                                        <div>
                                                            <h5 className="font-bold">{t('prescriptionReader.details.sideEffects')}</h5>
                                                            <p>{item.details.sideEffects}</p>
                                                        </div>
                                                        <div>
                                                            <h5 className="font-bold">{t('prescriptionReader.details.relatedDrugs')}</h5>
                                                            <p>{item.details.relatedDrugs}</p>
                                                        </div>
                                                        <div>
                                                            <h5 className="font-bold">{t('prescriptionReader.details.warnings')}</h5>
                                                            <p className="text-red-600 dark:text-red-400">{item.details.warnings}</p>
                                                        </div>
                                                        {item.details.sources && item.details.sources.length > 0 && (
                                                            <div className="border-t dark:border-gray-700 pt-2 mt-2">
                                                                <h5 className="font-semibold text-sm">{t('common.sources')}:</h5>
                                                                <ul className="list-disc list-inside text-sm mt-1">
                                                                    {item.details.sources.map((source, idx) => (
                                                                        <li key={idx}>
                                                                            <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">{source.title || source.uri}</a>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {interactionLoading && <div className="text-center mt-4 text-gray-600 dark:text-gray-300">{t('prescriptionReader.checkingInteractions')}</div>}
            {interactions && (
                <div className="mt-8">
                    <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">{t('prescriptionReader.interactionTitle')}</h3>
                     {interactions.length > 0 ? (
                        <div className="space-y-6">
                            {interactions.map((res, index) => <ResultCard key={index} result={res} />)}
                        </div>
                    ) : (
                        <div className="text-center text-gray-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300 p-4 rounded-lg">
                            <p>{t('interactionChecker.noInteractionsFound')}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default PrescriptionReader;
