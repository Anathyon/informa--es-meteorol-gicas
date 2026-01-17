export interface WeatherData {
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
    coord: {
        lat: number;
        lon: number;
    };
    timezone: number;
}

export interface HourlyForecastData {
    time: string;
    temp: number;
    icon: string;
}

export interface DailyForecastData {
    day: string;
    minTemp: number;
    maxTemp: number;
    icon: string;
}

export interface AirQualityAPIResponse {
    coord: {
        lon: number;
        lat: number;
    };
    list: [{
        main: {
            aqi: number;
        };
        components: {
            co: number;
            o3: number;
            pm2_5: number;
            pm10: number;
        };
    }];
}

export interface AirQualityData {
    aqi: number;
    components: {
        co: number;
        o3: number;
        pm2_5: number;
        pm10: number;
    };
}

export interface ForecastItem {
    dt: number;
    main: {
        temp: number;
        temp_min: number;
        temp_max: number;
    };
    weather: [{
        icon: string;
    }];
}
