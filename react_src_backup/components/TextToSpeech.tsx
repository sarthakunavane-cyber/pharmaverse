import React, { useState, useRef, useEffect } from 'react';
import { generateSpeech, translateText } from '../services/geminiService';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../context/LanguageContext';
import { decode, decodeAudioData } from '../utils/audioUtils';

const TextToSpeech: React.FC = () => {
    const { t } = useTranslation();
    const { language: appLanguage } = useLanguage();
    const [text, setText] = useState('');
    const [voice, setVoice] = useState('Zephyr');
    const [ttsLanguage, setTtsLanguage] = useState<'en' | 'hi' | 'mr'>(appLanguage);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    
    const audioContextRef = useRef<AudioContext | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        setLoading(true);
        setError(null);
        setTranslatedText('');

        try {
            // Step 1: Translate the text
            setStatusMessage(t('ttsGenerator.statusTranslating'));
            const translation = await translateText(text, ttsLanguage);
            setTranslatedText(translation);

            // Step 2: Generate speech from the translated text
            setStatusMessage(t('ttsGenerator.generating'));
            const base64Audio = await generateSpeech(translation, voice);

            // Step 3: Play audio
            const audioBytes = decode(base64Audio);
            
            if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            }
            const audioCtx = audioContextRef.current;
            
            const audioBuffer = await decodeAudioData(audioBytes, audioCtx, 24000, 1);
            
            const source = audioCtx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioCtx.destination);
            source.start();

        } catch (err) {
            setError(err instanceof Error ? err.message : t('common.error'));
        } finally {
            setLoading(false);
            setStatusMessage('');
        }
    };
    
    const voices = [
        { id: 'Zephyr', name: t('ttsGenerator.voices.Zephyr') },
        { id: 'Puck', name: t('ttsGenerator.voices.Puck') },
        { id: 'Charon', name: t('ttsGenerator.voices.Charon') },
        { id: 'Kore', name: t('ttsGenerator.voices.Kore') },
        { id: 'Fenrir', name: t('ttsGenerator.voices.Fenrir') },
    ];

    return (
        <div className="max-w-2xl mx-auto bg-rose-50 dark:bg-slate-900/50 p-6 rounded-2xl">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100">{t('ttsGenerator.title')}</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{t('ttsGenerator.subtitle')}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <textarea
                        ref={textareaRef}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={t('ttsGenerator.placeholder')}
                        className={`w-full h-40 p-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-500 resize-none transition-colors duration-300 text-gray-900 dark:text-gray-100 ${
                            text ? 'bg-rose-50 dark:bg-gray-700/50' : 'bg-white dark:bg-gray-700'
                        }`}
                        required
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="ttsLanguage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('ttsGenerator.languageLabel')}</label>
                            <select
                                id="ttsLanguage"
                                value={ttsLanguage}
                                onChange={(e) => setTtsLanguage(e.target.value as 'en' | 'hi' | 'mr')}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-500"
                            >
                                <option value="en">{t('languages.en')}</option>
                                <option value="hi">{t('languages.hi')}</option>
                                <option value="mr">{t('languages.mr')}</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="voice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('ttsGenerator.voiceLabel')}</label>
                            <select
                                id="voice"
                                value={voice}
                                onChange={(e) => setVoice(e.target.value)}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-500"
                            >
                                {voices.map(v => (
                                    <option key={v.id} value={v.id}>{v.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 text-white font-bold rounded-lg shadow-md bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-500 transition-all transform hover:scale-105"
                    >
                        {loading ? statusMessage : t('ttsGenerator.generate')}
                    </button>
                </form>
            </div>

            {loading && (
                <div className="text-center text-gray-600 dark:text-gray-300 mt-6">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
                </div>
            )}

            {error && <div className="text-center text-red-600 mt-4 bg-red-100 dark:bg-red-900/30 dark:text-red-300 p-3 rounded-md">{error}</div>}
             
            {translatedText && !loading && !error && (
               <div className="mt-6 p-4 bg-rose-100 dark:bg-rose-900/40 rounded-lg border border-rose-200 dark:border-rose-800">
                   <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('ttsGenerator.translatedTextLabel')}:</p>
                   <p className="mt-1 text-lg font-medium text-rose-800 dark:text-rose-200 italic">"{translatedText}"</p>
               </div>
            )}
        </div>
    );
};

export default TextToSpeech;