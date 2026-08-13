import React from 'react';
import { User, UserRole } from '../types';
import {
  LayoutDashboard,
  Users,
  TrendingDown,
  HeartPulse,
  Sparkles,
  Lightbulb,
  Target,
  BarChart3,
  FileText,
  UploadCloud,
  Scale,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  currentUser: User;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenHelp: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  currentUser,
  collapsed,
  onToggleCollapse,
  onOpenHelp,
  onLogout,
}) => {
  // Navigation items based on role
  const isEmployee = currentUser.role === 'employee';

  const navItems = isEmployee
    ? [
        { id: 'employee-portal', label: 'My Wellbeing Portal', icon: HeartPulse, badge: 'Live' },
        { id: 'recommendations', label: 'My Growth & Tips', icon: Lightbulb },
        { id: 'settings', label: 'Preferences & Privacy', icon: Settings },
      ]
    : [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'employees', label: 'Employees', icon: Users, badge: '1,248' },
        { id: 'attrition', label: 'Attrition Risk', icon: TrendingDown, alert: true },
        { id: 'wellbeing', label: 'Wellbeing & Burnout', icon: HeartPulse },
        { id: 'insights', label: 'AI Insights', icon: Sparkles, badge: 'New' },
        { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
        { id: 'action-plans', label: 'Action Plans', icon: Target, badge: '4 Active' },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'reports', label: 'Reports', icon: FileText },
        { id: 'data-import', label: 'Data Import', icon: UploadCloud },
        { id: 'fairness', label: 'Fairness & AI', icon: Scale },
        { id: 'settings', label: 'Settings', icon: Settings },
      ];

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'hr_admin':
        return { label: 'HR Admin View', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'manager':
        return { label: 'Manager View', bg: 'bg-violet-50 text-violet-700 border-violet-200' };
      case 'employee':
        return { label: 'Employee Self-Service', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    }
  };

  const roleInfo = getRoleBadge(currentUser.role);

  return (
    <aside
      id="main-app-sidebar"
      className={`fixed inset-y-0 left-0 z-30 flex flex-col bg-white border-r border-slate-200/90 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100 bg-white">
        {!collapsed ? (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xs font-black uppercase tracking-tight text-slate-900 truncate">
                Retention & Wellbeing
              </h1>
              <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">
                AI Workforce Intelligence
              </p>
            </div>
          </div>
        ) : (
          <div className="mx-auto w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
        )}

        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Role Indicator Banner */}
      {!collapsed && (
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
          <div className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border text-center uppercase tracking-wide truncate ${roleInfo.bg}`}>
            {roleInfo.label}
          </div>
        </div>
      )}

      {/* Main Navigation List */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              id={`nav-link-${item.id}`}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              } ${collapsed ? 'justify-center px-0' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'
                }`}
              />
              {!collapsed && (
                <span className="flex-1 text-left truncate">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                    isActive
                      ? 'bg-indigo-700 text-white'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
              {!collapsed && item.alert && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Profile & Actions */}
      <div className="p-3 border-t border-slate-100 space-y-1 bg-white">
        {/* Help / Demo Notes */}
        <button
          type="button"
          onClick={onOpenHelp}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors ${
            collapsed ? 'justify-center px-0' : ''
          }`}
          title="Architecture & Demo Guide"
        >
          <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0" />
          {!collapsed && <span className="truncate">Demo Guide & Architecture</span>}
        </button>

        {/* User Card */}
        <div
          className={`flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-200/70 ${
            collapsed ? 'justify-center p-1.5' : ''
          }`}
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover border border-white shadow-2xs shrink-0"
            referrerPolicy="no-referrer"
          />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{currentUser.title}</p>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors ${
            collapsed ? 'justify-center px-0' : ''
          }`}
          title="Logout"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="truncate">Logout</span>}
        </button>
      </div>
    </aside>
  );
};
