import React from 'react';
import { PlanningRecommendation } from '../types';
import {
  Umbrella,
  Thermometer,
  Compass,
  Wind,
  SunMedium,
  Lightbulb,
} from 'lucide-react';

interface PlanningRecommendationsProps {
  recommendations: PlanningRecommendation[];
}

export const PlanningRecommendations: React.FC<PlanningRecommendationsProps> = ({
  recommendations,
}) => {
  const getIcon = (category: PlanningRecommendation['category']) => {
    switch (category) {
      case 'rain':
        return Umbrella;
      case 'temperature':
        return Thermometer;
      case 'wind':
        return Wind;
      case 'sun':
        return SunMedium;
      case 'outdoor':
      default:
        return Compass;
    }
  };

  const getUrgencyStyles = (urgency: PlanningRecommendation['urgency']) => {
    switch (urgency) {
      case 'caution':
        return {
          dotColor: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]',
          badgeText: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
          iconColor: 'text-amber-400 bg-amber-500/15',
          label: 'ALERT',
        };
      case 'positive':
        return {
          dotColor: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]',
          badgeText: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30',
          iconColor: 'text-emerald-400 bg-emerald-500/15',
          label: 'OPTIMAL',
        };
      case 'info':
      default:
        return {
          dotColor: 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]',
          badgeText: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30',
          iconColor: 'text-cyan-400 bg-cyan-500/15',
          label: 'INSIGHT',
        };
    }
  };

  return (
    <div
      id="planning-recommendations-section"
      className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-300">
              Weather Intelligence Engine
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Actionable outdoor & travel advice computed from 7-day model outputs
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {recommendations.map((rec) => {
          const Icon = getIcon(rec.category);
          const style = getUrgencyStyles(rec.urgency);

          return (
            <div
              key={rec.id}
              id={`recommendation-card-${rec.id}`}
              className="rounded-2xl p-4 bg-slate-800/40 hover:bg-slate-800/70 border border-slate-800 transition-all duration-150 flex items-start gap-3.5"
            >
              <div
                className={`p-2.5 rounded-xl shrink-0 flex items-center justify-center border border-white/5 ${style.iconColor}`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${style.dotColor}`} />
                    <h4 className="text-xs font-bold text-slate-100 truncate">
                      {rec.title}
                    </h4>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 uppercase tracking-wider ${style.badgeText}`}
                  >
                    {style.label}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {rec.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
