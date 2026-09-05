import React from 'react';
import { AlertCircle, SearchX, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  isCityNotFound: boolean;
  onRetry: () => void;
  onSelectSuggestedCity: (city: string) => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message,
  isCityNotFound,
  onRetry,
  onSelectSuggestedCity,
}) => {
  return (
    <div
      id="weather-error-container"
      className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 text-center max-w-xl mx-auto my-8 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-[-20px] right-[-20px] w-48 h-48 bg-rose-500/10 blur-[80px] rounded-full pointer-events-none" />

      <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
        {isCityNotFound ? (
          <SearchX className="w-7 h-7" />
        ) : (
          <AlertCircle className="w-7 h-7" />
        )}
      </div>

      <h3 className="text-xl font-bold text-white mb-2">
        {isCityNotFound ? 'City Not Found' : 'Unable to Load Weather'}
      </h3>

      <p className="text-slate-400 text-sm mb-6 leading-relaxed">
        {isCityNotFound
          ? 'City not found — please try another city or check your spelling.'
          : message || 'A network error occurred while contacting the meteorological service. Please try again.'}
      </p>

      {isCityNotFound && (
        <div className="mb-6 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-left">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">
            Try searching for:
          </p>
          <div className="flex flex-wrap gap-2">
            {['London', 'New York', 'Paris', 'Tokyo', 'Berlin', 'Sydney'].map(
              (suggested) => (
                <button
                  key={suggested}
                  type="button"
                  onClick={() => onSelectSuggestedCity(suggested)}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-cyan-500 hover:text-slate-950 border border-slate-800 hover:border-cyan-400 rounded-full text-xs font-semibold text-slate-300 transition-colors"
                >
                  {suggested}
                </button>
              )
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          id="error-retry-button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-full text-xs font-bold uppercase tracking-wider transition-colors shadow-[0_0_20px_rgba(6,182,212,0.35)]"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      </div>
    </div>
  );
};
