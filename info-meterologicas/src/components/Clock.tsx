import React from 'react';
import { useDateTime } from '../hooks/useDateTime';
import { useWeatherStore } from '../store/weatherStore';

/**
 * Clock Component
 * Displays Hours, Minutes, and Seconds synchronized with the searched city's timezone.
 */
const Clock: React.FC = () => {
    const { weatherData } = useWeatherStore();
    const { hours, minutes, seconds } = useDateTime(weatherData?.timezone);

    return (
        <div className="clock-display">
            <div className="clock-segment">{hours}</div>
            <div className="clock-segment">{minutes}</div>
            <div className="clock-segment">{seconds}</div>
        </div>
    );
};

export default Clock;
