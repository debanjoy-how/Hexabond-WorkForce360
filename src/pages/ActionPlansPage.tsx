import React, { useState } from 'react';
import { ActionPlan, ActionStatus, Employee } from '../types';
import {
  Target,
  Plus,
  CheckCircle2,
  Clock,
  UserCheck,
  Calendar,
  Filter,
  LayoutGrid,
  List,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ActionPlansPageProps {
  actionPlans: ActionPlan[];
  employees: Employee[];
  onUpdateStatus: (id: string, status: ActionStatus) => void;
  onOpenCreateAction: (emp?: Employee) => void;
  onSelectEmployee: (emp: Employee) => void;
}

export const ActionPlansPage: React.FC<ActionPlansPageProps> = ({
  actionPlans,
  employees,
  onUpdateStatus,
  onOpenCreateAction,
  onSelectEmployee,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');

  const handleCompletePlan = (id: string) => {
    onUpdateStatus(id, 'Completed');
    // Trigger celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const filteredPlans = actionPlans.filter((plan) => {
    const matchDept = selectedDept === 'All' || plan.department === selectedDept;
    const matchPri = selectedPriority === 'All' || plan.priority === selectedPriority;
    return matchDept && matchPri;
  });

  const pendingPlans = filteredPlans.filter((p) => p.status === 'Pending');
  const inProgressPlans = filteredPlans.filter((p) => p.status === 'In Progress');
  const completedPlans = filteredPlans.filter((p) => p.status === 'Completed');

  const getPriorityBadge = (pri: ActionPlan['priority']) => {
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
    <div id="action-plans-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                HR Intervention & Action Plans
              </h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {actionPlans.length} Total Initiatives
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Track manager 1:1s, workload reductions, and compensation reviews from prescription to completion.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'kanban' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-500'
              }`}
              title="Kanban Board View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-500'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => onOpenCreateAction()}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Action Plan</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-semibold">Department:</span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
          >
            <option value="All">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="Finance">Finance</option>
            <option value="Customer Support">Customer Support</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
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

      {/* Kanban Board View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column: Pending */}
          <div className="bg-slate-100/70 p-4 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Pending ({pendingPlans.length})
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              {pendingPlans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  onUpdateStatus={onUpdateStatus}
                  onComplete={handleCompletePlan}
                  employees={employees}
                  onSelectEmployee={onSelectEmployee}
                />
              ))}
              {pendingPlans.length === 0 && (
                <p className="p-6 text-center text-xs text-slate-400">No pending plans.</p>
              )}
            </div>
          </div>

          {/* Column: In Progress */}
          <div className="bg-slate-100/70 p-4 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  In Progress ({inProgressPlans.length})
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              {inProgressPlans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  onUpdateStatus={onUpdateStatus}
                  onComplete={handleCompletePlan}
                  employees={employees}
                  onSelectEmployee={onSelectEmployee}
                />
              ))}
              {inProgressPlans.length === 0 && (
                <p className="p-6 text-center text-xs text-slate-400">No plans currently in progress.</p>
              )}
            </div>
          </div>

          {/* Column: Completed */}
          <div className="bg-slate-100/70 p-4 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Completed ({completedPlans.length})
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              {completedPlans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  onUpdateStatus={onUpdateStatus}
                  onComplete={handleCompletePlan}
                  employees={employees}
                  onSelectEmployee={onSelectEmployee}
                />
              ))}
              {completedPlans.length === 0 && (
                <p className="p-6 text-center text-xs text-slate-400">No completed plans yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Action Title</th>
                  <th className="py-3.5 px-4">Employee</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Owner</th>
                  <th className="py-3.5 px-4">Due Date</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPlans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{plan.actionTitle}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {plan.employeeName} ({plan.department})
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{plan.actionType}</td>
                    <td className="py-3.5 px-4 text-slate-600">{plan.assignedTo}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{plan.dueDate}</td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getPriorityBadge(plan.priority)}`}>
                        {plan.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          plan.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : plan.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {plan.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {plan.status !== 'Completed' ? (
                        <button
                          type="button"
                          onClick={() => handleCompletePlan(plan.id)}
                          className="px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Done</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-semibold">Resolved</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// Subcomponent: PlanCard for Kanban
const PlanCard: React.FC<{
  plan: ActionPlan;
  onUpdateStatus: (id: string, status: ActionStatus) => void;
  onComplete: (id: string) => void;
  employees: Employee[];
  onSelectEmployee: (emp: Employee) => void;
}> = ({ plan, onUpdateStatus, onComplete, employees, onSelectEmployee }) => {
  const emp = employees.find((e) => e.id === plan.employeeId || e.employeeId === plan.employeeId);

  const getPriorityStyle = (pri: ActionPlan['priority']) => {
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
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3 hover:border-indigo-300 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {plan.actionType}
        </span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${getPriorityStyle(plan.priority)}`}>
          {plan.priority}
        </span>
      </div>

      <div>
        <h4 className="text-xs font-bold text-slate-900 leading-snug">{plan.actionTitle}</h4>
        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{plan.notes}</p>
      </div>

      {/* Target Outcome */}
      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600">
        <span className="font-semibold text-slate-700">Target: </span>
        <span>{plan.targetOutcome}</span>
      </div>

      {/* Employee & Assignee Details */}
      <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
        <div className="flex items-center justify-between">
          <span className="text-[11px]">Target:</span>
          {emp ? (
            <button
              type="button"
              onClick={() => onSelectEmployee(emp)}
              className="font-bold text-slate-800 hover:text-indigo-600 transition-colors truncate max-w-[140px]"
            >
              {plan.employeeName}
            </button>
          ) : (
            <span className="font-bold text-slate-800">{plan.employeeName}</span>
          )}
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <span>Owner:</span>
          <span className="font-medium text-slate-700">{plan.assignedTo}</span>
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" />
            Due:
          </span>
          <span className="font-mono text-slate-700 font-semibold">{plan.dueDate}</span>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <select
          value={plan.status}
          onChange={(e) => onUpdateStatus(plan.id, e.target.value as ActionStatus)}
          className="text-[11px] px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:outline-hidden"
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        {plan.status !== 'Completed' && (
          <button
            type="button"
            onClick={() => onComplete(plan.id)}
            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            title="Mark as Completed"
          >
            <CheckCircle2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
