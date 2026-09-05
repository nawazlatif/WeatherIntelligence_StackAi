import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSkeletonProps {
  cityName: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ cityName }) => {
  return (
    <div id="weather-loading-skeleton" className="space-y-5 animate-pulse">
      {/* Loading banner */}
      <div className="flex items-center justify-center gap-2.5 py-3.5 px-6 bg-slate-900/90 border border-slate-800 rounded-2xl text-cyan-300 text-xs font-semibold uppercase tracking-wider">
        <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
        <span>Querying live meteorological telemetry for {cityName}...</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column Bento skeletons */}
        <div className="lg:col-span-8 space-y-5">
          {/* Hero Card Skeleton */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
            <div className="flex justify-between items-start pb-6 border-b border-slate-800">
              <div className="space-y-2">
                <div className="h-4 w-28 bg-slate-800 rounded" />
                <div className="h-8 w-48 bg-slate-800 rounded-xl" />
              </div>
              <div className="h-14 w-28 bg-slate-800 rounded-xl" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-slate-950/60 rounded-2xl border border-slate-800" />
              ))}
            </div>
          </div>

          {/* Chart Skeleton */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-72">
            <div className="h-4 w-40 bg-slate-800 rounded mb-6" />
            <div className="h-48 bg-slate-950/40 rounded-2xl border border-slate-800/60" />
          </div>

          {/* Recommendations Skeleton */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <div className="h-4 w-48 bg-slate-800 rounded mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="h-20 bg-slate-800/50 rounded-2xl" />
              <div className="h-20 bg-slate-800/50 rounded-2xl" />
            </div>
          </div>
        </div>

        {/* Right Column Forecast Skeleton */}
        <div className="lg:col-span-4 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between gap-3 min-h-[500px]">
          <div className="h-4 w-32 bg-slate-800 rounded mb-2" />
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="h-12 bg-slate-800/40 rounded-2xl border border-slate-800/60" />
          ))}
        </div>
      </div>
    </div>
  );
};
