import React from 'react';
import { useDateTime } from '../hooks/useDateTime';

/**
 * Componente de Relógio que exibe Horas, Minutos e Segundos.
 * Extraído para evitar re-renderizações desnecessárias do componente principal.
 */
const Clock: React.FC = () => {
    const { hours, minutes, seconds } = useDateTime();

    return (
        <div className="clock-display">
            <div className="clock-segment">{hours}</div>
            <div className="clock-segment">{minutes}</div>
            <div className="clock-segment">{seconds}</div>
        </div>
    );
};

export default Clock;
