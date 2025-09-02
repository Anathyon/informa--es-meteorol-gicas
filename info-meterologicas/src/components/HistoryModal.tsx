// src/components/HistoryModal.tsx

import React from 'react';
import { Modal, Button, ListGroup } from 'react-bootstrap';

// Definindo a interface para as props do componente
interface HistoryModalProps {
  show: boolean;
  handleClose: () => void;
  history: string[];
  onClearHistory: () => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ show, handleClose, history, onClearHistory }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Histórico de Locais</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {history.length > 0 ? (
          <ListGroup variant="flush">
            {history.map((city, index) => (
              <ListGroup.Item key={index} className="bg-transparent text-white">
                {city}
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p>O histórico de busca está vazio.</p>
        )}
      </Modal.Body>
      <Modal.Footer className="border-0 justify-content-center">
        <Button variant="danger" onClick={onClearHistory}>
          <i className="bi bi-trash"></i> Limpar Tudo
        </Button>
        <Button variant="secondary" onClick={() => alert('Funcionalidade não implementada.')}>
          <i className="bi bi-clipboard"></i> Copiar Selecionado
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default HistoryModal;