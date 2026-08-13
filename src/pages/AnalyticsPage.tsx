import React, { useState } from 'react';
import { Employee, DepartmentStat } from '../types';
import {
  BarChart3,
  TrendingDown,
  HeartPulse,
  Users,
  Activity,
  Calendar,
  Filter,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

interface AnalyticsPageProps {
  employees: Employee[];
  departmentStats: DepartmentStat[];
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  employees,
  departmentStats,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<'attrition' | 'burnout' | 'engagement'>('attrition');

  // Performance vs Flight Risk
  const perfRiskData = [
    { rating: '3.0 - 3.5 (Developing)', avgRisk: 28, count: 180 },
    { rating: '3.6 - 4.0 (Consistent)', avgRisk: 14, count: 520 },
    { rating: '4.1 - 4.5 (High Performer)', avgRisk: 19, count: 360 }, // High performers flight risk!
    { rating: '4.6 - 5.0 (Exceptional)', avgRisk: 31, count: 188 }, // Exceptional talent flight risk!
  ];

  // Radar Data for Department Capabilities
  const radarData = departmentStats.map((d) => ({
    subject: d.department,
    engagement: d.avgEngagement,
    burnoutRisk: d.burnoutRiskRate * 3, // scale for radar
    attritionRisk: d.attritionRiskRate * 3,
  }));

  return (
    <div id="advanced-analytics-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 shrink-0">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Workforce Intelligence Analytics
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Multi-dimensional cross-sectional analysis across performance, tenure, engagement, and flight risk.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setSelectedMetric('attrition')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              selectedMetric === 'attrition'
                ? 'bg-white text-indigo-600 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Attrition Risk
          </button>
          <button
            type="button"
            onClick={() => setSelectedMetric('burnout')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              selectedMetric === 'burnout'
                ? 'bg-white text-indigo-600 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Burnout & Stress
          </button>
          <button
            type="button"
            onClick={() => setSelectedMetric('engagement')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              selectedMetric === 'engagement'
                ? 'bg-white text-indigo-600 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Engagement & Pulse
          </button>
        </div>
      </div>

      {/* Grid: Performance vs Flight Risk & Department Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Performance Rating vs Attrition Risk */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Performance Rating vs Attrition Probability</h3>
                <p className="text-xs text-slate-500">U-shaped curve: top performers (4.6-5.0) show elevated flight risk</p>
              </div>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                High Risk Alert
              </span>
            </div>

            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={perfRiskData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="rating" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
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
                  <Bar dataKey="avgRisk" name="Avg Flight Risk %" fill="#ec4899" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 mt-2">
            Top performers exhibit higher flight risk when market demand is high and internal promotions or salary adjustments stall.
          </div>
        </div>

        {/* Chart 2: Department Multi-Pillar Radar */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Workforce Health Radar</h3>
              <span className="text-xs text-slate-400 font-mono">Multi-Factor</span>
            </div>

            <div className="h-64 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius={70}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                  <Radar name="Engagement %" dataKey="engagement" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                  <Radar name="Attrition Risk (x3)" dataKey="attritionRisk" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 text-center">
            Higher engagement correlates with robust retention resiliency across HR and Finance.
          </p>
        </div>
      </div>

      {/* Department Breakdown Matrix */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">Organizational Department Scorecard</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4 text-right">Headcount</th>
                <th className="py-3 px-4 text-right">Attrition Risk Rate</th>
                <th className="py-3 px-4 text-right">Burnout Risk Rate</th>
                <th className="py-3 px-4 text-right">Engagement Score</th>
                <th className="py-3 px-4 text-right">Health Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {departmentStats.map((d) => (
                <tr key={d.department} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{d.department}</td>
                  <td className="py-3 px-4 text-right font-mono text-slate-600">{d.employeeCount}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`font-mono font-bold ${d.attritionRiskRate > 12 ? 'text-rose-600' : 'text-slate-700'}`}>
                      {d.attritionRiskRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`font-mono font-bold ${d.burnoutRiskRate > 15 ? 'text-amber-600' : 'text-slate-700'}`}>
                      {d.burnoutRiskRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-indigo-600">
                    {d.avgEngagement}%
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        d.attritionRiskRate > 15
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : d.attritionRiskRate > 10
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {d.attritionRiskRate > 15 ? 'Critical' : d.attritionRiskRate > 10 ? 'Needs Attention' : 'Healthy'}
                    </span>
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
