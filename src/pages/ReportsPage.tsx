import React, { useState } from 'react';
import { Employee, ReportAuditItem } from '../types';
import { reportService } from '../services/reportService';
import {
  FileText,
  Download,
  Printer,
  Sparkles,
  FileSpreadsheet,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface ReportsPageProps {
  employees: Employee[];
  reports: ReportAuditItem[];
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ employees, reports }) => {
  const [generating, setGenerating] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<string>('executive');
  const [notification, setNotification] = useState<string | null>(null);

  const handleExportCSV = () => {
    reportService.exportEmployeesCSV(employees);
    setNotification('Exported employee intelligence CSV successfully.');
    setTimeout(() => setNotification(null), 3500);
  };

  const handleGenerateReport = (type: string) => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setNotification(`Generated ${type.toUpperCase()} report successfully.`);
      setTimeout(() => setNotification(null), 3500);
    }, 800);
  };

  return (
    <div id="reports-export-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Reports & Executive Export
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Generate compliance-ready retention audits, burnout summaries, and export datasets.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export Full CSV Dataset</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Available Executive Report Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Executive Board Summary */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              Quarterly
            </span>
            <h3 className="text-sm font-bold text-slate-900">Executive Board Summary</h3>
            <p className="text-xs text-slate-600">
              High-level turnover risk, estimated replacement cost exposures ($5.67M), and proactive ROI.
            </p>
          </div>
          <button
            type="button"
            disabled={generating}
            onClick={() => handleGenerateReport('Executive Board Summary')}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Generate Briefing</span>
          </button>
        </div>

        {/* 2. Workforce Burnout Audit */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
              Monthly
            </span>
            <h3 className="text-sm font-bold text-slate-900">Wellbeing & Overtime Audit</h3>
            <p className="text-xs text-slate-600">
              Detailed list of employees logging &gt;8h overtime, fatigue indicators, and workload distributions.
            </p>
          </div>
          <button
            type="button"
            disabled={generating}
            onClick={() => handleGenerateReport('Wellbeing & Overtime Audit')}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Generate Audit</span>
          </button>
        </div>

        {/* 3. Department Risk Scorecard */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
              Weekly
            </span>
            <h3 className="text-sm font-bold text-slate-900">Department Flight Risk Scorecard</h3>
            <p className="text-xs text-slate-600">
              Breakdown of attrition rates across Engineering, Sales, Marketing, and Operations.
            </p>
          </div>
          <button
            type="button"
            disabled={generating}
            onClick={() => handleGenerateReport('Department Scorecard')}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Generate Scorecard</span>
          </button>
        </div>

        {/* 4. Responsible AI & Fairness Audit */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              Compliance
            </span>
            <h3 className="text-sm font-bold text-slate-900">Fairness & Bias Verification</h3>
            <p className="text-xs text-slate-600">
              Demographic parity metrics and equalized odds testing across gender, age, and departments.
            </p>
          </div>
          <button
            type="button"
            disabled={generating}
            onClick={() => handleGenerateReport('Fairness Audit')}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Generate Audit</span>
          </button>
        </div>
      </div>

      {/* Generated Report Archive */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">Historical Generated Reports Archive</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Report Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Generated Date</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">Format</th>
                <th className="py-3 px-4 text-right">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.map((rep) => (
                <tr key={rep.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>{rep.title}</span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">{rep.category}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{rep.generatedDate}</td>
                  <td className="py-3.5 px-4 text-slate-600">{rep.author}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                      {rep.format}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={handleExportCSV}
                      className="px-3 py-1 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors inline-flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </button>
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
