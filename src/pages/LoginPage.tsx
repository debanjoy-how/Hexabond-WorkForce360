import React, { useState } from 'react';
import { UserRole } from '../types';
import { Sparkles, ShieldCheck, Building, UserCheck, ArrowRight, Lock, Mail } from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string, role: UserRole) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('sarah.jenkins@workforce-ai.io');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, 'hr_admin');
  };

  const handleDemoLogin = (role: UserRole) => {
    if (role === 'hr_admin') {
      onLogin('sarah.jenkins@workforce-ai.io', 'hr_admin');
    } else if (role === 'manager') {
      onLogin('marcus.vance@workforce-ai.io', 'manager');
    } else {
      onLogin('alex.chen@workforce-ai.io', 'employee');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-2xl p-8 sm:p-10 space-y-7 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            AI-Driven Retention & Wellbeing
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            AI-powered workforce intelligence for proactive employee retention and wellbeing.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Work Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-[11px] font-semibold text-indigo-600 hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900"
              />
            </div>
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
              />
              <span>Remember this browser for 30 days</span>
            </label>
          </div>

          <button
            type="submit"
            id="login-submit-btn"
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Sign In to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Fast Demo Persona Logins */}
        <div className="pt-4 border-t border-slate-100 space-y-2.5">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
            Instant Demo Logins
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              id="demo-login-hr-admin"
              onClick={() => handleDemoLogin('hr_admin')}
              className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 text-center transition-all"
            >
              <ShieldCheck className="w-4 h-4 mx-auto text-indigo-600 mb-0.5" />
              <span className="block text-[10px] font-bold">HR Admin</span>
            </button>

            <button
              type="button"
              id="demo-login-manager"
              onClick={() => handleDemoLogin('manager')}
              className="p-2 rounded-xl bg-violet-50 hover:bg-violet-100 border border-violet-200 text-violet-900 text-center transition-all"
            >
              <Building className="w-4 h-4 mx-auto text-violet-600 mb-0.5" />
              <span className="block text-[10px] font-bold">Manager</span>
            </button>

            <button
              type="button"
              id="demo-login-employee"
              onClick={() => handleDemoLogin('employee')}
              className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-center transition-all"
            >
              <UserCheck className="w-4 h-4 mx-auto text-emerald-600 mb-0.5" />
              <span className="block text-[10px] font-bold">Employee</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
