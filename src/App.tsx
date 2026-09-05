/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { ForecastRow } from './components/ForecastRow';
import { TemperatureChart } from './components/TemperatureChart';
import { PlanningRecommendations } from './components/PlanningRecommendations';
import { ErrorState } from './components/ErrorState';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { fetchWeatherByCityName, fetchCityWeather, CityNotFoundError } from './services/openMeteo';
import { WeatherData, UnitSystem, GeocodingResult } from './types';
import { generatePlanningRecommendations } from './utils/recommendations';
import { Cloud, ShieldCheck } from 'lucide-react';

export default function App() {
  const [city, setCity] = useState<string>('London');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCityNotFound, setIsCityNotFound] = useState<boolean>(false);
  const [units, setUnits] = useState<UnitSystem>('metric');

  const loadWeather = useCallback(async (targetCity: string) => {
    setIsLoading(true);
    setError(null);
    setIsCityNotFound(false);

    try {
      const data = await fetchWeatherByCityName(targetCity);
      setWeatherData(data);
      setCity(data.city);
    } catch (err: unknown) {
      console.error('Failed to load weather data:', err);
      if (err instanceof CityNotFoundError) {
        setIsCityNotFound(true);
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred while fetching weather data.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSelectLocation = useCallback(async (location: GeocodingResult) => {
    setIsLoading(true);
    setError(null);
    setIsCityNotFound(false);

    try {
      const data = await fetchCityWeather(location);
      setWeatherData(data);
      setCity(data.city);
    } catch (err: unknown) {
      console.error('Failed to load weather data:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred while fetching weather data.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load with default city (London)
  useEffect(() => {
    loadWeather('London');
  }, [loadWeather]);

  const handleSearch = (newCity: string) => {
    if (newCity.trim()) {
      loadWeather(newCity.trim());
    }
  };

  const handleToggleUnits = () => {
    setUnits((prev) => (prev === 'metric' ? 'imperial' : 'metric'));
  };

  const recommendations = useMemo(() => {
    if (!weatherData) return [];
    return generatePlanningRecommendations(weatherData, units === 'imperial');
  }, [weatherData, units]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      {/* Bento Header */}
      <Header
        currentCity={city}
        onSearch={handleSearch}
        onSelectLocation={handleSelectLocation}
        isLoading={isLoading}
        units={units}
        onToggleUnits={handleToggleUnits}
        onRefresh={() => loadWeather(city)}
      />

      {/* Main Bento Grid Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-5 min-w-0">
        {/* Error State */}
        {error && !isLoading && (
          <ErrorState
            message={error}
            isCityNotFound={isCityNotFound}
            onRetry={() => loadWeather(city)}
            onSelectSuggestedCity={(suggested) => handleSearch(suggested)}
          />
        )}

        {/* Loading Skeleton */}
        {isLoading && !weatherData && <LoadingSkeleton cityName={city} />}

        {/* Bento Grid Layout */}
        {weatherData && (
          <div
            className={`grid grid-cols-1 lg:grid-cols-12 gap-5 transition-opacity duration-200 min-w-0 ${
              isLoading ? 'opacity-60' : 'opacity-100'
            }`}
          >
            {/* Primary Left Column (Span 8) */}
            <div className="lg:col-span-8 flex flex-col gap-5 min-w-0 w-full">
              {/* Current Weather Bento Hero */}
              <CurrentWeatherCard data={weatherData} units={units} />

              {/* Temperature Trend Chart Bento Card */}
              <TemperatureChart daily={weatherData.daily} units={units} />

              {/* Actionable Planning Intelligence Bento Card */}
              <PlanningRecommendations recommendations={recommendations} />
            </div>

            {/* Right Column (Span 4) - 7-Day Forecast Bento Stack */}
            <div className="lg:col-span-4 flex flex-col min-w-0 w-full">
              <ForecastRow daily={weatherData.daily} units={units} />
            </div>
          </div>
        )}
      </main>

      {/* App Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-5 mt-auto text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-cyan-400" />
            <span>
              Meteorological intelligence powered by{' '}
              <a
                href="https://open-meteo.com"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-slate-300 hover:text-cyan-400 transition-colors underline"
              >
                Open-Meteo API
              </a>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Client-side telemetry • No API key required</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
