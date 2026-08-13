import React, { useState } from 'react';
import {
  Settings,
  Sliders,
  Bell,
  Database,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Cpu,
  RefreshCw,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [attritionThreshold, setAttritionThreshold] = useState(70);
  const [burnoutThreshold, setBurnoutThreshold] = useState(65);
  const [overtimeThreshold, setOvertimeThreshold] = useState(8);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div id="settings-page" className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 shrink-0">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Platform & AI Intelligence Settings
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Configure machine learning thresholds, alert sensitivity, and HRIS data integrations.
            </p>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Settings saved successfully. Model thresholds updated.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* ML Risk Thresholds */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sliders className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">AI Risk Classification Sensitivity</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-bold text-slate-800 mb-1">
                <span>High Attrition Risk Trigger Threshold:</span>
                <span className="font-mono text-indigo-700">{attritionThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="90"
                value={attritionThreshold}
                onChange={(e) => setAttritionThreshold(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Employees exceeding {attritionThreshold}% probability are flagged with high priority action cards.
              </p>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-800 mb-1">
                <span>Burnout Risk Warning Threshold:</span>
                <span className="font-mono text-amber-700">{burnoutThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="85"
                value={burnoutThreshold}
                onChange={(e) => setBurnoutThreshold(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Trigger fatigue alert when predicted burnout probability exceeds {burnoutThreshold}%.
              </p>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-800 mb-1">
                <span>Weekly Overtime Alert Limit:</span>
                <span className="font-mono text-rose-700">{overtimeThreshold} hrs/wk</span>
              </div>
              <input
                type="range"
                min="4"
                max="20"
                value={overtimeThreshold}
                onChange={(e) => setOvertimeThreshold(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
              />
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Bell className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Workforce Intelligence Alerts</h3>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 block">Critical Flight Risk Alerts</span>
                <span className="text-[11px] text-slate-500">
                  Receive instant notifications when key performers cross into high flight risk.
                </span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 accent-indigo-600"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 block">Weekly Executive Digest</span>
                <span className="text-[11px] text-slate-500">
                  Automated weekly summary of department wellbeing scores and retention action status.
                </span>
              </div>
              <input
                type="checkbox"
                checked={weeklyDigest}
                onChange={(e) => setWeeklyDigest(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 accent-indigo-600"
              />
            </label>
          </div>
        </div>

        {/* Connected HR Data Integrations */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Database className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Connected HRIS & Telemetry Sources</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Workday HRIS</span>
                <span className="text-[10px] text-emerald-600 font-bold">● Connected & Synced</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">REST API</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">BambooHR</span>
                <span className="text-[10px] text-emerald-600 font-bold">● Connected</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Webhook</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Jira / GitLab Telemetry</span>
                <span className="text-[10px] text-emerald-600 font-bold">● Overtime Active</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">OAuth 2.0</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Slack Pulse Bot</span>
                <span className="text-[10px] text-emerald-600 font-bold">● Weekly Pulse Active</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Bot Token</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};
