import React, { useState } from 'react';
import { Employee, DepartmentStat } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import {
  HeartPulse,
  Flame,
  Clock,
  Activity,
  Smile,
  ShieldAlert,
  AlertTriangle,
  Sparkles,
  Target,
  Coffee,
  Moon,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  LineChart,
  Line,
  Legend,
} from 'recharts';

interface WellbeingBurnoutPageProps {
  employees: Employee[];
  departmentStats: DepartmentStat[];
  onSelectEmployee: (emp: Employee) => void;
  onOpenCreateAction: (emp?: Employee) => void;
}

export const WellbeingBurnoutPage: React.FC<WellbeingBurnoutPageProps> = ({
  employees,
  departmentStats,
  onSelectEmployee,
  onOpenCreateAction,
}) => {
  const [selectedDept, setSelectedDept] = useState('All');

  // Overtime vs Burnout correlation data
  const correlationData = employees.map((e) => ({
    name: e.name,
    overtime: e.overtimeHours,
    burnout: e.burnoutProbability,
    workload: e.weeklyHours,
    dept: e.department,
  }));

  // Burnout spotlight list
  const burnoutEmployees = employees
    .filter((e) => e.burnoutProbability >= 65)
    .filter((e) => selectedDept === 'All' || e.department === selectedDept)
    .sort((a, b) => b.burnoutProbability - a.burnoutProbability);

  return (
    <div id="wellbeing-burnout-page" className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-2xl bg-rose-50 text-rose-600 shrink-0">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Workforce Wellbeing & Burnout Analytics
              </h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                84 Critical Burnout
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Early warning indicators for mental fatigue, excessive overtime spikes, and workload exhaustion.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpenCreateAction()}
          className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Target className="w-3.5 h-3.5" />
          <span>Launch Wellness Plan</span>
        </button>
      </div>

      {/* 5 Holistic Wellbeing Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Wellbeing Index</span>
            <Smile className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-indigo-700 font-mono">74/100</span>
            <span className="block text-[11px] text-emerald-600 font-bold mt-0.5">+2.4 pts vs benchmark</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">Burnout Risk</span>
            <Flame className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-rose-600 font-mono">84</span>
            <span className="block text-[11px] text-rose-700 font-bold mt-0.5">⚠️ 6.7% of workforce</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Avg Workload</span>
            <Zap className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">68%</span>
            <span className="block text-[11px] text-slate-500 font-medium mt-0.5">Target &lt; 75%</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Work-Life Balance</span>
            <Moon className="w-4 h-4 text-violet-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">71%</span>
            <span className="block text-[11px] text-emerald-600 font-bold mt-0.5">+3% positive trend</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Engagement</span>
            <Activity className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">74%</span>
            <span className="block text-[11px] text-slate-500 font-medium mt-0.5">Pulse check</span>
          </div>
        </div>
      </div>

      {/* Analytics Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Overtime vs Burnout Correlation Scatter */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Overtime Hours vs Predicted Burnout</h3>
                <p className="text-xs text-slate-500">Strong positive correlation (r = +0.82) observed in technical roles</p>
              </div>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                Threshold: &gt; 8h/wk
              </span>
            </div>

            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    type="number"
                    dataKey="overtime"
                    name="Overtime"
                    unit=" hrs"
                    tick={{ fontSize: 10, fill: '#64748b' }}
                  />
                  <YAxis
                    type="number"
                    dataKey="burnout"
                    name="Burnout"
                    unit="%"
                    tick={{ fontSize: 10, fill: '#64748b' }}
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ payload }) => {
                      if (!payload || !payload.length) return null;
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-lg text-xs space-y-1 shadow-lg">
                          <p className="font-bold">{data.name}</p>
                          <p className="text-slate-300">Overtime: {data.overtime} hrs/wk</p>
                          <p className="text-rose-400 font-bold">Burnout Risk: {data.burnout}%</p>
                        </div>
                      );
                    }}
                  />
                  <Scatter name="Employees" data={correlationData} fill="#ef4444" opacity={0.7} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/70 text-xs text-amber-800 flex items-center gap-2 mt-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Employees logging <strong>&gt;10 overtime hours/week</strong> are <strong>3.8x</strong> more likely to trigger acute burnout alerts.
            </span>
          </div>
        </div>

        {/* Burnout Risk Rate by Department */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Burnout Concentration by Dept</h3>
              <span className="text-xs text-slate-400 font-mono">Ranked</span>
            </div>

            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={departmentStats}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} unit="%" />
                  <YAxis
                    type="category"
                    dataKey="department"
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      color: '#fff',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="burnoutRiskRate" name="Burnout Risk %" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            Engineering (21%) and Sales (19%) represent the highest density of exhaustion indicators.
          </p>
        </div>
      </div>

      {/* Burnout Risk Employee Roster */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Exhaustion & Burnout Priority Queue ({burnoutEmployees.length})</h3>
            <p className="text-xs text-slate-500">Personnel flagged for immediate workload recalibration</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Filter:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
            >
              <option value="All">All Departments</option>
              {departmentStats.map((d) => (
                <option key={d.department} value={d.department}>
                  {d.department}
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
                <th className="py-3 px-4">Weekly Hours</th>
                <th className="py-3 px-4 text-center">Overtime</th>
                <th className="py-3 px-4 text-center">Work-Life Balance</th>
                <th className="py-3 px-4 text-center">Burnout Score</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {burnoutEmployees.map((emp) => (
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
                  <td className="py-3 px-4 font-mono text-slate-700">{emp.weeklyHours} hrs/wk</td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-rose-600">
                    +{emp.overtimeHours}h
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-700">
                    {emp.workLifeBalance}%
                  </td>
                  <td className="py-3 px-4 text-center">
                    <RiskBadge level={emp.burnoutRiskLevel} score={emp.burnoutProbability} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => onOpenCreateAction(emp)}
                      className="px-3 py-1 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors inline-flex items-center gap-1"
                    >
                      <Target className="w-3.5 h-3.5" />
                      <span>Adjust Workload</span>
                    </button>
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
