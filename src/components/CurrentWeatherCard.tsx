import React from 'react';
import { WeatherData, UnitSystem } from '../types';
import { getWeatherCondition } from '../utils/weatherCodes';
import {
  Droplets,
  Wind,
  CloudRain,
  ArrowUp,
  ArrowDown,
  Compass,
} from 'lucide-react';

interface CurrentWeatherCardProps {
  data: WeatherData;
  units: UnitSystem;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  data,
  units,
}) => {
  const isImperial = units === 'imperial';
  const { current, city, country, admin1, timezone, daily } = data;
  const condition = getWeatherCondition(current.weatherCode);
  const Icon = condition.icon;

  const today = daily[0];

  const formatTemp = (celsius: number) => {
    if (isImperial) {
      return `${Math.round((celsius * 9) / 5 + 32)}°`;
    }
    return `${Math.round(celsius)}°`;
  };

  const formatWind = (kmh: number) => {
    if (isImperial) {
      return `${Math.round(kmh * 0.621371)} mph`;
    }
    return `${Math.round(kmh)} km/h`;
  };

  const tempVal = isImperial
    ? Math.round((current.temperature * 9) / 5 + 32)
    : Math.round(current.temperature);

  return (
    <div
      id="current-weather-hero"
      className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800/90 border border-slate-800/60 rounded-3xl p-6 md:p-8 relative flex flex-col justify-between overflow-hidden shadow-2xl group"
    >
      {/* Ambient glowing radial blur */}
      <div className="absolute top-[-20px] right-[-20px] w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-30px] left-[-30px] w-48 h-48 bg-indigo-500/5 blur-[70px] rounded-full pointer-events-none" />

      {/* Top section: City, Condition, and Big Temp */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 z-10 mb-6">
        <div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block animate-pulse" />
            Current Weather
          </p>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              {city}
            </h2>
            {country && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/60">
                {admin1 ? `${admin1}, ${country}` : country}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400 mt-2 font-medium">
            <Icon className={`w-4 h-4 ${condition.iconColor}`} />
            <span>{condition.label}</span>
            <span>•</span>
            <span className="text-slate-400">{condition.description}</span>
          </div>
        </div>

        {/* Big Temperature Hero */}
        <div className="sm:text-right flex flex-row sm:flex-col items-baseline sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/60">
          <div className="text-6xl sm:text-7xl font-light tracking-tighter leading-none text-white">
            {tempVal}
            <span className="text-cyan-400 font-normal ml-1">
              {isImperial ? '°F' : '°C'}
            </span>
          </div>

          {today && (
            <div className="flex items-center gap-2.5 mt-2.5 text-xs font-semibold text-slate-300">
              <span className="inline-flex items-center gap-0.5 text-amber-400">
                <ArrowUp className="w-3.5 h-3.5" /> High {formatTemp(today.tempMax)}
              </span>
              <span className="text-slate-600">•</span>
              <span className="inline-flex items-center gap-0.5 text-cyan-400">
                <ArrowDown className="w-3.5 h-3.5" /> Low {formatTemp(today.tempMin)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Metrics Row (Bento style items) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 z-10 pt-4 border-t border-slate-800/70">
        {/* Humidity */}
        <div className="flex items-center gap-3 p-3 bg-slate-950/50 rounded-2xl border border-slate-800/60">
          <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-blue-400 shrink-0">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase text-slate-500 tracking-wider font-bold">
              Humidity
            </p>
            <p className="text-lg font-bold text-white leading-tight">
              {Math.round(current.humidity)}%
            </p>
          </div>
        </div>

        {/* Wind Speed */}
        <div className="flex items-center gap-3 p-3 bg-slate-950/50 rounded-2xl border border-slate-800/60">
          <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-cyan-400 shrink-0">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase text-slate-500 tracking-wider font-bold">
              Wind Speed
            </p>
            <p className="text-lg font-bold text-white leading-tight">
              {formatWind(current.windSpeed)}
            </p>
          </div>
        </div>

        {/* Today Precipitation */}
        <div className="flex items-center gap-3 p-3 bg-slate-950/50 rounded-2xl border border-slate-800/60">
          <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-indigo-400 shrink-0">
            <CloudRain className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase text-slate-500 tracking-wider font-bold">
              Precipitation
            </p>
            <p className="text-lg font-bold text-white leading-tight">
              {today ? `${today.precipitationProbability}%` : '0%'}
            </p>
          </div>
        </div>

        {/* Timezone / Area */}
        <div className="flex items-center gap-3 p-3 bg-slate-950/50 rounded-2xl border border-slate-800/60">
          <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-emerald-400 shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase text-slate-500 tracking-wider font-bold">
              Zone
            </p>
            <p className="text-sm font-bold text-slate-200 truncate leading-tight">
              {timezone.replace('_', ' ')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
