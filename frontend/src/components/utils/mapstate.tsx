import { createContext, useContext, useReducer, useEffect } from 'react';

type MapState = {
  currentLongitude: number | null;
  currentLatitude: number | null;
  currentSeverity: number | 0;
  currentPopulation: number | null;
  currentWeather: string | null;
  totalactiveFires: number | null;
  selectedRegion: string | null;
  currentWindSpeed: number | null;
  currentHumidity: number | null;
  currentTemperature: number | null;
  recommendations: string[];
  recommendationsLoading: boolean;
  recommendationsError: string;
};

type MapAction = 
  | { type: 'SET_CURRENT_LONGITUDE'; payload: number }
  | { type: 'SET_CURRENT_LATITUDE'; payload: number }
  | { type: 'SET_CURRENT_SEVERITY'; payload: number }
  | { type: 'SET_CURRENT_POPULATION'; payload: number }
  | { type: 'SET_TOTAL_ACTIVE_FIRES'; payload: number }
  | { type: 'SET_SELECTED_REGION'; payload: string }
  | { type: 'SET_CURRENT_WEATHER'; payload: string }
  | { type: 'SET_CURRENT_WIND_SPEED'; payload: number }
  | { type: 'SET_CURRENT_HUMIDITY'; payload: number }
  | { type: 'SET_CURRENT_TEMPERATURE'; payload: number }
  | { type: 'SET_RECOMMENDATIONS'; payload: string[] }
  | { type: 'SET_RECOMMENDATIONS_LOADING'; payload: boolean }
  | { type: 'SET_RECOMMENDATIONS_ERROR'; payload: string }
  | { type: 'RESET_RECOMMENDATIONS' }
  | { type: 'RESET_MAP_STATE' };

const getInitialState = (): MapState => {
  try {
    const savedState = localStorage.getItem('mapState');
    return savedState ? JSON.parse(savedState) : {
      currentLongitude: null,
      currentLatitude: null,
      currentSeverity: 0,
      currentPopulation: null,
      currentWeather: null,
      totalactiveFires: null,
      selectedRegion: null,
      currentWindSpeed: null,
      currentHumidity: null,
      currentTemperature: null,
      recommendations: [],
      recommendationsLoading: false,
      recommendationsError: '',
    };
  } catch (error) {
    console.error('Error loading map state from localStorage:', error);
    return {
      currentLongitude: null,
      currentLatitude: null,
      currentSeverity: 0,
      currentPopulation: null,
      currentWeather: null,
      totalactiveFires: null,
      selectedRegion: null,
      currentWindSpeed: null,
      currentHumidity: null,
      currentTemperature: null,
      recommendations: [],
      recommendationsLoading: false,
      recommendationsError: '',
    };
  }
};

function mapReducer(state: MapState, action: MapAction): MapState {
  switch (action.type) {
    case 'SET_CURRENT_LONGITUDE':
      return { ...state, currentLongitude: action.payload };
    case 'SET_CURRENT_LATITUDE':
      return { ...state, currentLatitude: action.payload };
    case 'SET_CURRENT_SEVERITY':
      return { ...state, currentSeverity: action.payload };
    case 'SET_CURRENT_POPULATION':
      return { ...state, currentPopulation: action.payload };
    case 'SET_TOTAL_ACTIVE_FIRES':
      return { ...state, totalactiveFires: action.payload };
    case 'SET_SELECTED_REGION':
      return { ...state, selectedRegion: action.payload };
    case 'SET_CURRENT_WEATHER':
      return { ...state, currentWeather: action.payload };
    case 'SET_CURRENT_WIND_SPEED':
      return { ...state, currentWindSpeed: action.payload };
    case 'SET_CURRENT_HUMIDITY':
      return { ...state, currentHumidity: action.payload };
    case 'SET_CURRENT_TEMPERATURE':
      return { ...state, currentTemperature: action.payload };
    case 'SET_RECOMMENDATIONS':
      return { ...state, recommendations: action.payload };
    case 'SET_RECOMMENDATIONS_LOADING':
      return { ...state, recommendationsLoading: action.payload };
    case 'SET_RECOMMENDATIONS_ERROR':
      return { ...state, recommendationsError: action.payload };
    case 'RESET_RECOMMENDATIONS':
      return { 
        ...state, 
        recommendations: [], 
        recommendationsLoading: false, 
        recommendationsError: '' 
      };
    case 'RESET_MAP_STATE':
      return getInitialState();
    default:
      return state;
  }
}

const MapStateContext = createContext<MapState | undefined>(undefined);
const MapDispatchContext = createContext<React.Dispatch<MapAction> | undefined>(undefined);

export function MapStateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(mapReducer, getInitialState());

  useEffect(() => {
    localStorage.setItem('mapState', JSON.stringify(state));
  }, [state]);

  return (
    <MapStateContext.Provider value={state}>
      <MapDispatchContext.Provider value={dispatch}>
        {children}
      </MapDispatchContext.Provider>
    </MapStateContext.Provider>
  );
}

export function useMapState() {
  const context = useContext(MapStateContext);
  if (context === undefined) {
    throw new Error('useMapState must be used within a MapStateProvider');
  }
  return context;
}

export function useMapDispatch() {
  const context = useContext(MapDispatchContext);
  if (context === undefined) {
    throw new Error('useMapDispatch must be used within a MapStateProvider');
  }
  return context;
}

export const MapActions = {
  setCurrentLongitude: (longitude: number) => ({
    type: 'SET_CURRENT_LONGITUDE' as const,
    payload: longitude
  }),
  setCurrentLatitude: (latitude: number) => ({
    type: 'SET_CURRENT_LATITUDE' as const,
    payload: latitude
  }),
  setCurrentSeverity: (severity: number) => ({
    type: 'SET_CURRENT_SEVERITY' as const,
    payload: severity
  }),
  setCurrentPopulation: (population: number) => ({
    type: 'SET_CURRENT_POPULATION' as const,
    payload: population
  }),
  setTotalactiveFires: (fires: number) => ({
    type: 'SET_TOTAL_ACTIVE_FIRES' as const,
    payload: fires
  }),
  setSelectedRegion: (region: string) => ({
    type: 'SET_SELECTED_REGION' as const,
    payload: region
  }),
  setCurrentWeather: (weather: string) => ({
    type: 'SET_CURRENT_WEATHER' as const,
    payload: weather
  }),
  setCurrentWindSpeed: (windSpeed: number) => ({
    type: 'SET_CURRENT_WIND_SPEED' as const,
    payload: windSpeed
  }),
  setCurrentHumidity: (humidity: number) => ({
    type: 'SET_CURRENT_HUMIDITY' as const,
    payload: humidity
  }),
  setCurrentTemperature: (temperature: number) => ({
    type: 'SET_CURRENT_TEMPERATURE' as const,
    payload: temperature
  }),
  setRecommendations: (recommendations: string[]) => ({
    type: 'SET_RECOMMENDATIONS' as const,
    payload: recommendations
  }),
  setRecommendationsLoading: (loading: boolean) => ({
    type: 'SET_RECOMMENDATIONS_LOADING' as const,
    payload: loading
  }),
  setRecommendationsError: (error: string) => ({
    type: 'SET_RECOMMENDATIONS_ERROR' as const,
    payload: error
  }),
  resetRecommendations: () => ({
    type: 'RESET_RECOMMENDATIONS' as const
  }),
  resetMapState: () => ({ 
    type: 'RESET_MAP_STATE' as const 
  })
};