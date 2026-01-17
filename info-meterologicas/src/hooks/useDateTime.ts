import { useState, useEffect } from 'react';

/**
 * Hook to get the current time updated every second.
 * Supports a timezone offset in seconds from UTC.
 * @param timezoneOffset - Offset in seconds relative to UTC (from OpenWeatherMap API).
 */
export const useDateTime = (timezoneOffset?: number) => {
    const [hours, setHours] = useState<string>('00');
    const [minutes, setMinutes] = useState<string>('00');
    const [seconds, setSeconds] = useState<string>('00');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();

            let localTime: Date;

            if (timezoneOffset !== undefined) {
                // Get UTC time by subtracting local machine offset
                const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
                // Apply the target timezone offset (in seconds)
                localTime = new Date(utc + (1000 * timezoneOffset));
            } else {
                localTime = now;
            }

            setHours(String(localTime.getHours()).padStart(2, '0'));
            setMinutes(String(localTime.getMinutes()).padStart(2, '0'));
            setSeconds(String(localTime.getSeconds()).padStart(2, '0'));
        };

        updateTime(); // Initial call
        const timer = setInterval(updateTime, 1000);

        return () => clearInterval(timer);
    }, [timezoneOffset]);

    return { hours, minutes, seconds };
};
