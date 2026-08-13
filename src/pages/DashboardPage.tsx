import React, { useState } from 'react';
import { Employee, DepartmentStat, AIInsight, ActionPlan, User } from '../types';
import { StatCard } from '../components/StatCard';
import { RiskBadge } from '../components/RiskBadge';
import {
  Users,
  AlertOctagon,
  Flame,
  Activity,
  HeartPulse,
  TrendingDown,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Clock,
  Building,
  Target,
  FileSpreadsheet,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';

interface DashboardPageProps {
  currentUser: User;
  employees: Employee[];
  departmentStats: DepartmentStat[];
  aiInsights: AIInsight[];
  actionPlans: ActionPlan[];
  onSelectEmployee: (emp: Employee) => void;
  onNavigate: (page: string) => void;
  onOpenCreateAction: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  currentUser,
  employees,
  departmentStats,
  aiInsights,
  actionPlans,
  onSelectEmployee,
  onNavigate,
  onOpenCreateAction,
}) => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Attrition Donut Data
  const attritionDonutData = [
    { name: 'Low Risk', value: 62, color: '#10b981' },
    { name: 'Medium Risk', value: 28, color: '#f59e0b' },
    { name: 'High Risk', value: 10, color: '#ef4444' },
  ];

  // Attrition Trend Data across timeframes
  const trendDataMap = {
    '7d': [
      { date: 'Mon', highRisk: 118, mediumRisk: 340, avgEngagement: 75 },
      { date: 'Tue', highRisk: 120, mediumRisk: 342, avgEngagement: 74 },
      { date: 'Wed', highRisk: 121, mediumRisk: 345, avgEngagement: 74 },
      { date: 'Thu', highRisk: 123, mediumRisk: 348, avgEngagement: 73 },
      { date: 'Fri', highRisk: 124, mediumRisk: 350, avgEngagement: 74 },
      { date: 'Sat', highRisk: 125, mediumRisk: 350, avgEngagement: 74 },
      { date: 'Sun', highRisk: 126, mediumRisk: 352, avgEngagement: 74 },
    ],
    '30d': [
      { date: 'Week 1', highRisk: 108, mediumRisk: 320, avgEngagement: 77 },
      { date: 'Week 2', highRisk: 114, mediumRisk: 332, avgEngagement: 76 },
      { date: 'Week 3', highRisk: 120, mediumRisk: 344, avgEngagement: 75 },
      { date: 'Week 4', highRisk: 126, mediumRisk: 352, avgEngagement: 74 },
    ],
    '90d': [
      { date: 'Nov', highRisk: 94, mediumRisk: 290, avgEngagement: 79 },
      { date: 'Dec', highRisk: 106, mediumRisk: 310, avgEngagement: 77 },
      { date: 'Jan', highRisk: 118, mediumRisk: 335, avgEngagement: 75 },
      { date: 'Feb', highRisk: 126, mediumRisk: 352, avgEngagement: 74 },
    ],
    '1y': [
      { date: 'Q1', highRisk: 82, mediumRisk: 260, avgEngagement: 82 },
      { date: 'Q2', highRisk: 90, mediumRisk: 280, avgEngagement: 80 },
      { date: 'Q3', highRisk: 105, mediumRisk: 315, avgEngagement: 77 },
      { date: 'Q4', highRisk: 126, mediumRisk: 352, avgEngagement: 74 },
    ],
  };

  const currentTrendData = trendDataMap[timeframe];

  // High risk employees filter
  const highRiskEmployees = employees
    .filter((e) => e.attritionProbability >= 70)
    .sort((a, b) => b.attritionProbability - a.attritionProbability)
    .slice(0, 5);

  return (
    <div id="hr-dashboard-page" className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Good morning, {currentUser.name.split(' ')[0]}
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live AI Model Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Here is your workforce wellbeing and retention intelligence overview for today.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => onNavigate('reports')}
            className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Generate Report</span>
          </button>
          <button
            type="button"
            onClick={onOpenCreateAction}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-colors flex items-center gap-1.5"
          >
            <Target className="w-3.5 h-3.5" />
            <span>New Action Plan</span>
          </button>
        </div>
      </div>

      {/* Top 5 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          id="kpi-total-employees"
          title="Total Employees"
          value="1,248"
          icon={Users}
          accentColor="indigo"
          trend={{
            value: '+3.2%',
            direction: 'up',
            label: 'vs last quarter',
          }}
          onClick={() => onNavigate('employees')}
        />

        <StatCard
          id="kpi-high-attrition-risk"
          title="High Attrition Risk"
          value="126"
          icon={AlertOctagon}
          accentColor="rose"
          trend={{
            value: '↑ 8.4%',
            direction: 'up',
            label: 'from last month',
            isPositiveIndicator: false,
          }}
          onClick={() => onNavigate('attrition')}
        />

        <StatCard
          id="kpi-high-burnout-risk"
          title="High Burnout Risk"
          value="84"
          icon={Flame}
          accentColor="amber"
          trend={{
            value: '↑ 12%',
            direction: 'up',
            label: 'burnout signal spike',
            isPositiveIndicator: false,
          }}
          onClick={() => onNavigate('wellbeing')}
        />

        <StatCard
          id="kpi-avg-engagement"
          title="Avg Engagement"
          value="74%"
          icon={Activity}
          accentColor="emerald"
          trend={{
            value: '+2.1%',
            direction: 'up',
            label: 'pulse survey index',
          }}
          onClick={() => onNavigate('analytics')}
        />

        <StatCard
          id="kpi-needing-attention"
          title="Needing Attention"
          value="57"
          icon={ShieldAlert}
          accentColor="purple"
          trend={{
            value: '4 Active Plans',
            direction: 'neutral',
            label: 'in progress',
          }}
          onClick={() => onNavigate('action-plans')}
        />
      </div>

      {/* Section 6 & 7: Attrition Risk Overview & Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Attrition Risk Donut Breakdown */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Workforce Attrition Risk</h3>
                <p className="text-xs text-slate-500">Distribution across 1,248 personnel</p>
              </div>
              <span className="text-[11px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                10% High
              </span>
            </div>

            <div className="h-56 relative mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attritionDonutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {attritionDonutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`${value}% of Workforce`, 'Proportion']}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      color: '#fff',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Centered label inside donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-slate-900">126</span>
                <span className="text-[10px] uppercase font-bold text-rose-600">High Risk</span>
              </div>
            </div>

            {/* Custom Legend */}
            <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-100 text-xs">
              <div className="p-2 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <span className="block font-bold text-emerald-800 text-sm">62%</span>
                <span className="text-[10px] text-emerald-600 font-semibold">Low (774)</span>
              </div>
              <div className="p-2 rounded-xl bg-amber-50/60 border border-amber-100">
                <span className="block font-bold text-amber-800 text-sm">28%</span>
                <span className="text-[10px] text-amber-600 font-semibold">Med (348)</span>
              </div>
              <div className="p-2 rounded-xl bg-rose-50/60 border border-rose-100">
                <span className="block font-bold text-rose-800 text-sm">10%</span>
                <span className="text-[10px] text-rose-600 font-semibold">High (126)</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('attrition')}
            className="w-full mt-4 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Explore Attrition Analytics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Attrition Risk Trend Over Time */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Attrition Risk Trend</h3>
                <p className="text-xs text-slate-500">Historical flight risk volume and engagement tracking</p>
              </div>

              {/* Timeframe selector: 7d, 30d, 90d, 1y */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                {(['7d', '30d', '90d', '1y'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeframe(t)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors uppercase ${
                      timeframe === t
                        ? 'bg-white text-indigo-600 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorHighRisk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      color: '#fff',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area
                    type="monotone"
                    dataKey="highRisk"
                    name="High Flight Risk (Count)"
                    stroke="#ef4444"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorHighRisk)"
                  />
                  <Area
                    type="monotone"
                    dataKey="avgEngagement"
                    name="Avg Engagement (%)"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorEngagement)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
            <span className="flex items-center gap-1.5 text-rose-600 font-semibold">
              <ShieldAlert className="w-3.5 h-3.5" />
              18 employees transitioned into high risk over this period
            </span>
            <span className="font-mono text-slate-400">ML Confidence: 94.2%</span>
          </div>
        </div>
      </div>

      {/* Section 7: Burnout & Wellbeing Analysis Cards */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Burnout & Wellbeing Analysis</h3>
              <p className="text-xs text-slate-500">Holistic mental health, workload pacing & overtime indicators</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('wellbeing')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View Full Wellbeing Hub</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 5 Wellbeing Pillars */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Wellbeing Score</span>
            <span className="text-2xl font-black text-indigo-700 font-mono mt-1 block">74/100</span>
            <span className="text-[10px] text-slate-500 mt-1 block">Stable benchmark</span>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200/80">
            <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block">Burnout Risk</span>
            <span className="text-2xl font-black text-rose-700 font-mono mt-1 block">84 employees</span>
            <span className="text-[10px] text-rose-600 font-semibold mt-1 block">⚠️ 6.7% of workforce</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Average Workload</span>
            <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">68%</span>
            <span className="text-[10px] text-slate-500 mt-1 block">Optimal capacity zone</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Work-Life Balance</span>
            <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">71%</span>
            <span className="text-[10px] text-slate-500 mt-1 block">+3% vs last quarter</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Engagement</span>
            <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">74%</span>
            <span className="text-[10px] text-slate-500 mt-1 block">High cultural trust</span>
          </div>
        </div>
      </div>

      {/* Section 8 & Priority Spotlight Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Section 8: Department Analytics Comparison */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Department Risk Comparison</h3>
                <p className="text-xs text-slate-500">Attrition vs Burnout Risk by business unit</p>
              </div>
              <span className="text-xs text-slate-400 font-mono">7 Departments</span>
            </div>

            {/* Department Comparison Bar Chart */}
            <div className="h-64 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="department" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      color: '#fff',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="attritionRiskRate" name="Attrition Risk %" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="burnoutRiskRate" name="Burnout Risk %" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="avgEngagement" name="Avg Engagement %" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Matrix Table */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-2">Department</th>
                    <th className="pb-2 text-right">Employees</th>
                    <th className="pb-2 text-right">Attrition Risk</th>
                    <th className="pb-2 text-right">Burnout Risk</th>
                    <th className="pb-2 text-right">Engagement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {departmentStats.slice(0, 5).map((d) => (
                    <tr key={d.department} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2 font-bold text-slate-900 flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        {d.department}
                      </td>
                      <td className="py-2 text-right font-mono text-slate-600">{d.employeeCount}</td>
                      <td className="py-2 text-right">
                        <span className={`font-bold font-mono ${d.attritionRiskRate > 12 ? 'text-rose-600' : 'text-slate-700'}`}>
                          {d.attritionRiskRate}%
                        </span>
                      </td>
                      <td className="py-2 text-right">
                        <span className={`font-bold font-mono ${d.burnoutRiskRate > 15 ? 'text-amber-600' : 'text-slate-700'}`}>
                          {d.burnoutRiskRate}%
                        </span>
                      </td>
                      <td className="py-2 text-right font-bold font-mono text-indigo-600">
                        {d.avgEngagement}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('analytics')}
            className="w-full mt-3 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <span>View Complete Department Analytics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Priority High-Risk Employees Spotlight */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Priority Retention Spotlight</h3>
                <p className="text-xs text-slate-500">Top talent requiring proactive intervention</p>
              </div>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                Action Required
              </span>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {highRiskEmployees.map((emp) => (
                <div
                  key={emp.id}
                  onClick={() => onSelectEmployee(emp)}
                  className="py-3 flex items-center justify-between gap-2 hover:bg-slate-50 rounded-xl px-2 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={emp.avatar}
                      alt={emp.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                          {emp.name}
                        </p>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1 rounded">
                          {emp.employeeId}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">
                        {emp.role} • {emp.department}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <RiskBadge level={emp.attritionRiskLevel} score={emp.attritionProbability} size="sm" />
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onNavigate('employees')}
              className="w-full py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <span>View All 1,248 Employees</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* AI Workforce Insights Feed */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 rounded-2xl shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold tracking-wide">Recent AI Workforce Insights</h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('insights')}
            className="text-xs text-indigo-300 hover:text-white font-semibold flex items-center gap-1 transition-colors"
          >
            <span>View All Insights</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiInsights.slice(0, 2).map((ins) => (
            <div key={ins.id} className="p-4 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 font-mono">
                  {ins.code} • {ins.department}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    ins.severity === 'Critical'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {ins.severity}
                </span>
              </div>
              <h4 className="text-xs font-bold text-white">{ins.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{ins.description}</p>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-indigo-200">
                <span>{ins.metricHighlight}</span>
                <button
                  type="button"
                  onClick={() => onNavigate('recommendations')}
                  className="font-bold text-white hover:underline flex items-center gap-1"
                >
                  <span>Action</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
