import React, { useState } from 'react';
import { Employee, Recommendation, ActionPlan } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import { ShapWaterfallChart } from '../components/ShapWaterfallChart';
import { WhatIfSimulator } from '../components/WhatIfSimulator';
import {
  ArrowLeft,
  Sparkles,
  Sliders,
  Lightbulb,
  History,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  Briefcase,
  AlertTriangle,
  Flame,
  Activity,
  Heart,
  TrendingDown,
  Target,
  Plus,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

interface EmployeeProfilePageProps {
  employee: Employee;
  recommendations: Recommendation[];
  actionPlans: ActionPlan[];
  onBack: () => void;
  onOpenCreateAction: (
    emp?: Employee,
    defaultTarget?: string,
    defaultNotes?: string,
    defaultType?: ActionPlan['actionType']
  ) => void;
}

export const EmployeeProfilePage: React.FC<EmployeeProfilePageProps> = ({
  employee,
  recommendations,
  actionPlans,
  onBack,
  onOpenCreateAction,
}) => {
  const [activeTab, setActiveTab] = useState<'shap' | 'whatif' | 'recommendations' | 'history'>('shap');

  // Filter recommendations & actions for this employee
  const employeeRecs = recommendations.filter(
    (r) => r.employeeId.toLowerCase() === employee.id.toLowerCase() || r.employeeId.toLowerCase() === employee.employeeId.toLowerCase()
  );

  const employeeActions = actionPlans.filter(
    (a) => a.employeeId.toLowerCase() === employee.id.toLowerCase() || a.employeeId.toLowerCase() === employee.employeeId.toLowerCase()
  );

  return (
    <div id="employee-profile-detail-page" className="space-y-6">
      {/* Back Button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Employee Record</span>
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
            {employee.employeeId}
          </span>
        </div>
      </div>

      {/* Main Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <img
              src={employee.avatar}
              alt={employee.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-slate-100 shadow-md shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">{employee.name}</h2>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {employee.employeeId}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {employee.status}
                </span>
              </div>

              <p className="text-sm font-semibold text-indigo-700">{employee.role}</p>

              <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap pt-1">
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  {employee.department} Department
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {employee.location}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {employee.email}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats on Top Right */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => onOpenCreateAction(employee)}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-colors flex items-center gap-1.5"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Create Action Plan</span>
            </button>
          </div>
        </div>

        {/* Secondary Info Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Tenure</span>
            <span className="font-bold text-slate-800">{employee.tenureYears} Years</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Annual Base</span>
            <span className="font-bold text-slate-800 font-mono">${employee.salary.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Weekly Overtime</span>
            <span className={`font-bold font-mono ${employee.overtimeHours > 8 ? 'text-rose-600' : 'text-slate-800'}`}>
              {employee.overtimeHours} hrs/wk
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Last Promotion</span>
            <span className={`font-bold ${employee.lastPromotionYearsAgo > 2.5 ? 'text-amber-600' : 'text-slate-800'}`}>
              {employee.lastPromotionYearsAgo} yrs ago
            </span>
          </div>
        </div>
      </div>

      {/* Top 5 Metric Cards requested in Section 10 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Attrition Risk */}
        <div className="bg-white p-4 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Attrition Risk</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-rose-600 font-mono">
              {employee.attritionProbability}%
            </span>
            <span className="block text-[11px] font-bold uppercase tracking-wide text-rose-700 mt-0.5">
              {employee.attritionRiskLevel} RISK
            </span>
          </div>
        </div>

        {/* Burnout Risk */}
        <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Burnout Risk</span>
            <Flame className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-600 font-mono">
              {employee.burnoutProbability}%
            </span>
            <span className="block text-[11px] font-bold uppercase tracking-wide text-amber-700 mt-0.5">
              {employee.burnoutRiskLevel} RISK
            </span>
          </div>
        </div>

        {/* Engagement */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Engagement</span>
            <Activity className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {employee.engagementScore}%
            </span>
            <span
              className={`block text-[11px] font-bold uppercase tracking-wide mt-0.5 ${
                employee.engagementScore < 50 ? 'text-rose-600' : 'text-slate-600'
              }`}
            >
              {employee.engagementScore < 50 ? 'LOW' : employee.engagementScore < 75 ? 'MODERATE' : 'HIGH'}
            </span>
          </div>
        </div>

        {/* Job Satisfaction */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Job Satisfaction</span>
            <Heart className="w-4 h-4 text-pink-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {employee.jobSatisfaction}%
            </span>
            <span
              className={`block text-[11px] font-bold uppercase tracking-wide mt-0.5 ${
                employee.jobSatisfaction < 50 ? 'text-rose-600' : 'text-slate-600'
              }`}
            >
              {employee.jobSatisfaction < 50 ? 'LOW' : 'SATISFACTORY'}
            </span>
          </div>
        </div>

        {/* Work-Life Balance */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Work-Life Balance</span>
            <Clock className="w-4 h-4 text-violet-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {employee.workLifeBalance}%
            </span>
            <span
              className={`block text-[11px] font-bold uppercase tracking-wide mt-0.5 ${
                employee.workLifeBalance < 50 ? 'text-rose-600' : 'text-slate-600'
              }`}
            >
              {employee.workLifeBalance < 50 ? 'LOW' : 'BALANCED'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('shap')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'shap'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Explainable AI • SHAP</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('whatif')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'whatif'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>What-If Simulator</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('recommendations')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'recommendations'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          <span>AI Recommendations ({employeeRecs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'history'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Risk Timeline & History</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="space-y-6">
        {/* Tab 1: SHAP Explainability */}
        {activeTab === 'shap' && (
          <ShapWaterfallChart
            factors={employee.shapFactors}
            aiExplanation={employee.aiExplanation}
            employeeName={employee.name}
            attritionScore={employee.attritionProbability}
          />
        )}

        {/* Tab 2: What-If Scenario Simulator */}
        {activeTab === 'whatif' && (
          <WhatIfSimulator
            employee={employee}
            onCreateActionPlan={(targetOutcome, notes) => {
              onOpenCreateAction(employee, targetOutcome, notes, 'Workload Adjustment');
            }}
          />
        )}

        {/* Tab 3: AI Recommendations */}
        {activeTab === 'recommendations' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">AI Retention Recommended Actions</h3>
                <p className="text-xs text-slate-500">
                  Targeted, high-ROI intervention strategies formulated by the recommendation engine.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenCreateAction(employee)}
                className="px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Custom Action</span>
              </button>
            </div>

            {/* Standard Default Recommendation Cards requested in Section 12 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1. Reduce Workload */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 uppercase">
                      Critical Priority
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Workload Adjustment</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Reduce Workload & Sprint Epics</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    High workload ({employee.weeklyHours}h/wk total, {employee.overtimeHours}h overtime) is contributing significantly to burnout risk.
                  </p>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600">
                    <strong>Expected Impact:</strong> -34% Burnout Risk, +22% Work-Life Balance score
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onOpenCreateAction(
                      employee,
                      'Reduce weekly hours to 40h/wk and lower burnout risk',
                      'Reassign 2 sprint epics and provide temporary on-call exemption.',
                      'Workload Adjustment'
                    )
                  }
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Create Action</span>
                </button>
              </div>

              {/* 2. Career Growth Discussion */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 uppercase">
                      High Priority
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Career Growth</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Career Growth Discussion</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    No promotion has been recorded in {employee.lastPromotionYearsAgo} years despite a {employee.performanceRating}/5.0 performance rating.
                  </p>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600">
                    <strong>Expected Impact:</strong> -40% Flight Risk, +30% Engagement
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onOpenCreateAction(
                      employee,
                      'Establish Staff Engineer career rubric and promotion timeline',
                      'Manager to initiate formal promotion packet review.',
                      'Career Discussion'
                    )
                  }
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Create Action</span>
                </button>
              </div>

              {/* 3. Flexible Working */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                      Medium Priority
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Flexible Working</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Flexible Working Support</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Poor work-life balance ({employee.workLifeBalance}%) detected with frequent late evening commit signals.
                  </p>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600">
                    <strong>Expected Impact:</strong> +18% Work-Life Balance, -15% Burnout Probability
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onOpenCreateAction(
                      employee,
                      'Implement flex-Friday schedule and protected deep-work blocks',
                      'Introduce asynchronous code review SLA so evening commits are not required.',
                      'Flexible Working'
                    )
                  }
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Create Action</span>
                </button>
              </div>

              {/* 4. Manager 1:1 */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
                      High Priority
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Manager 1:1</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Manager 1:1 Alignment</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Engagement score ({employee.engagementScore}%) is below the recommended organizational healthy threshold of 70%.
                  </p>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600">
                    <strong>Expected Impact:</strong> Early warning alignment, restores mutual leadership trust
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onOpenCreateAction(
                      employee,
                      'Bi-weekly structured 1:1 mentoring sessions scheduled',
                      'Manager Marcus Vance to conduct dedicated retention & support check-in.',
                      'Manager Meeting'
                    )
                  }
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Create Action</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: History & Diagnostics */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">5-Month Longitudinal Risk Trajectory</h3>
                  <p className="text-xs text-slate-500">Historical trend lines for attrition probability, burnout, and engagement</p>
                </div>
                <span className="text-xs text-slate-400 font-mono">Monthly Snapshots</span>
              </div>

              <div className="h-72 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={employee.historicalScores} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} unit="%" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        color: '#fff',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Line type="monotone" dataKey="attritionRisk" name="Attrition Risk %" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="burnoutRisk" name="Burnout Risk %" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="engagement" name="Engagement %" stroke="#6366f1" strokeWidth={2.5} strokeDasharray="4 4" />
                    <Line type="monotone" dataKey="satisfaction" name="Job Satisfaction %" stroke="#ec4899" strokeWidth={2} strokeDasharray="2 2" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Active Action Plans for this Employee */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">Recorded HR Action Plans ({employeeActions.length})</h3>
              {employeeActions.length === 0 ? (
                <p className="text-xs text-slate-400">No active action plans logged for this employee yet.</p>
              ) : (
                <div className="space-y-3">
                  {employeeActions.map((a) => (
                    <div key={a.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{a.actionTitle}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            a.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : a.status === 'In Progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {a.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">{a.notes}</p>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span>Assigned to: <strong className="text-slate-700">{a.assignedTo}</strong></span>
                        <span>Due: {a.dueDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
