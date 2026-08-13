import React, { useState } from 'react';
import { ActionPlan, ActionStatus, Employee, PriorityLevel } from '../types';
import { X, CheckCircle, Target, UserCheck, Calendar, FileText } from 'lucide-react';

interface CreateActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (plan: Omit<ActionPlan, 'id' | 'createdAt'>) => void;
  employees: Employee[];
  initialEmployee?: Employee | null;
  defaultTargetOutcome?: string;
  defaultNotes?: string;
  defaultActionType?: ActionPlan['actionType'];
}

export const CreateActionModal: React.FC<CreateActionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  employees,
  initialEmployee,
  defaultTargetOutcome = '',
  defaultNotes = '',
  defaultActionType = 'Workload Adjustment',
}) => {
  const [selectedEmpId, setSelectedEmpId] = useState(initialEmployee?.id || (employees[0]?.id ?? ''));
  const [actionTitle, setActionTitle] = useState('');
  const [actionType, setActionType] = useState<ActionPlan['actionType']>(defaultActionType);
  const [assignedTo, setAssignedTo] = useState('Marcus Vance');
  const [assignedRole, setAssignedRole] = useState('Engineering Director');
  const [priority, setPriority] = useState<PriorityLevel>('High');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [status, setStatus] = useState<ActionStatus>('Pending');
  const [targetOutcome, setTargetOutcome] = useState(defaultTargetOutcome || 'Reduce predicted attrition risk and restore wellbeing.');
  const [notes, setNotes] = useState(defaultNotes || '');

  if (!isOpen) return null;

  const currentEmp = employees.find((e) => e.id === selectedEmpId) || initialEmployee || employees[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionTitle.trim() || !currentEmp) return;

    onSubmit({
      employeeId: currentEmp.id,
      employeeName: currentEmp.name,
      department: currentEmp.department,
      actionTitle,
      actionType,
      assignedTo,
      assignedRole,
      priority,
      dueDate,
      status,
      notes,
      targetOutcome,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="create-action-modal-dialog"
        className="bg-white w-full max-w-xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-600 text-white">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Create HR Retention Action Plan</h3>
              <p className="text-xs text-slate-500">Formulate and track proactive employee interventions</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Employee Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Target Employee
            </label>
            <select
              value={selectedEmpId}
              onChange={(e) => setSelectedEmpId(e.target.value)}
              className="w-full text-sm font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.employeeId}) — {emp.department} • {emp.attritionRiskLevel} Risk ({emp.attritionProbability}%)
                </option>
              ))}
            </select>
          </div>

          {/* Action Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Action Plan Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Sprint Epics Rebalancing & 1:1 Growth Session"
              value={actionTitle}
              onChange={(e) => setActionTitle(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Grid: Type & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Intervention Category
              </label>
              <select
                value={actionType}
                onChange={(e) => setActionType(e.target.value as any)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Workload Adjustment">Workload Adjustment</option>
                <option value="Career Discussion">Career Discussion</option>
                <option value="Training & Upskilling">Training & Upskilling</option>
                <option value="Mentorship">Mentorship</option>
                <option value="Recognition & Rewards">Recognition & Rewards</option>
                <option value="Flexible Working">Flexible Working</option>
                <option value="Manager Meeting">Manager 1:1 Meeting</option>
                <option value="Compensation Review">Compensation Review</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-semibold"
              >
                <option value="Critical">🔴 Critical (Immediate)</option>
                <option value="High">🟠 High Priority</option>
                <option value="Medium">🟡 Medium Priority</option>
                <option value="Low">🟢 Low Priority</option>
              </select>
            </div>
          </div>

          {/* Assignee & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Assigned Owner
              </label>
              <input
                type="text"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                placeholder="e.g. Marcus Vance"
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Target Outcome */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Target Outcome Metric
            </label>
            <input
              type="text"
              value={targetOutcome}
              onChange={(e) => setTargetOutcome(e.target.value)}
              placeholder="e.g. Reduce flight risk below 50% within 30 days"
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Intervention Notes & Next Steps
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Details agreed upon with manager, dates of discussions, temporary coverage..."
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-colors flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              Create Action Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
