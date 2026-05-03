


import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../context/LanguageContext';
import { encode, decode, decodeAudioData } from '../utils/audioUtils';

// FIX: Define LiveSession type via inference since it's not exported from the SDK.
type LiveSession = Awaited<ReturnType<InstanceType<typeof GoogleGenAI>['live']['connect']>>;

type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';
interface Transcript {
    id: string;
    text: string;
    sender: 'user' | 'bot';
}

const LivePharmacist: React.FC = () => {
    const { t } = useTranslation();
    const { language } = useLanguage();

    const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
    const [transcripts, setTranscripts] = useState<Transcript[]>([]);
    
    const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const outputGainNodeRef = useRef<GainNode | null>(null);
    const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const nextStartTimeRef = useRef<number>(0);
    const currentInputTranscriptionRef = useRef<string>('');
    const currentOutputTranscriptionRef = useRef<string>('');
    const aiRef = useRef<GoogleGenAI | null>(null);

    const createBlob = (data: Float32Array): Blob => {
        const l = data.length;
        const int16 = new Int16Array(l);
        for (let i = 0; i < l; i++) {
            int16[i] = data[i] * 32768;
        }
        return {
            data: encode(new Uint8Array(int16.buffer)),
            mimeType: 'audio/pcm;rate=16000',
        };
    };

    const stopConversation = useCallback(async () => {
        setConnectionState('disconnected');
        
        if (scriptProcessorRef.current) {
            scriptProcessorRef.current.disconnect();
            scriptProcessorRef.current = null;
        }
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }
        if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
            await inputAudioContextRef.current.close();
        }
        if(outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
             for (const source of sourcesRef.current.values()) {
                source.stop();
             }
             sourcesRef.current.clear();
             await outputAudioContextRef.current.close();
        }

        if (sessionPromiseRef.current) {
            try {
                const session = await sessionPromiseRef.current;
                session.close();
            } catch (e) {
                console.error("Error closing session:", e);
            }
            sessionPromiseRef.current = null;
        }
    }, []);

    const startConversation = async () => {
        setConnectionState('connecting');
        setTranscripts([]);
        currentInputTranscriptionRef.current = '';
        currentOutputTranscriptionRef.current = '';
        nextStartTimeRef.current = 0;
        
        await stopConversation();
        setConnectionState('connecting');

        try {
            inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            outputGainNodeRef.current = outputAudioContextRef.current.createGain();
            outputGainNodeRef.current.connect(outputAudioContextRef.current.destination);

            mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

            // FIX: Initialize GoogleGenAI instance with API_KEY as per guidelines.
            if (!aiRef.current) {
// Add 'as string' type assertion to ensure API key is treated as a string.
                aiRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            }
            const ai = aiRef.current;
            
            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        setConnectionState('connected');
                        if (!inputAudioContextRef.current || !mediaStreamRef.current) return;
                        
                        const source = inputAudioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
                        const scriptProcessor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
                        
                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob = createBlob(inputData);
                            sessionPromiseRef.current?.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputAudioContextRef.current.destination);
                        scriptProcessorRef.current = scriptProcessor;
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        if (message.serverContent?.inputTranscription) {
                            currentInputTranscriptionRef.current += message.serverContent.inputTranscription.text;
                        } else if (message.serverContent?.outputTranscription) {
                            currentOutputTranscriptionRef.current += message.serverContent.outputTranscription.text;
                        }

                        if (message.serverContent?.turnComplete) {
                            const fullInput = currentInputTranscriptionRef.current.trim();
                            const fullOutput = currentOutputTranscriptionRef.current.trim();
                            
                            if (fullInput) setTranscripts(prev => [...prev, { id: `user-${Date.now()}`, text: fullInput, sender: 'user' }]);
                            if (fullOutput) setTranscripts(prev => [...prev, { id: `bot-${Date.now()}`, text: fullOutput, sender: 'bot' }]);
                            
                            currentInputTranscriptionRef.current = '';
                            currentOutputTranscriptionRef.current = '';
                        }
                        
                        const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                        if (base64Audio && outputAudioContextRef.current && outputGainNodeRef.current) {
                            const audioCtx = outputAudioContextRef.current;
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioCtx.currentTime);
                            
                            const audioBuffer = await decodeAudioData(decode(base64Audio), audioCtx, 24000, 1);
                            
                            const source = audioCtx.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputGainNodeRef.current);
                            source.addEventListener('ended', () => { sourcesRef.current.delete(source); });
                            
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                            sourcesRef.current.add(source);
                        }

                        if (message.serverContent?.interrupted) {
                            for (const source of sourcesRef.current.values()) {
                                source.stop();
                                sourcesRef.current.delete(source);
                            }
                            nextStartTimeRef.current = 0;
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error("Session error:", e);
                        setConnectionState('error');
                        stopConversation();
                    },
                    onclose: (e: CloseEvent) => {
                        console.debug('Session closed');
                        if (connectionState !== 'disconnected') {
                           stopConversation();
                        }
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    systemInstruction: `You are a virtual pharmacist AI. Your role is to answer questions about medicines, herbs, and their safe use. You are for educational purposes only. If a query is about a medical diagnosis, emergency, or is too complex, you MUST direct the user to consult a registered physician or pharmacist. Keep your answers concise and easy to understand. Respond in ${language}.`,
                },
            });

            await sessionPromiseRef.current;

        } catch (error) {
            console.error("Failed to start conversation:", error);
            setConnectionState('error');
            await stopConversation();
        }
    };
    
    useEffect(() => {
        return () => {
            stopConversation();
        };
    }, [stopConversation]);

    const getStatusText = () => {
        switch (connectionState) {
            case 'connecting': return t('livePharmacist.status.connecting');
            case 'connected': return t('livePharmacist.status.connected');
            case 'error': return t('livePharmacist.status.error');
            case 'disconnected':
            default: return t('livePharmacist.status.disconnected');
        }
    };

    return (
        <div className="max-w-2xl mx-auto flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700" style={{ height: 'calc(100vh - 200px)'}}>
            <div className="p-4 border-b dark:border-gray-700 text-center bg-gray-50 dark:bg-gray-700/50 rounded-t-2xl">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{t('livePharmacist.title')}</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{t('livePharmacist.subtitle')}</p>
            </div>
            
            <div className="p-4 text-center border-b dark:border-gray-700">
                 <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{getStatusText()}</p>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-4" aria-live="polite" aria-atomic="false">
                {transcripts.map((item) => (
                    <div key={item.id} className={`flex ${item.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                         <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${item.sender === 'user' ? 'bg-indigo-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
                             <p className="font-bold text-sm mb-1">{item.sender === 'user' ? t('livePharmacist.you') : t('livePharmacist.bot')}</p>
                             <p className="whitespace-pre-wrap">{item.text}</p>
                         </div>
                    </div>
                ))}
            </div>
            
            <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-2xl">
                <button
                    onClick={connectionState === 'connected' || connectionState === 'connecting' ? stopConversation : startConversation}
                    className={`w-full py-3 text-white font-bold rounded-lg shadow-md transition-all transform hover:scale-105 ${
                        (connectionState === 'connected' || connectionState === 'connecting')
                        ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600'
                        : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                    {(connectionState === 'connected' || connectionState === 'connecting') ? t('livePharmacist.stop') : t('livePharmacist.start')}
                </button>
            </div>
        </div>
    );
};

export default LivePharmacist;
