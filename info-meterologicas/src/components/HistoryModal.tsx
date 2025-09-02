// src/components/HistoryModal.tsx

import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

// Definindo a interface para as props do componente
interface HistoryModalProps {
  show: boolean;
  handleClose: () => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Histórico de Locais</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="modal-buttons">
          <Button variant="danger">Limpar Tudo</Button>
          <Button variant="secondary">Copiar Selecionado</Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default HistoryModal;