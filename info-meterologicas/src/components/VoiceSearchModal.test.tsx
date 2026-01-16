import { render, screen, fireEvent } from '@testing-library/react';
import VoiceSearchModal from './VoiceSearchModal';
import '@testing-library/jest-dom';

describe('VoiceSearchModal', () => {
    const defaultProps = {
        show: true,
        onHide: jest.fn(),
        transcript: '',
        isListening: true,
        error: null,
        onRetry: jest.fn(),
    };

    it('should render the modal with "Ouvindo..." when isListening is true', () => {
        render(<VoiceSearchModal {...defaultProps} />);
        expect(screen.getByText('Ouvindo...')).toBeInTheDocument();
        expect(screen.getByText(/Fale o nome da cidade/)).toBeInTheDocument();
    });

    it('should show the transcript when provided', () => {
        render(<VoiceSearchModal {...defaultProps} transcript="São Paulo" />);
        expect(screen.getByText('"São Paulo"')).toBeInTheDocument();
    });

    it('should show error message when error is provided', () => {
        render(<VoiceSearchModal {...defaultProps} error="Permissão negada" />);
        expect(screen.getByText('Permissão negada')).toBeInTheDocument();
    });

    it('should call onHide when Cancelar button is clicked', () => {
        const onHideMock = jest.fn();
        render(<VoiceSearchModal {...defaultProps} onHide={onHideMock} />);
        
        const cancelButton = screen.getByText('Cancelar');
        fireEvent.click(cancelButton);
        
        expect(onHideMock).toHaveBeenCalled();
    });
});
