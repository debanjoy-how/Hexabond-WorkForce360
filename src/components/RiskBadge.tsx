import React from 'react';
import { RiskLevel } from '../types';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
  type?: 'attrition' | 'burnout' | 'general';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  score,
  type = 'general',
  size = 'md',
  showIcon = true,
}) => {
  const configs = {
    Low: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20',
      dot: 'bg-emerald-500',
      icon: ShieldCheck,
      label: 'Low Risk',
    },
    Medium: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20',
      dot: 'bg-amber-500',
      icon: AlertTriangle,
      label: 'Medium Risk',
    },
    High: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20',
      dot: 'bg-rose-500',
      icon: ShieldAlert,
      label: 'High Risk',
    },
  };

  const current = configs[level] || configs.Low;
  const IconComponent = current.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium gap-1',
    md: 'px-2.5 py-1 text-xs font-semibold gap-1.5',
    lg: 'px-3 py-1.5 text-sm font-semibold gap-2',
  };

  return (
    <span
      id={`risk-badge-${level.toLowerCase()}-${score ?? 'na'}`}
      className={`inline-flex items-center rounded-full border shadow-2xs transition-colors ${current.bg} ${sizeClasses[size]}`}
    >
      {showIcon && <IconComponent className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span className="truncate">
        {score !== undefined ? `${score}% ${level.toUpperCase()}` : current.label}
      </span>
    </span>
  );
};
