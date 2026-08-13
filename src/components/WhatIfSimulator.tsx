import React, { useState, useEffect } from 'react';
import { Employee } from '../types';
import { predictionService, SimulationParams, SimulationResult } from '../services/predictionService';
import { Sliders, Sparkles, TrendingDown, DollarSign, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';

interface WhatIfSimulatorProps {
  employee: Employee;
  onCreateActionPlan: (targetOutcome: string, notes: string) => void;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({ employee, onCreateActionPlan }) => {
  const [params, setParams] = useState<SimulationParams>({
    overtimeReductionHours: Math.min(8, employee.overtimeHours),
    salaryIncreasePct: 8,
    workLifeBalanceBoost: 15,
    promotionGranted: employee.lastPromotionYearsAgo > 2.5,
    manager1on1Biweekly: true,
    flexibleRemoteDays: 1,
  });

  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const sim = await predictionService.simulateIntervention(employee, params);
      setResult(sim);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSimulation();
  }, [params, employee]);

  const resetParams = () => {
    setParams({
      overtimeReductionHours: 0,
      salaryIncreasePct: 0,
      workLifeBalanceBoost: 0,
      promotionGranted: false,
      manager1on1Biweekly: false,
      flexibleRemoteDays: 0,
    });
  };

  return (
    <div id="what-if-retention-simulator" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-violet-50 text-violet-700 border border-violet-100">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Interactive What-If Retention Simulator</h3>
            <p className="text-xs text-slate-500">
              Test HR intervention scenarios to simulate predicted risk reduction & cost savings.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={resetParams}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Sliders
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Intervention Controls */}
        <div className="lg:col-span-7 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Simulated HR Interventions
          </h4>

          {/* Slider 1: Overtime Reduction */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700">Reduce Weekly Overtime</span>
              <span className="font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 font-bold">
                -{params.overtimeReductionHours} hrs/wk (Current: {employee.overtimeHours}h)
              </span>
            </div>
            <input
              type="range"
              min="0"
              max={Math.max(16, employee.overtimeHours)}
              step="1"
              value={params.overtimeReductionHours}
              onChange={(e) => setParams({ ...params, overtimeReductionHours: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          {/* Slider 2: Salary Raise */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700">Base Salary Adjustment</span>
              <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-bold">
                +{params.salaryIncreasePct}% (${Math.round(employee.salary * (1 + params.salaryIncreasePct / 100)).toLocaleString()})
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              step="1"
              value={params.salaryIncreasePct}
              onChange={(e) => setParams({ ...params, salaryIncreasePct: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>

          {/* Slider 3: Work-Life Balance Support */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700">Work-Life Balance Score Support</span>
              <span className="font-mono text-violet-700 bg-violet-50 px-2 py-0.5 rounded border border-violet-100 font-bold">
                +{params.workLifeBalanceBoost} pts
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="5"
              value={params.workLifeBalanceBoost}
              onChange={(e) => setParams({ ...params, workLifeBalanceBoost: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
            />
          </div>

          {/* Toggles & Checkboxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={params.promotionGranted}
                onChange={(e) => setParams({ ...params, promotionGranted: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
              />
              <span className="text-xs font-semibold text-slate-800">Fast-Track Promotion</span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={params.manager1on1Biweekly}
                onChange={(e) => setParams({ ...params, manager1on1Biweekly: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
              />
              <span className="text-xs font-semibold text-slate-800">Bi-Weekly 1:1 Mentoring</span>
            </label>
          </div>
        </div>

        {/* Right Column: Simulated Live Output */}
        <div className="lg:col-span-5 bg-slate-900 text-white p-5 rounded-2xl flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Simulated ML Output
              </span>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                Live Recalibration
              </span>
            </div>

            {/* Recalibrated Metrics */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              {/* Attrition Risk Result */}
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <p className="text-[11px] text-slate-400 font-medium">Predicted Attrition</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold text-white font-mono">
                    {result ? `${result.newAttritionRisk}%` : `${employee.attritionProbability}%`}
                  </span>
                  {result && result.attritionRiskDelta !== 0 && (
                    <span className="text-xs font-bold text-emerald-400 flex items-center">
                      <TrendingDown className="w-3 h-3 mr-0.5" />
                      {result.attritionRiskDelta}%
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Was: {employee.attritionProbability}% ({employee.attritionRiskLevel})
                </p>
              </div>

              {/* Burnout Risk Result */}
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <p className="text-[11px] text-slate-400 font-medium">Predicted Burnout</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold text-white font-mono">
                    {result ? `${result.newBurnoutRisk}%` : `${employee.burnoutProbability}%`}
                  </span>
                  {result && result.burnoutRiskDelta !== 0 && (
                    <span className="text-xs font-bold text-emerald-400 flex items-center">
                      <TrendingDown className="w-3 h-3 mr-0.5" />
                      {result.burnoutRiskDelta}%
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Was: {employee.burnoutProbability}%
                </p>
              </div>
            </div>

            {/* Financial ROI / Replacement Savings */}
            {result && result.estimatedCostSavings > 0 && (
              <div className="mt-4 p-3 bg-emerald-950/50 rounded-xl border border-emerald-800/60">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-800/60 text-emerald-300">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-emerald-400">Estimated Turnover Cost Saved</p>
                    <p className="text-lg font-bold text-white font-mono">
                      +${result.estimatedCostSavings.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Key Drivers List */}
            {result && result.keyDrivers.length > 0 && (
              <div className="mt-4 space-y-1.5">
                <p className="text-[11px] font-semibold text-slate-400">Applied Interventions:</p>
                <ul className="text-xs text-slate-300 space-y-1">
                  {result.keyDrivers.map((d, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-[11px]">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="truncate">{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              if (result) {
                const targetText = `Reduce attrition risk from ${employee.attritionProbability}% to ${result.newAttritionRisk}% and burnout to ${result.newBurnoutRisk}%.`;
                const notes = `Simulated Interventions:\n- Overtime reduction: -${params.overtimeReductionHours}h\n- Salary adjustment: +${params.salaryIncreasePct}%\n- Promotion fast-track: ${params.promotionGranted ? 'Yes' : 'No'}\n- Bi-weekly 1:1: ${params.manager1on1Biweekly ? 'Yes' : 'No'}\nEstimated Cost Savings: $${result.estimatedCostSavings.toLocaleString()}`;
                onCreateActionPlan(targetText, notes);
              }
            }}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Convert Scenario into Action Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
