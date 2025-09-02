import React from 'react';
import { Modal, Form } from 'react-bootstrap';


interface ConfigModalProps {
  show: boolean;
  handleClose: () => void;
}

const ConfigModal: React.FC<ConfigModalProps> = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Configurações</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3 d-flex justify-content-between align-items-center" controlId="formAutoUpdate">
            <Form.Label className="mb-0">Atualização Automática</Form.Label>
            <Form.Check 
              type="switch"
              id="auto-update-switch"
            />
          </Form.Group>
          <hr className="border-light"/>
          <Form.Group className="mb-3 d-flex justify-content-between align-items-center" controlId="formTheme">
            <Form.Label className="mb-0">Tema</Form.Label>
            <Form.Select style={{ width: '150px' }} className="bg-dark text-white">
              <option>Automático</option>
              <option value="1">Manhã</option>
              <option value="2">Tarde</option>
              <option value="3">Noite</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ConfigModal;