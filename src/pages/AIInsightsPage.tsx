import React, { useState } from 'react';
import { AIInsight } from '../types';
import {
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Clock,
  Briefcase,
  Users,
  Target,
  FileCheck,
} from 'lucide-react';

interface AIInsightsPageProps {
  insights: AIInsight[];
  onOpenCreateAction: () => void;
  onNavigate: (page: string) => void;
}

export const AIInsightsPage: React.FC<AIInsightsPageProps> = ({
  insights,
  onOpenCreateAction,
  onNavigate,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('All');

  const filtered = insights.filter(
    (ins) => filterSeverity === 'All' || ins.severity === filterSeverity
  );

  const getSeverityStyle = (sev: AIInsight['severity']) => {
    switch (sev) {
      case 'Critical':
        return {
          bg: 'bg-rose-50 border-rose-200 text-rose-800',
          badge: 'bg-rose-100 text-rose-800',
          icon: <ShieldAlert className="w-5 h-5 text-rose-600" />,
        };
      case 'Warning':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-800',
          badge: 'bg-amber-100 text-amber-800',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
        };
      case 'Opportunity':
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
          badge: 'bg-emerald-100 text-emerald-800',
          icon: <Lightbulb className="w-5 h-5 text-emerald-600" />,
        };
      default:
        return {
          bg: 'bg-blue-50 border-blue-200 text-blue-800',
          badge: 'bg-blue-100 text-blue-800',
          icon: <Sparkles className="w-5 h-5 text-blue-600" />,
        };
    }
  };

  return (
    <div id="ai-workforce-insights-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                AI Workforce Intelligence Insights
              </h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Weekly Synthesis
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Autonomous pattern detection discovering hidden workforce attrition risks, burnout clusters, and high-ROI actions.
            </p>
          </div>
        </div>

        {/* Severity filter buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {['All', 'Critical', 'Warning', 'Opportunity'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                filterSeverity === sev
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Main Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((ins) => {
          const style = getSeverityStyle(ins.severity);
          return (
            <div
              key={ins.id}
              className={`p-6 rounded-2xl border shadow-xs flex flex-col justify-between space-y-4 bg-white hover:border-indigo-200 transition-all`}
            >
              <div className="space-y-3">
                {/* Header tag */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {ins.code}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">{ins.department}</span>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${style.badge}`}>
                    {ins.severity}
                  </span>
                </div>

                {/* Title & Description */}
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    {style.icon}
                    <span>{ins.title}</span>
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{ins.description}</p>
                </div>

                {/* Key Metric Highlight */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600">Metric Impact:</span>
                  <span className="font-bold text-slate-900 font-mono">{ins.metricHighlight}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">ML Confidence: 94%</span>
                <button
                  type="button"
                  onClick={() => {
                    if (ins.actionTargetPage === 'action-plans') {
                      onOpenCreateAction();
                    } else {
                      onNavigate(ins.actionTargetPage);
                    }
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <span>{ins.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
