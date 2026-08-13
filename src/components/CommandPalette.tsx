import React, { useState, useEffect } from 'react';
import { Employee, Recommendation, ActionPlan } from '../types';
import { Search, User, ShieldAlert, Sparkles, Target, ArrowRight, X } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  recommendations: Recommendation[];
  actionPlans: ActionPlan[];
  onSelectEmployee: (emp: Employee) => void;
  onNavigatePage: (page: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  employees,
  recommendations,
  actionPlans,
  onSelectEmployee,
  onNavigatePage,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose(); // toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredEmployees = query
    ? employees.filter(
        (e) =>
          e.name.toLowerCase().includes(query.toLowerCase()) ||
          e.employeeId.toLowerCase().includes(query.toLowerCase()) ||
          e.department.toLowerCase().includes(query.toLowerCase()) ||
          e.role.toLowerCase().includes(query.toLowerCase())
      )
    : employees.slice(0, 4);

  const filteredRecs = query
    ? recommendations.filter(
        (r) =>
          r.title.toLowerCase().includes(query.toLowerCase()) ||
          r.employeeName.toLowerCase().includes(query.toLowerCase()) ||
          r.category.toLowerCase().includes(query.toLowerCase())
      )
    : recommendations.slice(0, 2);

  const pages = [
    { id: 'dashboard', label: 'Dashboard Overview', category: 'Pages' },
    { id: 'employees', label: 'Employee Directory', category: 'Pages' },
    { id: 'attrition', label: 'Workforce Attrition Risk', category: 'Pages' },
    { id: 'wellbeing', label: 'Wellbeing & Burnout Analysis', category: 'Pages' },
    { id: 'insights', label: 'AI Workforce Insights', category: 'Pages' },
    { id: 'recommendations', label: 'AI Retention Recommendations', category: 'Pages' },
    { id: 'action-plans', label: 'Action Plans & Interventions', category: 'Pages' },
    { id: 'analytics', label: 'Advanced Analytics', category: 'Pages' },
    { id: 'reports', label: 'Reports & Export', category: 'Pages' },
    { id: 'data-import', label: 'Import Employee CSV', category: 'Pages' },
    { id: 'fairness', label: 'Fairness & Responsible AI', category: 'Pages' },
  ].filter((p) => !query || p.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        id="global-command-palette-dialog"
        className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search employees, ID (EMP-1024), departments, recommendations, pages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm bg-transparent border-none focus:outline-hidden text-slate-800 placeholder-slate-400"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-200 rounded border border-slate-300">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {/* Quick Pages */}
          {pages.length > 0 && (
            <div className="space-y-1">
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">Pages</p>
              <div className="space-y-0.5">
                {pages.slice(0, 4).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onNavigatePage(p.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition-colors text-left"
                  >
                    <span>{p.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Employees */}
          {filteredEmployees.length > 0 && (
            <div className="space-y-1">
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">Employees</p>
              <div className="space-y-1">
                {filteredEmployees.map((emp) => (
                  <button
                    key={emp.id}
                    onClick={() => {
                      onSelectEmployee(emp);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-xl border border-transparent hover:border-slate-200 transition-all text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{emp.name}</span>
                          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                            {emp.employeeId}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">{emp.role} • {emp.department}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          emp.attritionRiskLevel === 'High'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : emp.attritionRiskLevel === 'Medium'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {emp.attritionProbability}% Risk
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* AI Recommendations */}
          {filteredRecs.length > 0 && (
            <div className="space-y-1">
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">Recommendations</p>
              <div className="space-y-1">
                {filteredRecs.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      onNavigatePage('recommendations');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 hover:bg-indigo-50/50 rounded-xl border border-transparent hover:border-indigo-100 transition-all text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-slate-800">{r.title}</p>
                        <p className="text-[11px] text-slate-500">{r.employeeName} ({r.department})</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      {r.priority}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Navigate with mouse or arrow keys</span>
          <span className="font-mono text-slate-400">AI-Driven Retention Platform</span>
        </div>
      </div>
    </div>
  );
};
