import { renderHook, act } from '@testing-library/react';
import useVoiceSearch from './useVoiceSearch';

// Mock Web Speech API
const mockStart = jest.fn();
const mockStop = jest.fn();

class MockSpeechRecognition {
    start = mockStart;
    stop = mockStop;
    onstart = null;
    onresult = null;
    onerror = null;
    onend = null;
    lang = '';
    continuous = false;
    interimResults = false;
}

(window as any).webkitSpeechRecognition = MockSpeechRecognition;

describe('useVoiceSearch', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should initialize with default values', () => {
        const { result } = renderHook(() => useVoiceSearch({ onResult: jest.fn() }));

        expect(result.current.isListening).toBe(false);
        expect(result.current.transcript).toBe('');
        expect(result.current.error).toBe(null);
    });

    it('should call start on recognition when startListening is called', () => {
        const { result } = renderHook(() => useVoiceSearch({ onResult: jest.fn() }));

        act(() => {
            result.current.startListening();
        });

        expect(mockStart).toHaveBeenCalled();
    });

    it('should call stop on recognition when stopListening is called', () => {
        const { result } = renderHook(() => useVoiceSearch({ onResult: jest.fn() }));

        act(() => {
            result.current.stopListening();
        });

        expect(mockStop).toHaveBeenCalled();
    });
});
