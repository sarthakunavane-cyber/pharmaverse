import React, { useState, useEffect, useRef } from 'react';
import { 
  fetchDrugHerbInteraction,
  fetchDrugDrugInteraction,
  fetchDrugSupplementInteraction,
  fetchDrugFoodInteraction,
  fetchPolypharmacyInteraction
} from '../services/geminiService';
import { InteractionResult, Severity } from '../types';
import ResultCard from './ResultCard';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../context/LanguageContext';
import { SearchIcon } from './icons/SearchIcon';

type InteractionType = 'drugHerb' | 'drugDrug' | 'drugSupplement' | 'drugFood' | 'polypharmacy';

const InteractionChecker: React.FC = () => {
  const [interactionType, setInteractionType] = useState<InteractionType>('drugHerb');
  const [inputs, setInputs] = useState({ input1: '', input2: '', polypharmacy: '' });
  const [result, setResult] = useState<InteractionResult | InteractionResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t, getLocalizedContent } = useTranslation();
  const { language } = useLanguage();
  
  const input1Ref = useRef<HTMLInputElement>(null);
  const polypharmacyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (interactionType === 'polypharmacy') {
      polypharmacyRef.current?.focus();
    } else {
      input1Ref.current?.focus();
    }
  }, [interactionType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };
  
  const validateInput = () => {
    const { input1, input2, polypharmacy } = inputs;
    if (interactionType === 'polypharmacy') {
        const drugs = polypharmacy.split(/[,;\n]/).map(d => d.trim()).filter(Boolean);
        if (drugs.length < 2) return t('interactionChecker.validation.polypharmacyEmpty');
    } else {
        const i1 = input1.trim();
        const i2 = input2.trim();
        if (!i1 && !i2) return t('interactionChecker.validation.bothEmpty');
        if (!i1) return t('interactionChecker.validation.item1Empty');
        if (!i2) return t('interactionChecker.validation.item2Empty');
        if (i1.length < 3 || i2.length < 3) return t('interactionChecker.validation.tooShort');
    }
    return null;
  };

  const calculateInteractionScore = (result: InteractionResult): number => {
    let score = 0;

    // Severity weight (max 40)
    switch (result.severity) {
        case Severity.Major: score += 40; break;
        case Severity.Moderate: score += 20; break;
        case Severity.Minor: score += 5; break;
    }

    // Evidence weight (max 20)
    const evidence = result.evidenceLevel?.toLowerCase() || '';
    if (evidence.includes('level a') || evidence.includes('strong')) score += 20;
    else if (evidence.includes('level b') || evidence.includes('moderate')) score += 10;
    else if (evidence.includes('level c') || evidence.includes('weak')) score += 5;

    // Risk factor weight (variable)
    const riskFactorScores: { [key: string]: number } = {
        'BLEEDING_RISK': 25,
        'SEROTONIN_SYNDROME': 25,
        'QT_PROLONGATION': 20,
        'CNS_DEPRESSION': 15,
        'HYPERKALEMIA': 15,
        'NEPHROTOXICITY': 15,
        'HEPATOTOXICITY': 15,
        'HYPOTENSION': 10,
    };
    
    result.riskFactors?.forEach(factor => {
        score += riskFactorScores[factor.toUpperCase()] || 5; // Add 5 for any other factors
    });

    return Math.min(score, 100); // Cap score at 100
  };

  const executeCheck = async (type: InteractionType, i1: string, i2: string, poly: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let interactionResult;
      switch (type) {
        case 'drugHerb':
          interactionResult = await fetchDrugHerbInteraction(i1, i2, language);
          break;
        case 'drugDrug':
          interactionResult = await fetchDrugDrugInteraction(i1, i2, language);
          break;
        case 'drugSupplement':
          interactionResult = await fetchDrugSupplementInteraction(i1, i2, language);
          break;
        case 'drugFood':
          interactionResult = await fetchDrugFoodInteraction(i1, i2, language);
          break;
        case 'polypharmacy':
          const drugs = poly.split(/[,;\n]/).map(d => d.trim()).filter(Boolean);
          interactionResult = await fetchPolypharmacyInteraction(drugs, language);
          break;
        default:
          throw new Error('Invalid interaction type');
      }

      if (Array.isArray(interactionResult)) {
        const scoredResults = interactionResult.map(res => ({
            ...res,
            interactionScore: calculateInteractionScore(res)
        }));
        setResult(scoredResults);
      } else {
        const scoredResult = {
            ...interactionResult,
            interactionScore: calculateInteractionScore(interactionResult)
        };
        setResult(scoredResult);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setLoading(false);
    }
  };
  
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateInput();
    if (validationError) {
      setError(validationError);
      return;
    }
    await executeCheck(interactionType, inputs.input1.trim(), inputs.input2.trim(), inputs.polypharmacy.trim());
  };
  
  const handleExampleClick = (example: {input1: string; input2: string}) => {
    setInputs({ input1: example.input1, input2: example.input2, polypharmacy: '' });
    executeCheck(interactionType, example.input1, example.input2, '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handlePolypharmacyExampleClick = (example: { drugs: string; }) => {
    setInputs({ input1: '', input2: '', polypharmacy: example.drugs });
    executeCheck('polypharmacy', '', '', example.drugs);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleModeChange = (mode: InteractionType) => {
    if (loading) return;
    setInteractionType(mode);
    setInputs({ input1: '', input2: '', polypharmacy: '' });
    setResult(null);
    setError(null);
  };
  
  const renderInputs = () => {
    if (interactionType === 'polypharmacy') {
        return (
            <div>
              <label htmlFor="polypharmacy" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('interactionChecker.polypharmacyLabel')}</label>
              <textarea
                ref={polypharmacyRef}
                id="polypharmacy"
                name="polypharmacy"
                value={inputs.polypharmacy}
                onChange={handleInputChange}
                className="w-full h-32 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 transition-colors duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                placeholder={t('interactionChecker.polypharmacyPlaceholder')}
              />
            </div>
        );
    }
    
    const labels = {
        drugHerb: { l1: 'drugLabel', p1: 'drugPlaceholder', l2: 'herbLabel', p2: 'herbPlaceholder'},
        drugDrug: { l1: 'drug1Label', p1: 'drug1Placeholder', l2: 'drug2Label', p2: 'drug2Placeholder'},
        drugSupplement: { l1: 'drugLabel', p1: 'drugPlaceholder', l2: 'supplementLabel', p2: 'supplementPlaceholder'},
        drugFood: { l1: 'drugLabel', p1: 'drugPlaceholder', l2: 'foodLabel', p2: 'foodPlaceholder'},
    };
    const currentLabels = labels[interactionType as keyof typeof labels];

    return (
        <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="input1" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t(`interactionChecker.${currentLabels.l1}`)}</label>
              <input
                ref={input1Ref}
                type="text"
                id="input1"
                name="input1"
                value={inputs.input1}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder={t(`interactionChecker.${currentLabels.p1}`)}
              />
            </div>
            <div>
              <label htmlFor="input2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t(`interactionChecker.${currentLabels.l2}`)}</label>
              <input
                type="text"
                id="input2"
                name="input2"
                value={inputs.input2}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder={t(`interactionChecker.${currentLabels.p2}`)}
              />
            </div>
        </div>
    );
  };
  
  const tabs: { type: InteractionType; labelKey: string }[] = [
    { type: 'drugHerb', labelKey: 'drugHerb' },
    { type: 'drugDrug', labelKey: 'drugDrug' },
    { type: 'drugSupplement', labelKey: 'drugSupplement' },
    { type: 'drugFood', labelKey: 'drugFood' },
    { type: 'polypharmacy', labelKey: 'polypharmacy' },
  ];

  const examples = getLocalizedContent(`interactionChecker.examples.${interactionType}`);

  return (
    <div className="max-w-4xl mx-auto bg-red-50 dark:bg-slate-900/50 p-6 rounded-2xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100">{t('interactionChecker.title')}</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">{t('interactionChecker.subtitle')}</p>
      </div>

      <div className="mb-6 flex flex-wrap justify-center border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-lg shadow-sm">
        {tabs.map(tab => (
            <button
                key={tab.type}
                onClick={() => handleModeChange(tab.type)}
                className={`px-4 py-3 text-sm font-semibold transition-colors duration-200 focus:outline-none ${
                interactionType === tab.type
                    ? 'border-b-2 border-red-500 text-red-600'
                    : 'text-gray-500 dark:text-gray-400 hover:text-red-500'
                }`}
                aria-current={interactionType === tab.type ? 'page' : undefined}
            >
                {t(`interactionChecker.tabs.${tab.labelKey}`)}
            </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-b-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {renderInputs()}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:from-gray-400 disabled:to-gray-500 transition-all transform hover:scale-105"
          >
            {loading ? t('interactionChecker.checking') : <><SearchIcon /> {t('interactionChecker.checkButton')}</>}
          </button>
        </form>
      </div>

      {loading && (
        <div className="text-center text-gray-600 dark:text-gray-400">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          <p className="mt-2">{t('common.loading')}</p>
        </div>
      )}

      {error && (
        <div className="text-center text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300 p-4 rounded-lg">
          <p>{error}</p>
        </div>
      )}

      {result && !Array.isArray(result) && <ResultCard result={result} />}
      {result && Array.isArray(result) && (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">{t('interactionChecker.polypharmacyResultsTitle')}</h3>
            {result.length > 0 ? (
                result.map((res, index) => <ResultCard key={index} result={res} />)
            ) : (
                <div className="text-center text-gray-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300 p-4 rounded-lg">
                    <p>{t('interactionChecker.noInteractionsFound')}</p>
                </div>
            )}
        </div>
      )}

      {examples && examples.length > 0 && !loading && interactionType !== 'polypharmacy' && (
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">{t('interactionChecker.examplesTitle')}</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {examples.map((example: { input1: string; input2: string; explanation: string }, index: number) => (
              <div key={index} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-slate-700 flex flex-col hover:shadow-xl hover:border-red-300 dark:hover:border-red-500 transition-all duration-300">
                <h4 className="font-bold text-lg text-red-700 dark:text-red-400">{example.input1} + {example.input2}</h4>
                <p className="text-gray-600 dark:text-gray-300 mt-2 flex-grow text-sm">{example.explanation}</p>
                <button
                  onClick={() => handleExampleClick(example)}
                  className="mt-4 self-start text-sm font-semibold text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400 transition-colors"
                >
                  {t('interactionChecker.tryExample')} &rarr;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {examples && examples.length > 0 && !loading && interactionType === 'polypharmacy' && (
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">{t('interactionChecker.examplesTitle')}</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {examples.map((example: { title: string; drugs: string; explanation: string }, index: number) => (
              <div key={index} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-slate-700 flex flex-col hover:shadow-xl hover:border-red-300 dark:hover:border-red-500 transition-all duration-300">
                <h4 className="font-bold text-lg text-red-700 dark:text-red-400">{example.title}</h4>
                <div className="bg-gray-50 dark:bg-slate-700 p-2 my-2 rounded text-xs text-gray-700 dark:text-gray-300">
                    <pre className="whitespace-pre-wrap font-sans">{example.drugs}</pre>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mt-2 flex-grow text-sm">{example.explanation}</p>
                <button
                  onClick={() => handlePolypharmacyExampleClick(example)}
                  className="mt-4 self-start text-sm font-semibold text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400 transition-colors"
                >
                  {t('interactionChecker.tryExample')} &rarr;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractionChecker;