import { useState, useEffect } from 'react';
import HistoryModal from './HistoryModal';
import ConfigModal from './ConfigModal';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "/src/index.css";

const WeatherApp: React.FC = () => {
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [currentDate, setCurrentDate] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [theme, setTheme] = useState<string>('');

  const handleShowHistory = () => setShowHistory(true);
  const handleCloseHistory = () => setShowHistory(false);

  const handleShowConfig = () => setShowConfig(true);
  const handleCloseConfig = () => setShowConfig(false);

  const formatarData = (data: Date): string => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return data.toLocaleDateString('pt-BR', options);
  };

  const getThemeByTime = (): string => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
      return 'manha';
    } else if (hour >= 12 && hour < 18) {
      return 'tarde';
    } else {
      return 'noite';
    }
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDate(formatarData(now));
      setCurrentTime(now.toLocaleTimeString('pt-BR'));
      setTheme(getThemeByTime());
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`weather-container ${theme}`}>
      <i className="bi bi-gear-fill gear-icon" onClick={handleShowConfig}></i>
      <div className="glass-container">
        <h1>São Paulo, BR</h1>
        <p>{currentDate}</p>
        <p>Relógio: {currentTime}</p>
        
        <div className="glass-temperature">
          22<span className="glass-temperature-small">°C</span>
          <img src={`/src/assets/imagens/${theme === 'noite' ? 'Design sem nome.png' : theme === 'tarde' ? '1.png' : '2.png'}`} alt="Clima" style={{ width: '80px', height: '80px', marginLeft: '20px' }} />
        </div>
        
        <div className="glass-search-bar">
          <input type="text" placeholder="Digite outra cidade..." className="glass-input" />
          <div className="glass-button"><i className="bi bi-search"></i></div>
        </div>
        
        <div className="d-flex justify-content-center gap-2 mt-3">
          <button className="btn btn-secondary glass-btn" onClick={handleShowHistory}>Histórico</button>
          <button className="btn btn-secondary glass-btn" onClick={handleShowConfig}>Config</button>
        </div>
      </div>

      <HistoryModal show={showHistory} handleClose={handleCloseHistory} />
      <ConfigModal show={showConfig} handleClose={handleCloseConfig} />
    </div>
  );
};

export default WeatherApp;