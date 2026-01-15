import React from 'react';
import { Modal } from 'react-bootstrap';
import { motion } from 'framer-motion';

interface VoiceSearchModalProps {
    show: boolean;
    onHide: () => void;
    transcript: string;
    isListening: boolean;
    error: string | null;
}

const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({ show, onHide, transcript, isListening, error }) => {
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
                        borderColor: ["#ffff", "#00d2ff", "#ff"]
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
                        boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)'
                    }}
                >
                     <i className={`bi bi-mic-fill fs-1 ${error ? 'text-danger' : 'text-white'}`}></i>
                </motion.div>

                {error ? (
                    <p className="text-danger fs-5">{error}</p>
                ) : (
                    <>
                        <h4 className="text-white mb-3">
                            {isListening ? 'Ouvindo...' : 'Processando...'}
                        </h4>
                        <div style={{ minHeight: '3em' }}>
                            <p className="text-white-50 fst-italic fs-5">
                                "{transcript || 'Fale o local que deseja pesquisar...'}"
                            </p>
                        </div>
                    </>
                )}
                
                <button 
                    className="btn btn-outline-light mt-4 px-4 rounded-pill"
                    onClick={onHide}
                >
                    Cancelar
                </button>
            </Modal.Body>
        </Modal>
    );
};

export default VoiceSearchModal;
