import React, { useState, useMemo } from 'react';
import { Employee, RiskLevel } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import {
  Search,
  Filter,
  ArrowUpDown,
  UploadCloud,
  ChevronLeft,
  ChevronRight,
  User,
  ShieldAlert,
  Sparkles,
  ExternalLink,
  Target,
  SlidersHorizontal,
} from 'lucide-react';

interface EmployeeDirectoryPageProps {
  employees: Employee[];
  onSelectEmployee: (emp: Employee) => void;
  onOpenImportModal: () => void;
  onOpenCreateAction: (emp?: Employee) => void;
}

export const EmployeeDirectoryPage: React.FC<EmployeeDirectoryPageProps> = ({
  employees,
  onSelectEmployee,
  onOpenImportModal,
  onOpenCreateAction,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedRisk, setSelectedRisk] = useState<string>('All');
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'attrition_desc' | 'attrition_asc' | 'burnout_desc' | 'engagement_desc' | 'name_asc'>('attrition_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Extract unique departments & roles
  const departments = ['All', ...Array.from(new Set(employees.map((e) => e.department)))];
  const roles = ['All', ...Array.from(new Set(employees.map((e) => e.role)))];

  // Filtering & Sorting logic
  const filteredEmployees = useMemo(() => {
    return employees
      .filter((emp) => {
        const matchesSearch =
          emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.email.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
        const matchesRisk =
          selectedRisk === 'All' ||
          (selectedRisk === 'High' && emp.attritionRiskLevel === 'High') ||
          (selectedRisk === 'Medium' && emp.attritionRiskLevel === 'Medium') ||
          (selectedRisk === 'Low' && emp.attritionRiskLevel === 'Low');

        const matchesRole = selectedRole === 'All' || emp.role === selectedRole;

        return matchesSearch && matchesDept && matchesRisk && matchesRole;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'attrition_desc':
            return b.attritionProbability - a.attritionProbability;
          case 'attrition_asc':
            return a.attritionProbability - b.attritionProbability;
          case 'burnout_desc':
            return b.burnoutProbability - a.burnoutProbability;
          case 'engagement_desc':
            return b.engagementScore - a.engagementScore;
          case 'name_asc':
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
  }, [employees, searchQuery, selectedDept, selectedRisk, selectedRole, sortBy]);

  const totalPages = Math.ceil(filteredEmployees.length / pageSize) || 1;
  const paginatedEmployees = filteredEmployees.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div id="employee-directory-page" className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Employee Directory & Risk Roster
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor all {employees.length} personnel, filter by risk drivers, and inspect AI SHAP profiles.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenImportModal}
            className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Import CSV</span>
          </button>
          <button
            type="button"
            onClick={() => onOpenCreateAction()}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-colors flex items-center gap-1.5"
          >
            <Target className="w-4 h-4" />
            <span>Create Action Plan</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by name, ID (e.g. EMP-1024), email, role..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Department Filter */}
          <div className="lg:col-span-3">
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  Dept: {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Risk Level Filter */}
          <div className="lg:col-span-2">
            <select
              value={selectedRisk}
              onChange={(e) => {
                setSelectedRisk(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-bold"
            >
              <option value="All">All Risk Tiers</option>
              <option value="High">🔴 High Risk Only</option>
              <option value="Medium">🟡 Medium Risk</option>
              <option value="Low">🟢 Low Risk</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="lg:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="attrition_desc">Sort: Highest Attrition Risk</option>
              <option value="attrition_asc">Sort: Lowest Attrition Risk</option>
              <option value="burnout_desc">Sort: Highest Burnout Risk</option>
              <option value="engagement_desc">Sort: Highest Engagement</option>
              <option value="name_asc">Sort: Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Active Filters Pill Summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            Showing <strong>{filteredEmployees.length}</strong> matching employees
          </span>
          {(searchQuery || selectedDept !== 'All' || selectedRisk !== 'All') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedDept('All');
                setSelectedRisk('All');
                setSelectedRole('All');
              }}
              className="text-indigo-600 hover:text-indigo-800 font-bold text-xs"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Employee Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Employee ID</th>
                <th className="py-3.5 px-4">Employee Name</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4 text-center">Tenure</th>
                <th className="py-3.5 px-4 text-center">Engagement</th>
                <th className="py-3.5 px-4 text-center">Burnout Risk</th>
                <th className="py-3.5 px-4 text-center">Attrition Risk</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-400">
                    No employees matching the selected criteria.
                  </td>
                </tr>
              ) : (
                paginatedEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    id={`employee-row-${emp.employeeId.toLowerCase()}`}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => onSelectEmployee(emp)}
                  >
                    {/* Employee ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-500">
                      {emp.employeeId}
                    </td>

                    {/* Name & Avatar */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {emp.name}
                          </p>
                          <p className="text-[10px] text-slate-400">{emp.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {emp.department}
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4 text-slate-600 font-medium truncate max-w-[160px]">
                      {emp.role}
                    </td>

                    {/* Tenure */}
                    <td className="py-3.5 px-4 text-center font-mono text-slate-600">
                      {emp.tenureYears} yrs
                    </td>

                    {/* Engagement Score */}
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-indigo-600">
                      {emp.engagementScore}%
                    </td>

                    {/* Burnout Risk */}
                    <td className="py-3.5 px-4 text-center">
                      <RiskBadge level={emp.burnoutRiskLevel} score={emp.burnoutProbability} size="sm" />
                    </td>

                    {/* Attrition Risk */}
                    <td className="py-3.5 px-4 text-center">
                      <RiskBadge level={emp.attritionRiskLevel} score={emp.attritionProbability} size="sm" />
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {emp.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => onSelectEmployee(emp)}
                          className="px-2.5 py-1 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>AI Profile</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenCreateAction(emp)}
                          className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Quick Action"
                        >
                          <Target className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <span>
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({filteredEmployees.length} total)
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
