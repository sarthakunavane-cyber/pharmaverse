import React, { useState, useEffect, useRef } from 'react';
import { createChat, transcribeAudio } from '../services/geminiService';
import { Message } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';
import { SendIcon } from './icons/SendIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { Chat } from '@google/genai';

const PharmacistChatbot: React.FC = () => {
    const { t } = useTranslation();
    const { language } = useLanguage();
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [transcribing, setTranscribing] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        setMessages([{
            id: 'welcome',
            text: t('pharmacistChatbot.welcomeMessage'),
            sender: 'bot'
        }]);
        const newChat = createChat(language);
        setChat(newChat);
        inputRef.current?.focus();
    }, [language, t]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !chat) return;

        const userMessage: Message = { id: Date.now().toString(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const responseStream = await chat.sendMessageStream({ message: input });
            let botResponse = '';
            let botMessageId = 'bot-' + Date.now();
            let firstChunk = true;

            for await (const chunk of responseStream) {
                botResponse += chunk.text;
                if(firstChunk){
                    setMessages(prev => [...prev, { id: botMessageId, text: botResponse, sender: 'bot' }]);
                    firstChunk = false;
                } else {
                     setMessages(prev => {
                        const newMessages = [...prev];
                        const lastMessage = newMessages[newMessages.length - 1];
                        if (lastMessage.id === botMessageId) {
                            lastMessage.text = botResponse;
                        }
                        return newMessages;
                    });
                }
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { id: 'error-' + Date.now(), text: t('common.error'), sender: 'bot' }]);
        } finally {
            setLoading(false);
        }
    };
    
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = event => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                setTranscribing(true);
                try {
                    const reader = new FileReader();
                    reader.readAsDataURL(audioBlob);
                    reader.onloadend = async () => {
                        const base64Audio = (reader.result as string).split(',')[1];
                        const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
                        const transcription = await transcribeAudio(base64Audio, mimeType);
                        setInput(transcription);
                    };
                } catch (err) {
                     alert(t('pharmacistChatbot.transcriptionError'));
                } finally {
                    setTranscribing(false);
                }
            };
            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (error) {
            alert(t('pharmacistChatbot.micError'));
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };


    return (
        <div className="max-w-2xl mx-auto h-[70vh] flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b dark:border-gray-700 text-center bg-gray-50 dark:bg-gray-700/50 rounded-t-2xl">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{t('pharmacistChatbot.title')}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('pharmacistChatbot.subtitle')}</p>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4" aria-live="polite" aria-atomic="false">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-cyan-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {loading && messages[messages.length-1].sender === 'user' && <div className="flex justify-start"><div className="px-4 py-2 rounded-2xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">...</div></div>}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-2xl">
                <div className="flex items-center space-x-2">
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                        placeholder={isRecording ? t('pharmacistChatbot.recording') : transcribing ? t('pharmacistChatbot.transcribing') : t('pharmacistChatbot.inputPlaceholder')}
                        className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        rows={1}
                        disabled={loading || isRecording || transcribing}
                        aria-label={t('pharmacistChatbot.inputPlaceholder')}
                    />
                     <button
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`p-3 rounded-full text-white transition-colors ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-cyan-500 hover:bg-cyan-600'} focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-400`}
                        disabled={loading || transcribing}
                        aria-label={isRecording ? t('pharmacistChatbot.stopRecording') : t('pharmacistChatbot.startRecording')}
                    >
                        <MicrophoneIcon />
                    </button>
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || loading}
                        className="p-3 rounded-full text-white bg-cyan-500 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-400"
                        aria-label={t('common.send')}
                    >
                        <SendIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PharmacistChatbot;