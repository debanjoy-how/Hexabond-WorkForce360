import React from 'react';
import { AppNotification } from '../types';
import { Bell, Check, ShieldAlert, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  onNotificationClick: (notif: AppNotification) => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onNotificationClick,
}) => {
  if (!isOpen) return null;

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'critical':
        return <ShieldAlert className="w-4 h-4 text-rose-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const getBg = (type: AppNotification['type']) => {
    switch (type) {
      case 'critical':
        return 'bg-rose-50 border-rose-100';
      case 'warning':
        return 'bg-amber-50 border-amber-100';
      case 'success':
        return 'bg-emerald-50 border-emerald-100';
      default:
        return 'bg-blue-50 border-blue-100';
    }
  };

  return (
    <div
      id="notification-dropdown-menu"
      className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150"
    >
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-600" />
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Workforce Intelligence Alerts
          </h4>
        </div>
        <button
          type="button"
          onClick={onMarkAllRead}
          className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          Mark all read
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">
            No notifications at this time
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => onNotificationClick(n)}
              className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-3 ${
                !n.read ? 'bg-indigo-50/20' : ''
              }`}
            >
              <div className={`p-2 rounded-xl border shrink-0 ${getBg(n.type)}`}>
                {getIcon(n.type)}
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{n.title}</span>
                  <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                </div>
                <p className="text-xs text-slate-600 leading-snug">{n.message}</p>
              </div>
              {!n.read && (
                <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-1" />
              )}
            </div>
          ))
        )}
      </div>

      <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
        <span className="text-[11px] text-slate-500">
          Proactive AI risk triggers configured for weekly refresh.
        </span>
      </div>
    </div>
  );
};
