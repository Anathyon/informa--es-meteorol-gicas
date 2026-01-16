import React from 'react';
import { Modal } from 'react-bootstrap';
import { motion } from 'framer-motion';

interface VoiceSearchModalProps {
    show: boolean;
    onHide: () => void;
    transcript: string;
    isListening: boolean;
    error: string | null;
    onRetry: () => void;
}

const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({ show, onHide, transcript, isListening, error, onRetry }) => {
    return (
        <Modal 
            show={show} 
            onHide={onHide} 
            centered 
            className="voice-search-modal"
            contentClassName="glass-modal-content"
            backdropClassName="glass-modal-backdrop"
        >
            <Modal.Body className="d-flex flex-column align-items-center justify-content-center p-5 text-center">
                <motion.div
                    animate={isListening ? {
                        scale: [1, 1.2, 1],
                        borderColor: ["#ffffff", "#00d2ff", "#ffffff"]
                    } : {}}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        border: '4px solid white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '2rem',
                        boxShadow: isListening ? '0 0 25px rgba(0, 210, 255, 0.5)' : '0 0 20px rgba(255, 255, 255, 0.3)',
                        backgroundColor: error ? 'rgba(220, 53, 69, 0.1)' : 'transparent'
                    }}
                >
                     <i className={`bi bi-${error ? 'mic-mute-fill' : 'mic-fill'} fs-1 ${error ? 'text-danger' : 'text-white'}`}></i>
                </motion.div>

                {error ? (
                    <div className="mb-3">
                        <p className="text-danger fs-5 mb-1">{error}</p>
                        <p className="text-white-50 small">Não conseguimos captar sua voz corretamente.</p>
                    </div>
                ) : (
                    <>
                        <h4 className="text-white mb-3">
                            {isListening ? 'Ouvindo...' : transcript ? 'Processando...' : 'Aguardando áudio...'}
                        </h4>
                        <div style={{ minHeight: '3em' }}>
                            <p className="text-white-50 fst-italic fs-5">
                                "{transcript || 'Fale o local que deseja pesquisar...'}"
                            </p>
                        </div>
                    </>
                )}
                
                <div className="d-flex gap-3 mt-4">
                    {(error || (!isListening && !transcript)) && (
                        <button 
                            className="btn btn-primary rounded-pill px-4"
                            onClick={onRetry}
                        >
                            <i className="bi bi-arrow-clockwise me-2"></i>
                            Tentar novamente
                        </button>
                    )}
                    <button 
                        className="btn btn-outline-light px-4 rounded-pill"
                        onClick={onHide}
                    >
                        Cancelar
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default VoiceSearchModal;
