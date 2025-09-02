import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';


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
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Atualização Automática"
              defaultChecked
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Tema</Form.Label>
            <Form.Select>
              <option>Automático</option>
              <option>Claro</option>
              <option>Escuro</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ConfigModal;