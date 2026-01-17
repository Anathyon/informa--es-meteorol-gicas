import React, { useMemo } from 'react';

/**
 * MoonPhase Component
 * Calculates and displays the current phase of the moon based on the date.
 * Uses a simple calculation for moon cycle (approx. 29.53 days).
 */
const MoonPhase: React.FC = () => {
    
    // Moon phase calculation logic
    const moonPhaseInfo = useMemo(() => {
        const now = new Date();
        const lp = 2551443; // Lunar period in seconds (approx 29.53 days)
        const newMoonDate = new Date(1970, 0, 7, 20, 35, 0).getTime() / 1000;
        const phase = (((now.getTime() / 1000) - newMoonDate) % lp) / lp;
        
        // Phase ranges (0 to 1)
        // 0-0.03: New Moon
        // 0.03-0.23: Waxing Crescent
        // 0.23-0.27: First Quarter
        // 0.27-0.47: Waxing Gibbous
        // 0.47-0.53: Full Moon
        // 0.53-0.73: Waning Gibbous
        // 0.73-0.77: Last Quarter
        // 0.77-0.97: Waning Crescent
        // 0.97-1: New Moon
        
        let name = "";
        let shadowStyle = {}; // For visual representation
        
        if (phase <= 0.03 || phase > 0.97) {
            name = "Lua Nova";
            shadowStyle = { width: '100%', left: '0' };
        } else if (phase <= 0.23) {
            name = "Lua Crescente Côncava";
            shadowStyle = { width: '70%', left: '30%', borderRadius: '50%' };
        } else if (phase <= 0.27) {
            name = "Quarto Crescente";
            shadowStyle = { width: '50%', left: '50%' };
        } else if (phase <= 0.47) {
            name = "Lua Crescente Convexa";
            shadowStyle = { width: '20%', left: '80%', borderRadius: '50%' };
        } else if (phase <= 0.53) {
            name = "Lua Cheia";
            shadowStyle = { width: '0%', left: '0' };
        } else if (phase <= 0.73) {
            name = "Lua Minguante Convexa";
            shadowStyle = { width: '20%', left: '0', borderRadius: '50%' };
        } else if (phase <= 0.77) {
            name = "Quarto Minguante";
            shadowStyle = { width: '50%', left: '0' };
        } else {
            name = "Lua Minguante Côncava";
            shadowStyle = { width: '70%', left: '0', borderRadius: '50%' };
        }

        return { name, phase: (phase * 100).toFixed(1), shadowStyle };
    }, []);

    return (
        <div className="moon-phase-container">
            <h3>Fase da Lua</h3>
            <div className="moon-visual">
                <div className="moon-shadow" style={moonPhaseInfo.shadowStyle}></div>
            </div>
            <div className="moon-phase-info">
                <span className="moon-phase-name">{moonPhaseInfo.name}</span>
                <span className="moon-phase-details">Iluminação: {100 - parseFloat(moonPhaseInfo.phase) < 50 ? moonPhaseInfo.phase : 100 - parseFloat(moonPhaseInfo.phase)}%</span>
            </div>
        </div>
    );
};

export default MoonPhase;
