import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { DailyForecastDay, UnitSystem } from '../types';
import { TrendingUp } from 'lucide-react';

interface TemperatureChartProps {
  daily: DailyForecastDay[];
  units: UnitSystem;
}

export const TemperatureChart: React.FC<TemperatureChartProps> = ({ daily, units }) => {
  const isImperial = units === 'imperial';

  const convertTemp = (celsius: number) => {
    if (isImperial) {
      return Math.round((celsius * 9) / 5 + 32);
    }
    return Math.round(celsius);
  };

  const chartData = daily.map((day) => ({
    name: day.dayName.slice(0, 3).toUpperCase(),
    fullName: day.dayName,
    date: day.formattedDate,
    high: convertTemp(day.tempMax),
    low: convertTemp(day.tempMin),
    rain: day.precipitationProbability,
    condition: day.condition,
  }));

  const allTemps = chartData.flatMap((d) => [d.high, d.low]);
  const minVal = Math.min(...allTemps);
  const maxVal = Math.max(...allTemps);
  const yDomain = [Math.floor(minVal - 3), Math.ceil(maxVal + 3)];

  const tempUnit = isImperial ? '°F' : '°C';

  return (
    <div
      id="temperature-chart-section"
      className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 flex flex-col shadow-xl"
    >
      <div className="flex items-center justify-between gap-2 mb-5">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Temperature Trend
          </h3>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)] inline-block" />
            <span className="text-slate-200">MAX ({tempUnit})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500 inline-block" />
            <span className="text-slate-400">MIN ({tempUnit})</span>
          </div>
        </div>
      </div>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -24, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorMax" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#64748b" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#64748b" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#1e293b"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }}
              dy={10}
            />
            <YAxis
              domain={yDomain}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#475569', fontSize: 11 }}
              unit={tempUnit}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-950/95 border border-slate-800 text-slate-100 p-3 rounded-2xl shadow-2xl backdrop-blur-md text-xs min-w-36">
                      <div className="font-bold text-xs text-white mb-1.5 border-b border-slate-800/80 pb-1 flex justify-between">
                        <span>{data.fullName}</span>
                        <span className="text-slate-400 font-normal">{data.date}</span>
                      </div>
                      <div className="text-slate-400 mb-2 font-medium">{data.condition}</div>
                      <div className="flex items-center justify-between text-cyan-400 py-0.5">
                        <span className="font-medium">High:</span>
                        <span className="font-bold">
                          {data.high}
                          {tempUnit}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300 py-0.5">
                        <span className="font-medium">Low:</span>
                        <span className="font-bold">
                          {data.low}
                          {tempUnit}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400 pt-1.5 border-t border-slate-800/80 mt-1.5">
                        <span>Precipitation:</span>
                        <span className="font-semibold text-cyan-300">{data.rain}%</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="high"
              name="Max Temp"
              stroke="#22d3ee"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorMax)"
              dot={{ r: 4, fill: '#22d3ee', strokeWidth: 2, stroke: '#0f172a' }}
              activeDot={{ r: 6, fill: '#38bdf8', stroke: '#0f172a', strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="low"
              name="Min Temp"
              stroke="#64748b"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorMin)"
              dot={{ r: 3.5, fill: '#64748b', strokeWidth: 2, stroke: '#0f172a' }}
              activeDot={{ r: 5.5, fill: '#94a3b8', stroke: '#0f172a', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
