import React, { useMemo } from 'react';

/**
 * Interface for SolarCycle component props.
 * @param sunrise - Sunrise timestamp in seconds.
 * @param sunset - Sunset timestamp in seconds.
 * @param currentTime - Optional current timestamp in seconds (defaults to now).
 */
interface SolarCycleProps {
    sunrise: number;
    sunset: number;
    currentTime?: number;
}

/**
 * SolarCycle Component
 * Displays a semi-circular arc representing the sun's path during the day.
 * The sun icon moves along the arc based on the current time relative to sunrise and sunset.
 */
const SolarCycle: React.FC<SolarCycleProps> = ({ sunrise, sunset, currentTime = Math.floor(Date.now() / 1000) }) => {
    
    // Calculate progress (0 to 1) between sunrise and sunset
    const progress = useMemo(() => {
        if (currentTime < sunrise) return 0;
        if (currentTime > sunset) return 1;
        return (currentTime - sunrise) / (sunset - sunrise);
    }, [sunrise, sunset, currentTime]);

    // Calculate sun position on the semi-circle
    // The arc goes from 180 degrees (sunrise, left) to 0 degrees (sunset, right)
    const sunPosition = useMemo(() => {
        // Angle in radians (Math.PI is 180 degrees)
        const angle = Math.PI - (progress * Math.PI);
        
        // Semi-circle radius is 100px (half of 200px width)
        const radius = 100;
        
        // Calculate X and Y coordinates relative to the center (100, 100)
        // Adjust results to fit within the 200x100 container
        const x = 100 + (radius * Math.cos(angle));
        const y = 100 - (radius * Math.sin(angle)); // Subtract because Y grows downwards in CSS

        return { left: `${x}px`, top: `${y}px` };
    }, [progress]);

    const formatTime = (ts: number) => {
        return new Date(ts * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="solar-cycle-container">
            <h3>Ciclo Solar</h3>
            <div className="solar-arc-wrapper">
                <div className="solar-arc"></div>
                <div 
                    className="sun-icon-path" 
                    style={{ 
                        left: sunPosition.left, 
                        top: sunPosition.top,
                        opacity: currentTime >= sunrise && currentTime <= sunset ? 1 : 0.3
                    }}
                    title="Posição do Sol"
                ></div>
            </div>
            <div className="solar-times">
                <div className="time-item">
                    <i className="bi bi-sunrise-fill text-warning"></i>
                    <span>Nascer</span>
                    <strong>{formatTime(sunrise)}</strong>
                </div>
                <div className="time-item">
                    <i className="bi bi-sunset-fill text-danger"></i>
                    <span>Pôr</span>
                    <strong>{formatTime(sunset)}</strong>
                </div>
            </div>
        </div>
    );
};

export default SolarCycle;
