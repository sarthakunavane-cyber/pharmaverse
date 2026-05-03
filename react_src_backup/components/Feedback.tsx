import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from '../hooks/useTranslation';

const Feedback: React.FC = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [feedbackText, setFeedbackText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showThanks, setShowThanks] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const triggerButtonRef = useRef<HTMLButtonElement>(null);

    const closeModal = useCallback(() => {
        if (isSubmitting) return;
        setIsOpen(false);
        triggerButtonRef.current?.focus();
        setTimeout(() => {
            setShowThanks(false);
            setFeedbackText('');
        }, 300);
    }, [isSubmitting]);
    
    const openModal = () => setIsOpen(true);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!feedbackText.trim()) return;
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setShowThanks(true);
            setTimeout(closeModal, 2000); // Close after 2 seconds
        }, 1000);
    };

    // Handle keyboard events (ESC to close)
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeModal();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, closeModal]);

    // Trap focus inside modal
    useEffect(() => {
        if (isOpen && modalRef.current) {
            const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            const handleTabKey = (e: KeyboardEvent) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey && document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    } else if (!e.shiftKey && document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            };
            
            firstElement?.focus();
            modalRef.current.addEventListener('keydown', handleTabKey);

            return () => {
                modalRef.current?.removeEventListener('keydown', handleTabKey);
            };
        }
    }, [isOpen]);


    return (
        <>
            <button
                ref={triggerButtonRef}
                onClick={openModal}
                className="fixed bottom-5 right-5 z-20 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold py-3 px-5 rounded-full shadow-lg hover:scale-110 transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                aria-label={t('feedback.buttonLabel')}
            >
                {t('feedback.buttonText')}
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-60 z-40 flex items-center justify-center p-4 transition-opacity duration-300"
                    aria-modal="true"
                    role="dialog"
                    onClick={closeModal}
                >
                    <div
                        ref={modalRef}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-8 transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
                        onClick={(e) => e.stopPropagation()}
                        aria-labelledby="feedback-modal-title"
                    >
                        <style>{`
                            @keyframes fade-in-scale {
                                from { transform: scale(0.95); opacity: 0; }
                                to { transform: scale(1); opacity: 1; }
                            }
                            .animate-fade-in-scale { animation: fade-in-scale 0.3s ease-out forwards; }
                        `}</style>
                        
                        {!showThanks ? (
                            <>
                                <div className="flex justify-between items-start">
                                    <h2 id="feedback-modal-title" className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('feedback.modalTitle')}</h2>
                                    <button onClick={closeModal} aria-label={t('feedback.close')} className="p-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mt-2">{t('feedback.modalSubtitle')}</p>
                                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                                    <textarea
                                        value={feedbackText}
                                        onChange={(e) => setFeedbackText(e.target.value)}
                                        placeholder={t('feedback.placeholder')}
                                        className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
                                        required
                                        aria-label={t('feedback.placeholder')}
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-3 text-white font-bold rounded-lg shadow-md bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 disabled:from-gray-400 disabled:to-gray-500 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                                    >
                                        {isSubmitting ? t('feedback.submitting') : t('feedback.submitButton')}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <div className="mx-auto w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-4">{t('feedback.thanksTitle')}</h2>
                                <p className="text-gray-600 dark:text-gray-300 mt-2">{t('feedback.thanksSubtitle')}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Feedback;