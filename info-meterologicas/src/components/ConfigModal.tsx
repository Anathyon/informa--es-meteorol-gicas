import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, FormControl } from 'react-bootstrap';
import { useWeatherStore } from '../store/weatherStore';

interface ConfigModalProps {
    show: boolean;
    handleClose: () => void;
}

const ConfigModal: React.FC<ConfigModalProps> = ({ show, handleClose }) => {
    const { 
        theme, 
        setTheme, 
        isAutoUpdateEnabled, 
        toggleAutoUpdate 
    } = useWeatherStore();

    const [selectedTheme, setSelectedTheme] = useState<string>(theme);

    // Sync local state when store theme changes or modal opens
    useEffect(() => {
        setSelectedTheme(theme);
    }, [theme, show]);

    const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const newTheme = event.target.value;
        setSelectedTheme(newTheme);
        setTheme(newTheme);
    };

    const handleAutoUpdateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        toggleAutoUpdate(event.target.checked);
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton className="modal-header-custom">
                <Modal.Title>Configurações</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body-custom">
                <Form>
                    <Form.Group className="mb-3 d-flex justify-content-between align-items-center">
                        <Form.Label className="config-label mb-0">Atualização Automática (15 min)</Form.Label>
                        <Form.Check
                            type="switch"
                            id="autoUpdateSwitch"
                            checked={isAutoUpdateEnabled}
                            onChange={handleAutoUpdateChange}
                            className="config-switch"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3 d-flex justify-content-between align-items-center">
                        <Form.Label className="config-label mb-0">Tema</Form.Label>
                        <FormControl
                            as="select"
                            value={selectedTheme}
                            onChange={handleThemeChange}
                            className="config-select"
                        >
                            <option value="automatico">Automático</option>
                            <option value="manha">Manhã</option>
                            <option value="tarde">Tarde</option>
                            <option value="noite">Noite</option>
                        </FormControl>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className="modal-footer-custom">
                <Button variant="secondary" onClick={handleClose}>
                    Fechar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfigModal;