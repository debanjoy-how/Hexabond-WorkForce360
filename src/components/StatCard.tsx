import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  id: string;
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
    label: string;
    isPositiveIndicator?: boolean; // e.g. for high risk, up is bad (negative)
  };
  accentColor?: 'indigo' | 'rose' | 'amber' | 'emerald' | 'blue' | 'purple';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  id,
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accentColor = 'indigo',
  onClick,
}) => {
  const accentStyles = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
  };

  const getTrendColor = () => {
    if (!trend) return '';
    if (trend.direction === 'neutral') return 'text-slate-500 bg-slate-50 border-slate-200';
    
    // If isPositiveIndicator is false (meaning an UP trend in high attrition is alarming/red)
    if (trend.isPositiveIndicator === false) {
      return trend.direction === 'up'
        ? 'text-rose-700 bg-rose-50 border-rose-200'
        : 'text-emerald-700 bg-emerald-50 border-emerald-200';
    }

    return trend.direction === 'up'
      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
      : 'text-rose-700 bg-rose-50 border-rose-200';
  };

  const TrendIcon = trend?.direction === 'up' ? TrendingUp : trend?.direction === 'down' ? TrendingDown : Minus;

  return (
    <div
      id={id}
      onClick={onClick}
      className={`relative bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs transition-all duration-200 hover:shadow-md hover:border-slate-300 ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
          </div>
        </div>
        <div className={`p-3 rounded-xl border ${accentStyles[accentColor]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
        {trend ? (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md font-semibold border ${getTrendColor()}`}>
              <TrendIcon className="w-3 h-3" />
              {trend.value}
            </span>
            <span className="text-slate-500 truncate">{trend.label}</span>
          </div>
        ) : (
          <span className="text-slate-400">{subtitle || 'Workforce metric'}</span>
        )}
      </div>
    </div>
  );
};
