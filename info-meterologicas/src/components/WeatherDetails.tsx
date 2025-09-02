import 'bootstrap-icons/font/bootstrap-icons.css';

// Reutilizando a interface para garantir a tipagem correta
interface WeatherData {
  name: string;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: [{
    description: string;
    icon: string;
  }];
  wind: {
    speed: number;
  };
  visibility: number;
  dt: number;
}

interface WeatherDetailsProps {
  data: WeatherData;
}

const WeatherDetails: React.FC<WeatherDetailsProps> = ({ data }) => {
  // Função para formatar o timestamp do nascer/pôr do sol para HH:MM
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  // Converte velocidade do vento de m/s para km/h
  const windSpeedKmH = (data.wind.speed * 3.6).toFixed(1);

  // Converte visibilidade de metros para km
  const visibilityKm = (data.visibility / 1000).toFixed(1);

  return (
    <div className="weather-details-container">
      <div className="row">
        {/* Coluna Esquerda: Descrição e Sensação */}
        <div className="col-md-6 mb-4 mb-md-0">
          <h3 className="text-capitalize">{data.weather[0].description}</h3>
          <p>Sensação: {Math.round(data.main.feels_like)}°C</p>
        </div>
        {/* Coluna Direita: Umidade, Vento e Visibilidade */}
        <div className="col-md-6">
          <div className="detail-item">
            <i className="bi bi-droplet-fill"></i> Umidade: {data.main.humidity}%
          </div>
          <div className="detail-item">
            <i className="bi bi-wind"></i> Vento: {windSpeedKmH} km/h
          </div>
          <div className="detail-item">
            <i className="bi bi-eye-fill"></i> Visibilidade: {visibilityKm} km
          </div>
        </div>
      </div>

      <div className="row mt-4">
        {/* Cards de Informações Adicionais */}
        <div className="col-6 col-md-3 mb-3">
          <div className="info-card">
            <i className="bi bi-thermometer-half"></i>
            <div>Min/Máx</div>
            <div>{Math.round(data.main.temp_min)}° / {Math.round(data.main.temp_max)}°</div>
          </div>
        </div>
        <div className="col-6 col-md-3 mb-3">
          <div className="info-card">
            <i className="bi bi-arrows-collapse"></i>
            <div>Pressão</div>
            <div>{data.main.pressure} hPa</div>
          </div>
        </div>
        <div className="col-6 col-md-3 mb-3">
          <div className="info-card">
            <i className="bi bi-sunrise-fill"></i>
            <div>Nascer do Sol</div>
            <div>{formatTime(data.sys.sunrise)}</div>
          </div>
        </div>
        <div className="col-6 col-md-3 mb-3">
          <div className="info-card">
            <i className="bi bi-sunset-fill"></i>
            <div>Pôr do Sol</div>
            <div>{formatTime(data.sys.sunset)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDetails;