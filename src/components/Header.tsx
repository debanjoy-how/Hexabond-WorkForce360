import React, { useState } from 'react';
import { User, UserRole, AppNotification } from '../types';
import {
  Menu,
  Search,
  Bell,
  Sparkles,
  HelpCircle,
  ChevronDown,
  UserCheck,
  Building,
  ShieldCheck,
} from 'lucide-react';
import { NotificationDropdown } from './NotificationDropdown';

interface HeaderProps {
  currentUser: User;
  onRoleSwitch: (role: UserRole) => void;
  onOpenCommandPalette: () => void;
  onOpenHelp: () => void;
  onToggleMobileSidebar: () => void;
  notifications: AppNotification[];
  onMarkNotificationsRead: () => void;
  onSelectNotification: (notif: AppNotification) => void;
  pageTitle: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onRoleSwitch,
  onOpenCommandPalette,
  onOpenHelp,
  onToggleMobileSidebar,
  notifications,
  onMarkNotificationsRead,
  onSelectNotification,
  pageTitle,
}) => {
  const [showNotifs, setShowNotifs] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header
      id="main-app-header"
      className="sticky top-0 z-20 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between"
    >
      {/* Left: Mobile Menu & Page Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-400">Enterprise AI</span>
            <span>/</span>
            <span className="font-bold text-slate-900">{pageTitle}</span>
          </div>
        </div>
      </div>

      {/* Center: Global Search Bar Trigger */}
      <button
        type="button"
        id="global-search-trigger-btn"
        onClick={onOpenCommandPalette}
        className="flex items-center justify-between gap-3 px-3.5 py-1.5 w-48 sm:w-80 bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200 text-slate-500 rounded-xl text-xs transition-all"
      >
        <div className="flex items-center gap-2 truncate">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="truncate">Search employees, SHAP, actions...</span>
        </div>
        <kbd className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-500 bg-white rounded border border-slate-300 shadow-2xs">
          ⌘K
        </kbd>
      </button>

      {/* Right: Role Switcher, Help, Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Role Switcher Pill */}
        <div className="relative">
          <button
            type="button"
            id="role-switcher-button"
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100 text-indigo-900 text-xs font-bold transition-all shadow-2xs"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            <span className="hidden md:inline">Demo Role:</span>
            <span className="capitalize">
              {currentUser.role === 'hr_admin'
                ? 'HR Admin'
                : currentUser.role === 'manager'
                ? 'Dept Manager'
                : 'Employee'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-indigo-700" />
          </button>

          {showRoleMenu && (
            <div
              className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Switch Persona (Demo Mode)
                </p>
                <p className="text-[10px] text-slate-500">
                  Test role-based access control and dashboards
                </p>
              </div>

              <div className="mt-1 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    onRoleSwitch('hr_admin');
                    setShowRoleMenu(false);
                  }}
                  className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left text-xs transition-colors ${
                    currentUser.role === 'hr_admin'
                      ? 'bg-indigo-50 text-indigo-900 font-bold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">HR Admin (Sarah Jenkins)</p>
                    <p className="text-[10px] text-slate-500 font-normal">Full organization-wide access & reports</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onRoleSwitch('manager');
                    setShowRoleMenu(false);
                  }}
                  className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left text-xs transition-colors ${
                    currentUser.role === 'manager'
                      ? 'bg-violet-50 text-violet-900 font-bold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Building className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Dept Manager (Marcus Vance)</p>
                    <p className="text-[10px] text-slate-500 font-normal">Engineering team analytics & action plans</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onRoleSwitch('employee');
                    setShowRoleMenu(false);
                  }}
                  className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left text-xs transition-colors ${
                    currentUser.role === 'employee'
                      ? 'bg-emerald-50 text-emerald-900 font-bold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Employee (Alex Chen • EMP-1024)</p>
                    <p className="text-[10px] text-slate-500 font-normal">Self-service wellbeing & personal growth</p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tour / Guide button */}
        <button
          type="button"
          onClick={onOpenHelp}
          className="hidden sm:flex p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
          title="Architecture & Demo Flow"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            type="button"
            id="notifications-bell-btn"
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          <NotificationDropdown
            isOpen={showNotifs}
            onClose={() => setShowNotifs(false)}
            notifications={notifications}
            onMarkAllRead={onMarkNotificationsRead}
            onNotificationClick={(n) => {
              onSelectNotification(n);
              setShowNotifs(false);
            }}
          />
        </div>
      </div>
    </header>
  );
};
