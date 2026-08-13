import React from 'react';
import { X, Sparkles, Cpu, Database, Network, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        id="help-architecture-modal"
        className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-600 text-white">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Platform Architecture & Hackathon Demo</h3>
              <p className="text-xs text-slate-500">AI-Driven Retention & Wellbeing Intelligence Pipeline</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-xs text-slate-700">
          {/* Main Value Proposition */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100">
            <p className="font-bold text-slate-900 text-sm mb-1">Main Value Proposition</p>
            <p className="text-indigo-900 leading-relaxed">
              <strong>Predict risk early. Understand why. Take the right action. Improve employee wellbeing and retention.</strong>
              <br />
              This is not merely a resignation prediction tool; it is an AI-powered workforce intelligence and wellbeing decision-support platform.
            </p>
          </div>

          {/* End-to-End System Architecture */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Target Full-Stack ML Architecture
            </h4>
            <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto">
              <span className="text-indigo-400 font-bold">React 19 Frontend (Tailwind + Recharts + Lucide)</span>
              <br />&nbsp;&nbsp;↓ REST API (Asynchronous service layer with latency simulation)
              <br /><span className="text-emerald-400 font-bold">FastAPI Backend Router</span>
              <br />&nbsp;&nbsp;↓ ORM / Connection Pool
              <br /><span className="text-blue-400 font-bold">PostgreSQL / Supabase Database</span>
              <br />&nbsp;&nbsp;↓ Feature Pipelines
              <br /><span className="text-amber-400 font-bold">Python ML Engine (XGBoost + Random Forests)</span>
              <br />&nbsp;&nbsp;├── Attrition Probability Model
              <br />&nbsp;&nbsp;└── Burnout & Wellbeing Classifier
              <br />&nbsp;&nbsp;↓
              <br /><span className="text-violet-400 font-bold">TreeSHAP Explainability Engine</span> (Feature Attribution)
              <br />&nbsp;&nbsp;↓
              <br /><span className="text-rose-400 font-bold">AI Retention Recommendation Engine</span>
            </div>
          </div>

          {/* Presentation Flow Steps */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Recommended Hackathon / Project Demonstration Flow
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center">1</span>
                  Dashboard Overview
                </div>
                <p className="text-slate-600">
                  Show top KPI cards (1,248 total employees, 126 high attrition, 84 burnout) and interactive department comparisons.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center">2</span>
                  Select EMP-1024 (Alex Chen)
                </div>
                <p className="text-slate-600">
                  Open Alex Chen's profile to view 87% attrition risk, 79% burnout risk, and low satisfaction metrics.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center">3</span>
                  Explainable AI • SHAP
                </div>
                <p className="text-slate-600">
                  Show the "Why is this employee at risk?" section with ranked SHAP attribution bars (Overtime, stagnant promo, low satisfaction).
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center">4</span>
                  What-If ML Simulator
                </div>
                <p className="text-slate-600">
                  Adjust sliders (reduce overtime by 8h, 8% salary raise) to see live risk drop and $80k+ replacement cost savings!
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center">5</span>
                  Create Action Plan
                </div>
                <p className="text-slate-600">
                  Convert the simulation into a live tracked HR action plan in the Action Plans Kanban view.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center">6</span>
                  Role Switching
                </div>
                <p className="text-slate-600">
                  Switch roles between HR Admin, Engineering Manager, and Employee Self-Service in the top header.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">Ready for full FastAPI backend deployment</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            Got it, Let's Explore
          </button>
        </div>
      </div>
    </div>
  );
};
