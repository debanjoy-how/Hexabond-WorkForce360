import React from 'react';
import { ShapFactor } from '../types';
import { Sparkles, BrainCircuit, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';

interface ShapWaterfallChartProps {
  factors: ShapFactor[];
  aiExplanation: string;
  employeeName: string;
  attritionScore: number;
}

export const ShapWaterfallChart: React.FC<ShapWaterfallChartProps> = ({
  factors,
  aiExplanation,
  employeeName,
  attritionScore,
}) => {
  return (
    <div id="explainable-ai-shap-section" className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
              <BrainCircuit className="w-3.5 h-3.5 text-indigo-600" />
              Explainable AI • SHAP
            </span>
            <span className="text-xs text-slate-400 font-mono">TreeSHAP v2.4</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mt-1.5">Why is this employee at risk?</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Statistical attribution breakdown showing factors pushing risk up or pulling it down.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200/80 text-xs">
          <Info className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-slate-600">
            Population Baseline: <strong className="text-slate-800">32%</strong> → Predicted: <strong className="text-rose-600">{attritionScore}%</strong>
          </span>
        </div>
      </div>

      {/* AI Natural Language Explanation Box */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-50/70 via-slate-50 to-purple-50/50 p-4 rounded-xl border border-indigo-100/80">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-indigo-600 text-white shrink-0 mt-0.5 shadow-2xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 tracking-wide">AI Narrative Synthesis</span>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded font-medium">94.2% Confidence</span>
            </div>
            <p className="text-slate-700 leading-relaxed italic">
              "{aiExplanation}"
            </p>
          </div>
        </div>
      </div>

      {/* Factor Breakdown Bars */}
      <div className="space-y-3.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Ranked Risk Drivers (Shapley Values)
        </h4>

        <div className="space-y-3">
          {factors.map((factor, idx) => {
            const isIncrease = factor.direction === 'increases_risk';
            return (
              <div
                key={idx}
                id={`shap-factor-${idx}`}
                className="group relative p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-sm text-slate-900">{factor.factor}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-md font-medium bg-slate-100 text-slate-600 border border-slate-200">
                      {factor.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-md border ${
                        isIncrease
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {isIncrease ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
                      {isIncrease ? `+${factor.impact}%` : `-${factor.impact}%`} Risk
                    </span>
                  </div>
                </div>

                {/* Progress bar visualizer */}
                <div className="relative w-full h-2 rounded-full bg-slate-200 overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isIncrease ? 'bg-gradient-to-r from-rose-500 to-red-600' : 'bg-gradient-to-r from-emerald-400 to-emerald-600'
                    }`}
                    style={{ width: `${Math.min(100, factor.impact * 3.5)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <p className="text-slate-600">{factor.description}</p>
                  <div className="flex items-center gap-2 font-mono text-[11px] shrink-0">
                    <span>Observed: <strong className="text-slate-800">{factor.metricValue}</strong></span>
                    <span className="text-slate-300">|</span>
                    <span>Org Median: <span className="text-slate-500">{factor.benchmarkValue}</span></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
