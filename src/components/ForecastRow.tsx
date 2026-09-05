import React from 'react';
import { DailyForecastDay, UnitSystem } from '../types';
import { getWeatherCondition } from '../utils/weatherCodes';
import { Calendar, Droplets } from 'lucide-react';

interface ForecastRowProps {
  daily: DailyForecastDay[];
  units: UnitSystem;
}

export const ForecastRow: React.FC<ForecastRowProps> = ({ daily, units }) => {
  const isImperial = units === 'imperial';

  const convertTemp = (celsius: number) => {
    if (isImperial) {
      return `${Math.round((celsius * 9) / 5 + 32)}°`;
    }
    return `${Math.round(celsius)}°`;
  };

  const getDayAbbr = (day: DailyForecastDay) => {
    if (day.isToday) return 'TOD';
    return day.dayName.slice(0, 3).toUpperCase();
  };

  // Find overall min and max across all 7 days to scale temperature progress bar
  const allMins = daily.map((d) => d.tempMin);
  const allMaxs = daily.map((d) => d.tempMax);
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const tempRange = Math.max(1, globalMax - globalMin);

  return (
    <div
      id="seven-day-forecast-section"
      className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 md:p-6 flex flex-col justify-between shadow-xl h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
            7-Day Forecast
          </h3>
        </div>
        <span className="text-[11px] font-semibold text-cyan-400/80 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
          DAILY OUTLOOK
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-between gap-2.5">
        {daily.map((day, idx) => {
          const condition = getWeatherCondition(day.weatherCode);
          const Icon = condition.icon;

          const leftPercent = ((day.tempMin - globalMin) / tempRange) * 100;
          const rightPercent = ((globalMax - day.tempMax) / tempRange) * 100;
          const widthPercent = Math.max(15, 100 - leftPercent - rightPercent);

          const isToday = day.isToday;

          return (
            <div
              key={day.date}
              id={`forecast-card-${idx}`}
              className={`flex items-center justify-between p-2.5 sm:p-3 rounded-2xl transition-all duration-150 ${
                isToday
                  ? 'bg-slate-800/70 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.12)]'
                  : 'bg-slate-900/40 border border-slate-800/40 hover:bg-slate-800/40'
              }`}
            >
              {/* Day Code */}
              <div className="w-11 shrink-0 flex flex-col">
                <span
                  className={`text-xs font-bold tracking-wider ${
                    isToday ? 'text-cyan-400' : 'text-slate-300'
                  }`}
                >
                  {getDayAbbr(day)}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {day.formattedDate.split(' ')[1] || day.formattedDate}
                </span>
              </div>

              {/* Weather Icon & High Temp Badge */}
              <div className="flex items-center gap-2 shrink-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                    isToday
                      ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300'
                      : 'bg-slate-800 border-slate-700/60 text-slate-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`w-10 text-sm font-bold ${
                    isToday ? 'text-white font-extrabold' : 'text-slate-200'
                  }`}
                >
                  {convertTemp(day.tempMax)}
                </span>
              </div>

              {/* Temperature Bar */}
              <div className="flex-1 px-3 min-w-[60px]">
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden relative">
                  <div
                    className="absolute h-full rounded-full bg-gradient-to-r from-cyan-400 to-amber-400"
                    style={{
                      left: `${Math.min(80, Math.max(0, leftPercent))}%`,
                      width: `${Math.min(100, Math.max(15, widthPercent))}%`,
                    }}
                  />
                </div>
              </div>

              {/* Low Temp */}
              <span className="w-9 text-right text-xs font-semibold text-slate-400 shrink-0">
                {convertTemp(day.tempMin)}
              </span>

              {/* Rain chance */}
              <div className="w-12 text-right shrink-0">
                <span
                  className={`inline-flex items-center gap-0.5 text-[10px] font-medium ${
                    day.precipitationProbability >= 40
                      ? 'text-cyan-400'
                      : 'text-slate-500'
                  }`}
                >
                  <Droplets className="w-2.5 h-2.5" />
                  {day.precipitationProbability}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
