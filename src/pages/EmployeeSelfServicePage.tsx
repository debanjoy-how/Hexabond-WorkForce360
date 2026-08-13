import React, { useState } from 'react';
import { Employee, Recommendation } from '../types';
import {
  HeartPulse,
  Smile,
  Clock,
  Briefcase,
  Sparkles,
  Calendar,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Send,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface EmployeeSelfServicePageProps {
  employee: Employee;
  recommendations: Recommendation[];
}

export const EmployeeSelfServicePage: React.FC<EmployeeSelfServicePageProps> = ({
  employee,
  recommendations,
}) => {
  const [mood, setMood] = useState<'great' | 'okay' | 'tired' | 'stressed'>('tired');
  const [pulseSubmitted, setPulseSubmitted] = useState(false);
  const [requestedDiscussion, setRequestedDiscussion] = useState(false);
  const [anonymousFeedback, setAnonymousFeedback] = useState('');

  const handlePulseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPulseSubmitted(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  };

  const handleRequestDiscussion = () => {
    setRequestedDiscussion(true);
  };

  return (
    <div id="employee-self-service-portal" className="space-y-6 max-w-5xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={employee.avatar}
            alt={employee.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-100 shadow-md shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Welcome back, {employee.name.split(' ')[0]}
            </h2>
            <p className="text-xs text-slate-500">
              {employee.role} • {employee.department} • {employee.location}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                🔒 Private Employee Portal
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRequestDiscussion}
          disabled={requestedDiscussion}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shrink-0 ${
            requestedDiscussion
              ? 'bg-emerald-600 text-white pointer-events-none'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {requestedDiscussion ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>1:1 Meeting Requested</span>
            </>
          ) : (
            <>
              <MessageSquare className="w-4 h-4" />
              <span>Request 1:1 Check-In</span>
            </>
          )}
        </button>
      </div>

      {/* Personal Wellbeing Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Workload Pacing */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Weekly Pacing</span>
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <span className="text-3xl font-black font-mono text-slate-900">{employee.weeklyHours}h</span>
            <span className="text-xs text-slate-500 block mt-1">
              Includes <strong className="text-rose-600 font-mono">+{employee.overtimeHours}h overtime</strong> this week
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-rose-500 h-full rounded-full"
              style={{ width: `${Math.min(100, (employee.weeklyHours / 55) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500">
            Target recommended threshold is 40h/wk. Consider requesting sprint workload rebalancing.
          </p>
        </div>

        {/* Work-Life Balance */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Work-Life Balance</span>
            <HeartPulse className="w-4 h-4 text-violet-600" />
          </div>
          <div>
            <span className="text-3xl font-black font-mono text-slate-900">{employee.workLifeBalance}%</span>
            <span className="text-xs text-amber-600 font-bold block mt-1">Needs attention</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full"
              style={{ width: `${employee.workLifeBalance}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500">
            Based on late-evening activity and continuous weekend ticket updates.
          </p>
        </div>

        {/* Growth & Career Track */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Career Trajectory</span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <span className="text-3xl font-black font-mono text-slate-900">{employee.performanceRating}/5.0</span>
            <span className="text-xs text-emerald-600 font-bold block mt-1">High Performance Rating</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600">
            Last promotion: {employee.lastPromotionYearsAgo} yrs ago. You are eligible for Staff Engineer review.
          </div>
        </div>
      </div>

      {/* Daily Pulse Check-In */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Smile className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">How are you feeling today?</h3>
          </div>
          <span className="text-xs text-slate-400">Anonymous & Private</span>
        </div>

        {!pulseSubmitted ? (
          <form onSubmit={handlePulseSubmit} className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'great', label: '⚡ Energized', desc: 'Feeling productive' },
                { id: 'okay', label: '👌 Good', desc: 'Manageable pace' },
                { id: 'tired', label: '🥱 Fatigued', desc: 'High workload load' },
                { id: 'stressed', label: '🔥 Stressed', desc: 'Overwhelmed' },
              ].map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setMood(m.id as any)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    mood === m.id
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="block text-sm font-bold">{m.label}</span>
                  <span className="block text-[11px] text-slate-500 font-normal mt-0.5">{m.desc}</span>
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Optional anonymous feedback or suggestions:
              </label>
              <textarea
                rows={2}
                value={anonymousFeedback}
                onChange={(e) => setAnonymousFeedback(e.target.value)}
                placeholder="Share any thoughts on sprint workload, tooling, or team dynamics..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Daily Pulse</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 text-center space-y-2 bg-emerald-50 rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-bold text-emerald-900">Thank you for sharing your feedback!</h4>
            <p className="text-xs text-emerald-700">
              Your response helps leadership make proactive decisions to support team wellbeing.
            </p>
          </div>
        )}
      </div>

      {/* Growth & Wellbeing Recommendations */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">Personalized Wellbeing & Growth Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 block text-sm">Protected Focus Blocks</span>
            <p className="text-slate-600">
              Schedule 2 hours of meeting-free deep work daily to reduce cognitive context switching and eliminate the need for late-evening catch-up.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 block text-sm">Career Milestone Planning</span>
            <p className="text-slate-600">
              Book a dedicated 1:1 with Marcus Vance to discuss your Staff Engineer promotion timeline and portfolio impact milestones.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
