import React, { useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Employee,
  DepartmentStat,
  AIInsight,
  Recommendation,
  ActionPlan,
  FairnessMetric,
  ReportAuditItem,
  AppNotification,
  ActionStatus,
} from './types';
import { authService } from './services/authService';
import { employeeService } from './services/employeeService';
import { analyticsService } from './services/analyticsService';
import { recommendationService } from './services/recommendationService';
import { actionPlanService } from './services/actionPlanService';
import { reportService } from './services/reportService';
import { mockNotifications } from './data/mockData';

// Layout & Components
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CommandPalette } from './components/CommandPalette';
import { HelpModal } from './components/HelpModal';
import { CreateActionModal } from './components/CreateActionModal';

// Pages
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { EmployeeDirectoryPage } from './pages/EmployeeDirectoryPage';
import { EmployeeProfilePage } from './pages/EmployeeProfilePage';
import { AttritionRiskPage } from './pages/AttritionRiskPage';
import { WellbeingBurnoutPage } from './pages/WellbeingBurnoutPage';
import { AIInsightsPage } from './pages/AIInsightsPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { ActionPlansPage } from './pages/ActionPlansPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ReportsPage } from './pages/ReportsPage';
import { DataImportPage } from './pages/DataImportPage';
import { FairnessResponsibleAIPage } from './pages/FairnessResponsibleAIPage';
import { EmployeeSelfServicePage } from './pages/EmployeeSelfServicePage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  // Authentication & Session
  const [currentUser, setCurrentUser] = useState<User | null>(() => authService.getCurrentUser());
  const [activePage, setActivePage] = useState<string>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Core Data
  const [employees, setEmployees] = useState<Employee[]>(() => employeeService.getAllEmployees());
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [departmentStats, setDepartmentStats] = useState<DepartmentStat[]>(() => analyticsService.getDepartmentStats());
  const [aiInsights, setAiInsights] = useState<AIInsight[]>(() => analyticsService.getAIInsights());
  const [recommendations, setRecommendations] = useState<Recommendation[]>(() => recommendationService.getAllRecommendations());
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>(() => actionPlanService.getAllActionPlans());
  const [fairnessMetrics, setFairnessMetrics] = useState<FairnessMetric[]>(() => analyticsService.getFairnessMetrics());
  const [reports, setReports] = useState<ReportAuditItem[]>(() => reportService.getAllReports());
  const [notifications, setNotifications] = useState<AppNotification[]>(() => mockNotifications);

  // Modals
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isCreateActionOpen, setIsCreateActionOpen] = useState(false);
  const [actionModalTargetEmployee, setActionModalTargetEmployee] = useState<Employee | null>(null);
  const [actionModalDefaultTarget, setActionModalDefaultTarget] = useState<string>('');
  const [actionModalDefaultNotes, setActionModalDefaultNotes] = useState<string>('');
  const [actionModalDefaultType, setActionModalDefaultType] = useState<ActionPlan['actionType']>('Workload Adjustment');

  // Handle Login
  const handleLogin = (email: string, role: UserRole) => {
    const user = authService.login(email, role);
    setCurrentUser(user);
    if (role === 'employee') {
      setActivePage('employee-portal');
    } else {
      setActivePage('dashboard');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  // Handle Role Switching
  const handleRoleSwitch = (role: UserRole) => {
    const user = authService.switchRole(role);
    setCurrentUser(user);
    if (role === 'employee') {
      setActivePage('employee-portal');
    } else if (activePage === 'employee-portal') {
      setActivePage('dashboard');
    }
  };

  // Navigation handler
  const handleNavigate = (page: string) => {
    setActivePage(page);
    setMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select Employee for Profile Inspection
  const handleSelectEmployee = (emp: Employee) => {
    setSelectedEmployee(emp);
    setActivePage('employee-profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Action Plan Creation Modal Opener
  const handleOpenCreateAction = (
    emp?: Employee,
    defaultTarget?: string,
    defaultNotes?: string,
    defaultType?: ActionPlan['actionType']
  ) => {
    setActionModalTargetEmployee(emp || selectedEmployee || employees[0]);
    setActionModalDefaultTarget(defaultTarget || '');
    setActionModalDefaultNotes(defaultNotes || '');
    setActionModalDefaultType(defaultType || 'Workload Adjustment');
    setIsCreateActionOpen(true);
  };

  // Action Plan Submission
  const handleCreateActionSubmit = (newPlanData: Omit<ActionPlan, 'id' | 'createdAt'>) => {
    const created = actionPlanService.createActionPlan(newPlanData);
    setActionPlans(actionPlanService.getAllActionPlans());
  };

  // Update Action Status
  const handleUpdateActionStatus = (id: string, status: ActionStatus) => {
    actionPlanService.updateActionPlanStatus(id, status);
    setActionPlans(actionPlanService.getAllActionPlans());
  };

  // CSV Import Callback
  const handleImportComplete = (newEmployees: Employee[]) => {
    setEmployees(employeeService.getAllEmployees());
    setDepartmentStats(analyticsService.getDepartmentStats());
  };

  // Mark all notifications read
  const handleMarkNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Notification Click
  const handleSelectNotification = (notif: AppNotification) => {
    if (notif.linkToEmployeeId) {
      const emp = employees.find((e) => e.employeeId === notif.linkToEmployeeId);
      if (emp) {
        handleSelectEmployee(emp);
        return;
      }
    }
    if (notif.linkToPage) {
      handleNavigate(notif.linkToPage);
    }
  };

  // If not logged in, show Login page
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Determine Page Title for Header
  const getPageTitle = () => {
    switch (activePage) {
      case 'dashboard':
        return 'Executive Dashboard';
      case 'employees':
        return 'Employee Directory';
      case 'employee-profile':
        return selectedEmployee ? `${selectedEmployee.name} (${selectedEmployee.employeeId})` : 'Employee Profile';
      case 'attrition':
        return 'Attrition Risk Intelligence';
      case 'wellbeing':
        return 'Wellbeing & Burnout Analytics';
      case 'insights':
        return 'AI Workforce Insights';
      case 'recommendations':
        return 'Retention Recommendations';
      case 'action-plans':
        return 'Intervention Action Plans';
      case 'analytics':
        return 'Advanced Analytics';
      case 'reports':
        return 'Reports & Compliance Export';
      case 'data-import':
        return 'CSV Data Import & Batch Scoring';
      case 'fairness':
        return 'Fairness & Responsible AI';
      case 'employee-portal':
        return 'My Wellbeing Portal';
      case 'settings':
        return 'Settings & Configuration';
      default:
        return 'Dashboard';
    }
  };

  // Determine which employee to display in self service or profile
  const employeeForProfile = selectedEmployee || employees[0];
  const employeeForSelfService = employees.find((e) => e.employeeId === 'EMP-1024') || employees[0];

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex font-sans selection:bg-indigo-500 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onLogout={handleLogout}
      />

      {/* Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-slate-900/60 backdrop-blur-xs flex">
          <div className="w-64 bg-white h-full shadow-2xl">
            <Sidebar
              activePage={activePage}
              onNavigate={handleNavigate}
              currentUser={currentUser}
              collapsed={false}
              onToggleCollapse={() => setMobileSidebarOpen(false)}
              onOpenHelp={() => {
                setIsHelpOpen(true);
                setMobileSidebarOpen(false);
              }}
              onLogout={handleLogout}
            />
          </div>
          <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
        </div>
      )}

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        {/* Sticky App Header */}
        <Header
          currentUser={currentUser}
          onRoleSwitch={handleRoleSwitch}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenHelp={() => setIsHelpOpen(true)}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          notifications={notifications}
          onMarkNotificationsRead={handleMarkNotificationsRead}
          onSelectNotification={handleSelectNotification}
          pageTitle={getPageTitle()}
        />

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activePage === 'dashboard' && (
            <DashboardPage
              currentUser={currentUser}
              employees={employees}
              departmentStats={departmentStats}
              aiInsights={aiInsights}
              actionPlans={actionPlans}
              onSelectEmployee={handleSelectEmployee}
              onNavigate={handleNavigate}
              onOpenCreateAction={() => handleOpenCreateAction()}
            />
          )}

          {activePage === 'employees' && (
            <EmployeeDirectoryPage
              employees={employees}
              onSelectEmployee={handleSelectEmployee}
              onOpenImportModal={() => handleNavigate('data-import')}
              onOpenCreateAction={handleOpenCreateAction}
            />
          )}

          {activePage === 'employee-profile' && (
            <EmployeeProfilePage
              employee={employeeForProfile}
              recommendations={recommendations}
              actionPlans={actionPlans}
              onBack={() => handleNavigate('employees')}
              onOpenCreateAction={handleOpenCreateAction}
            />
          )}

          {activePage === 'attrition' && (
            <AttritionRiskPage
              employees={employees}
              departmentStats={departmentStats}
              onSelectEmployee={handleSelectEmployee}
              onOpenCreateAction={handleOpenCreateAction}
            />
          )}

          {activePage === 'wellbeing' && (
            <WellbeingBurnoutPage
              employees={employees}
              departmentStats={departmentStats}
              onSelectEmployee={handleSelectEmployee}
              onOpenCreateAction={handleOpenCreateAction}
            />
          )}

          {activePage === 'insights' && (
            <AIInsightsPage
              insights={aiInsights}
              onOpenCreateAction={() => handleOpenCreateAction()}
              onNavigate={handleNavigate}
            />
          )}

          {activePage === 'recommendations' && (
            <RecommendationsPage
              recommendations={recommendations}
              employees={employees}
              onOpenCreateAction={handleOpenCreateAction}
              onSelectEmployee={handleSelectEmployee}
            />
          )}

          {activePage === 'action-plans' && (
            <ActionPlansPage
              actionPlans={actionPlans}
              employees={employees}
              onUpdateStatus={handleUpdateActionStatus}
              onOpenCreateAction={handleOpenCreateAction}
              onSelectEmployee={handleSelectEmployee}
            />
          )}

          {activePage === 'analytics' && (
            <AnalyticsPage
              employees={employees}
              departmentStats={departmentStats}
            />
          )}

          {activePage === 'reports' && (
            <ReportsPage
              employees={employees}
              reports={reports}
            />
          )}

          {activePage === 'data-import' && (
            <DataImportPage
              onImportComplete={handleImportComplete}
              onNavigate={handleNavigate}
            />
          )}

          {activePage === 'fairness' && (
            <FairnessResponsibleAIPage
              fairnessMetrics={fairnessMetrics}
            />
          )}

          {activePage === 'employee-portal' && (
            <EmployeeSelfServicePage
              employee={employeeForSelfService}
              recommendations={recommendations}
            />
          )}

          {activePage === 'settings' && <SettingsPage />}
        </main>
      </div>

      {/* Global Modals & Dialogs */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        employees={employees}
        recommendations={recommendations}
        actionPlans={actionPlans}
        onSelectEmployee={handleSelectEmployee}
        onNavigatePage={handleNavigate}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      <CreateActionModal
        isOpen={isCreateActionOpen}
        onClose={() => setIsCreateActionOpen(false)}
        onSubmit={handleCreateActionSubmit}
        employees={employees}
        initialEmployee={actionModalTargetEmployee}
        defaultTargetOutcome={actionModalDefaultTarget}
        defaultNotes={actionModalDefaultNotes}
        defaultActionType={actionModalDefaultType}
      />
    </div>
  );
}
