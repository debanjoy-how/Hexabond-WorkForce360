import React from 'react';
import { FairnessMetric } from '../types';
import {
  Scale,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Eye,
  Info,
  HelpCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface FairnessResponsibleAIPageProps {
  fairnessMetrics: FairnessMetric[];
}

export const FairnessResponsibleAIPage: React.FC<FairnessResponsibleAIPageProps> = ({
  fairnessMetrics,
}) => {
  return (
    <div id="fairness-responsible-ai-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 shrink-0">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Fairness & Responsible AI Governance
              </h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Fairness Status: Compliant (94%)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Continuous auditing for demographic parity, equalized false-positive rates, and ethical AI safeguards.
            </p>
          </div>
        </div>
      </div>

      {/* Ethical Guardrails Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white space-y-3 shadow-md">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold tracking-wide">Human-in-the-Loop Decision Support Principle</h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          The AI models in this platform operate strictly as an advisory system for supportive interventions (such as workload rebalancing, career pathway discussions, and wellbeing check-ins). The algorithms are mathematically constrained to never trigger punitive actions, automatic terminations, or algorithmic pay deductions.
        </p>
      </div>

      {/* Fairness Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {fairnessMetrics.map((fm) => (
          <div
            key={fm.category}
            className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {fm.category} Attribute
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    fm.fairnessStatus === 'Good'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  Status: {fm.fairnessStatus}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900">{fm.category} Audit</h3>
              <p className="text-xs text-slate-600">{fm.mitigationNotes}</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Demographic Parity:</span>
                <span className="font-mono font-bold text-slate-900">{fm.demographicParityScore * 100}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Model Accuracy:</span>
                <span className="font-mono font-bold text-indigo-600">{fm.modelAccuracy}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">False Positive Rate:</span>
                <span className="font-mono font-bold text-slate-900">{fm.falsePositiveRate}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Responsible AI Compliance Checklist */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">Responsible AI Compliance Standard</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>TreeSHAP Mathematical Explainability</span>
            </div>
            <p className="text-slate-600">
              Every single prediction exposes transparent feature attributions so managers understand the exact root cause behind any elevated risk index.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Protected Attributes Exclusion</span>
            </div>
            <p className="text-slate-600">
              Sensitive demographic attributes (e.g. age, gender, race, disability) are strictly excluded from predictive model feature sets to prevent disparate impact.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Anonymized Wellbeing Pulse</span>
            </div>
            <p className="text-slate-600">
              Individual qualitative feedback surveys are aggregated at the department level to maintain complete psychological safety and confidentiality.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Action Audit & Versioning</span>
            </div>
            <p className="text-slate-600">
              All manager interventions and workload adjustments are timestamped and auditable to ensure fairness across all teams.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
