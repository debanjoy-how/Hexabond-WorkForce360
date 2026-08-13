import React, { useState } from 'react';
import { Recommendation, Employee, ActionPlan } from '../types';
import {
  Lightbulb,
  Target,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Clock,
  Briefcase,
  DollarSign,
  Heart,
  CheckCircle2,
  Users,
} from 'lucide-react';

interface RecommendationsPageProps {
  recommendations: Recommendation[];
  employees: Employee[];
  onOpenCreateAction: (
    emp?: Employee,
    defaultTarget?: string,
    defaultNotes?: string,
    defaultType?: ActionPlan['actionType']
  ) => void;
  onSelectEmployee: (emp: Employee) => void;
}

export const RecommendationsPage: React.FC<RecommendationsPageProps> = ({
  recommendations,
  employees,
  onOpenCreateAction,
  onSelectEmployee,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');

  const categories = ['All', 'Workload', 'Career', 'Compensation', 'Wellbeing', 'Mentorship'];

  const filtered = recommendations.filter((r) => {
    const matchCat = selectedCategory === 'All' || r.category === selectedCategory;
    const matchPri = selectedPriority === 'All' || r.priority === selectedPriority;
    return matchCat && matchPri;
  });

  const getPriorityBadge = (pri: Recommendation['priority']) => {
    switch (pri) {
      case 'Critical':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'High':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div id="ai-recommendations-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 shrink-0">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                AI Retention Recommendations
              </h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                {recommendations.length} Active Prescriptions
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Prescriptive interventions ranked by predicted retention ROI and cost-effectiveness.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpenCreateAction()}
          className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Target className="w-3.5 h-3.5" />
          <span>New Custom Plan</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs flex-wrap">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold">Priority:</span>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">🔴 Critical</option>
            <option value="High">🟠 High</option>
            <option value="Medium">🟡 Medium</option>
            <option value="Low">🟢 Low</option>
          </select>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((rec) => {
          const emp = employees.find((e) => e.id === rec.employeeId || e.employeeId === rec.employeeId);
          return (
            <div
              key={rec.id}
              className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4 hover:border-indigo-300 transition-all group"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">
                    {rec.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${getPriorityBadge(
                      rec.priority
                    )}`}
                  >
                    {rec.priority}
                  </span>
                </div>

                {/* Title & Description */}
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {rec.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{rec.description}</p>
                </div>

                {/* Target Employee */}
                {emp && (
                  <div
                    onClick={() => onSelectEmployee(emp)}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-indigo-50/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        className="w-7 h-7 rounded-full object-cover border border-slate-200"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900">{emp.name}</p>
                        <p className="text-[10px] text-slate-500">{emp.department} • {emp.role}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-indigo-600 font-bold">
                      {emp.attritionProbability}% Risk
                    </span>
                  </div>
                )}

                {/* Expected Impact Pill */}
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-800 space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                    Expected Outcome
                  </span>
                  <p className="font-semibold text-[11px]">{rec.expectedImpact}</p>
                </div>
              </div>

              {/* Action Trigger */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">Cost: {rec.estimatedCost}</span>
                <button
                  type="button"
                  onClick={() =>
                    onOpenCreateAction(
                      emp,
                      rec.expectedImpact,
                      `Generated from AI Recommendation: ${rec.title}. ${rec.description}`,
                      rec.category === 'Workload'
                        ? 'Workload Adjustment'
                        : rec.category === 'Career'
                        ? 'Career Discussion'
                        : rec.category === 'Compensation'
                        ? 'Compensation Review'
                        : rec.category === 'Mentorship'
                        ? 'Mentorship'
                        : 'Flexible Working'
                    )
                  }
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Create Action Plan</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
