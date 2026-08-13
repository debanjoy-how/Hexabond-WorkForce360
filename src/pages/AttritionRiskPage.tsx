import React, { useState } from 'react';
import { Employee, DepartmentStat } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import {
  TrendingDown,
  AlertTriangle,
  DollarSign,
  ShieldAlert,
  Calendar,
  Building,
  ArrowRight,
  Sparkles,
  Target,
  Calculator,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  LineChart,
  Line,
} from 'recharts';

interface AttritionRiskPageProps {
  employees: Employee[];
  departmentStats: DepartmentStat[];
  onSelectEmployee: (emp: Employee) => void;
  onOpenCreateAction: (emp?: Employee) => void;
}

export const AttritionRiskPage: React.FC<AttritionRiskPageProps> = ({
  employees,
  departmentStats,
  onSelectEmployee,
  onOpenCreateAction,
}) => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedDept, setSelectedDept] = useState<string>('All');

  // Turnover Cost Calculator state
  const [avgReplacementCost, setAvgReplacementCost] = useState<number>(45000); // 45k per employee
  const highRiskCount = employees.filter((e) => e.attritionRiskLevel === 'High').length;
  const potentialLoss = highRiskCount * avgReplacementCost;
  const addressableSavings = Math.round(potentialLoss * 0.68); // 68% retention success rate with AI

  // Tenure vs Attrition Curve Data
  const tenureAttritionData = [
    { tenure: '< 1 yr', riskRate: 14, count: 210 },
    { tenure: '1 - 2 yrs', riskRate: 24, count: 340 }, // Peak flight risk!
    { tenure: '2 - 4 yrs', riskRate: 18, count: 420 },
    { tenure: '4 - 6 yrs', riskRate: 8, count: 180 },
    { tenure: '6+ yrs', riskRate: 4, count: 98 },
  ];

  // High flight risk employees
  const highRiskList = employees
    .filter((e) => e.attritionRiskLevel === 'High')
    .filter((e) => selectedDept === 'All' || e.department === selectedDept)
    .sort((a, b) => b.attritionProbability - a.attritionProbability);

  return (
    <div id="attrition-risk-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Workforce Attrition Risk Intelligence
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              126 High Risk
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Machine-learning early detection of voluntary turnover risk, key drivers, and replacement cost exposure.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(['7d', '30d', '90d', '1y'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all uppercase ${
                timeframe === t
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Financial Exposure & Turnover Cost Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 rounded-2xl shadow-lg space-y-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-300">
              Turnover Financial Exposure
            </h3>
          </div>

          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-black font-mono text-white block">
              ${(potentialLoss / 1000000).toFixed(2)}M
            </span>
            <p className="text-xs text-slate-300">
              Total projected replacement & recruiting cost if all <strong>{highRiskCount}</strong> high-risk employees depart.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-1">
            <span className="text-[11px] font-bold uppercase text-emerald-400 block">
              Addressable AI Retention Savings
            </span>
            <span className="text-xl font-bold font-mono text-emerald-200">
              ${(addressableSavings / 1000000).toFixed(2)}M
            </span>
            <p className="text-[10px] text-slate-300">
              Estimated net savings with proactive workload and compensation adjustments.
            </p>
          </div>
        </div>

        {/* Cost Parameters Adjuster */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Replacement Cost Parameter</h3>
              <Calculator className="w-4 h-4 text-slate-400" />
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600">Avg Cost to Replace per Employee:</span>
                  <span className="font-mono text-indigo-700 font-bold">${avgReplacementCost.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="20000"
                  max="100000"
                  step="5000"
                  value={avgReplacementCost}
                  onChange={(e) => setAvgReplacementCost(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>$20k (Entry)</span>
                  <span>$45k (Standard)</span>
                  <span>$100k (Exec)</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
                Formula: <em>Cost = (High Risk Count × Avg Replacement Cost) × (1 - Retention Intervention Rate)</em>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenCreateAction()}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Target className="w-3.5 h-3.5" />
            <span>Launch Retention Initiative</span>
          </button>
        </div>

        {/* Peak Vulnerability Curve: Tenure vs Attrition */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Tenure vs Flight Risk Curve</h3>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                Peak: 1-2 Years
              </span>
            </div>

            <div className="h-44 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tenureAttritionData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="tenure" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      color: '#fff',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="riskRate" name="Attrition Risk %" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            Employees in years 1-2 exhibit a 24% attrition probability—often driven by unmet onboarding role expectations.
          </p>
        </div>
      </div>

      {/* High Risk Employees Action Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Critical High Attrition Roster ({highRiskList.length})</h3>
            <p className="text-xs text-slate-500">Personnel predicted with &gt;70% attrition probability</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Filter Dept:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
            >
              <option value="All">All Departments</option>
              {departmentStats.map((d) => (
                <option key={d.department} value={d.department}>
                  {d.department} ({d.attritionRiskRate}% risk)
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4 text-center">Overtime</th>
                <th className="py-3 px-4 text-center">Engagement</th>
                <th className="py-3 px-4 text-center">Attrition Risk</th>
                <th className="py-3 px-4 text-right">Intervention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {highRiskList.map((emp) => (
                <tr
                  key={emp.id}
                  onClick={() => onSelectEmployee(emp)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {emp.name}
                        </p>
                        <span className="text-[10px] font-mono text-slate-400">{emp.employeeId}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700">{emp.department}</td>
                  <td className="py-3 px-4 text-slate-600">{emp.role}</td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-rose-600">
                    {emp.overtimeHours} hrs/wk
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-700">
                    {emp.engagementScore}%
                  </td>
                  <td className="py-3 px-4 text-center">
                    <RiskBadge level={emp.attritionRiskLevel} score={emp.attritionProbability} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectEmployee(emp)}
                        className="px-3 py-1 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Inspect SHAP</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenCreateAction(emp)}
                        className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Create Action"
                      >
                        <Target className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
