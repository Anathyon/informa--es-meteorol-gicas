import { useState, useEffect, useCallback, useRef } from 'react';

interface UseVoiceSearchProps {
    onResult: (transcript: string) => void;
    onError?: (error: string) => void;
}

interface UseVoiceSearchReturn {
    isListening: boolean;
    transcript: string;
    startListening: () => void;
    stopListening: () => void;
    error: string | null;
}

interface IWindow extends Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
}

const useVoiceSearch = ({ onResult, onError }: UseVoiceSearchProps): UseVoiceSearchReturn => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);
    const recognitionRef = useRef<any>(null);

    // Use refs for callbacks to avoid re-initializing recognition when they change
    const onResultRef = useRef(onResult);
    const onErrorRef = useRef(onError);

    useEffect(() => {
        onResultRef.current = onResult;
        onErrorRef.current = onError;
    }, [onResult, onError]);

    useEffect(() => {
        const { webkitSpeechRecognition, SpeechRecognition } = window as unknown as IWindow;
        const SpeechRecognitionApi = SpeechRecognition || webkitSpeechRecognition;

        if (!SpeechRecognitionApi) {
            const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
            const msg = isFirefox
                ? "O Firefox não suporta Pesquisa por Voz nativamente. Tente usar Chrome ou Edge."
                : "Seu navegador não suporta reconhecimento de voz.";
            setError(msg);
            return;
        }

        const recognition = new SpeechRecognitionApi();
        recognition.continuous = false; // Stop after one result
        recognition.interimResults = true; // Show results as they are spoken
        recognition.lang = navigator.language || 'pt-BR'; // Use browser's language

        recognition.onstart = () => {
            setIsListening(true);
            setError(null);
            setTranscript('');
        };

        recognition.onresult = (event: any) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            const currentTranscript = finalTranscript || interimTranscript;
            setTranscript(currentTranscript);

            if (finalTranscript) {
                onResultRef.current(finalTranscript);
            }
        };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            let errorMessage = 'Erro ao reconhecer áudio.';
            if (event.error === 'no-speech') {
                errorMessage = 'Nenhuma fala detectada.';
            } else if (event.error === 'not-allowed') {
                errorMessage = 'Permissão de microfone negada.';
            }

            setError(errorMessage);
            if (onErrorRef.current) onErrorRef.current(errorMessage);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []); // Only initialize once

    const startListening = useCallback(() => {
        setIsListening(false);
        setError(null);
        setTranscript('');

        if (recognitionRef.current) {
            try {
                recognitionRef.current.start();
            } catch (e) {
                console.error("Error starting recognition:", e);
                // If already started, it might throw, so we catch it
            }
        } else {
            setError("Reconhecimento de voz não suportado neste navegador.");
        }
    }, []);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    }, []);

    return {
        isListening,
        transcript,
        startListening,
        stopListening,
        error
    };
};

export default useVoiceSearch;
