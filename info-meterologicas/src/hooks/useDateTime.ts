import { useState, useEffect } from 'react';

/**
 * Hook para obter a hora atual atualizada a cada segundo.
 */
export const useDateTime = () => {
    const [hours, setHours] = useState<string>('00');
    const [minutes, setMinutes] = useState<string>('00');
    const [seconds, setSeconds] = useState<string>('00');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setHours(String(now.getHours()).padStart(2, '0'));
            setMinutes(String(now.getMinutes()).padStart(2, '0'));
            setSeconds(String(now.getSeconds()).padStart(2, '0'));
        };

        updateTime(); // Chama imediatamente
        const timer = setInterval(updateTime, 1000);

        return () => clearInterval(timer);
    }, []);

    return { hours, minutes, seconds };
};
