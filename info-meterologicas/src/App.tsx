import WeatherApp from './components/WeatherApp';
import { PWANotification } from './components/PWANotification';


function App() {
  return (
    <>
      <PWANotification />
      <WeatherApp />
    </>
  );
}

export default App;