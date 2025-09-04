import { useState, useEffect, useCallback } from 'react';
import { Modal, Button, ListGroup } from 'react-bootstrap';

interface HistoryModalProps {
    show: boolean;
    handleClose: () => void;
    history: string[];
    onClearHistory: () => void;
    onSelectCity: (city: string) => void;
    onRemoveSelected: (city: string) => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ show, handleClose, history, onClearHistory, onSelectCity, onRemoveSelected }) => {
    const [selectedItem, setSelectedItem] = useState<string | null>(null);

    useEffect(() => {
        if (!show) {
            setSelectedItem(null);
        }
    }, [show]);

    const handleItemClick = (city: string) => {
        setSelectedItem(city);
    };

    const handleRemoveSelected = () => {
        if (selectedItem) {
            onRemoveSelected(selectedItem);
            setSelectedItem(null);
        }
    };

    const handleCopySelected = () => {
        if (selectedItem) {
            navigator.clipboard.writeText(selectedItem)
                .then(() => alert(`'${selectedItem}' copiado para a área de transferência!`))
                .catch(err => console.error('Erro ao copiar: ', err));
        }
    };
    
    const handleNavigation = (e: React.KeyboardEvent | React.WheelEvent) => {
        if (!history.length) return;

        const currentIndex = selectedItem ? history.indexOf(selectedItem) : -1;
        let nextIndex = currentIndex;

        if ('key' in e) {
            e.preventDefault();
            if (e.key === 'ArrowDown') {
                nextIndex = (currentIndex + 1) % history.length;
            } else if (e.key === 'ArrowUp') {
                nextIndex = (currentIndex - 1 + history.length) % history.length;
            }
        } else if ('deltaY' in e) {
            if (e.deltaY > 0) {
                nextIndex = (currentIndex + 1) % history.length;
            } else {
                nextIndex = (currentIndex - 1 + history.length) % history.length;
            }
        }
        
        if (nextIndex !== currentIndex) {
            setSelectedItem(history[nextIndex]);
        }
    };
    
    const handleEscapeKey = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            handleClose();
        }
    }, [handleClose]);

    useEffect(() => {
        if (show) {
            window.addEventListener('keydown', handleEscapeKey);
        } else {
            window.removeEventListener('keydown', handleEscapeKey);
        }
        return () => window.removeEventListener('keydown', handleEscapeKey);
    }, [show, handleEscapeKey]);

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton className="modal-header-custom">
                <Modal.Title>Histórico de Locais</Modal.Title>
            </Modal.Header>
            <Modal.Body
                onKeyDown={handleNavigation as React.KeyboardEventHandler}
                onWheel={handleNavigation as React.WheelEventHandler}
                tabIndex={0}
                className="modal-body-custom"
            >
                <ListGroup>
                    {history.map((city, index) => (
                        <ListGroup.Item
                            key={index}
                            action
                            onClick={() => handleItemClick(city)}
                            onDoubleClick={() => onSelectCity(city)}
                            active={city === selectedItem}
                            className="history-list-item"
                        >
                            {city}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Modal.Body>
            <Modal.Footer className="modal-footer-custom justify-content-center">
                <Button variant="danger" onClick={onClearHistory}>
                    Limpar Tudo
                </Button>
                <Button variant="secondary" onClick={handleRemoveSelected} disabled={!selectedItem}>
                    Remover Selecionado
                </Button>
                <Button variant="primary" onClick={handleCopySelected} disabled={!selectedItem}>
                    Copiar Selecionado
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default HistoryModal;