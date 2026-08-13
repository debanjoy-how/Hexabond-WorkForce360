export type UserRole = 'hr_admin' | 'manager' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  title: string;
  avatar: string;
}

export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface ShapFactor {
  factor: string;
  impact: number; // percentage contribution (e.g. 24 for +24%)
  direction: 'increases_risk' | 'decreases_risk';
  category: 'Workload' | 'Compensation' | 'Career' | 'Culture' | 'Engagement' | 'Environment';
  description: string;
  metricValue: string;
  benchmarkValue: string;
}

export interface HistoricalRiskPoint {
  month: string;
  attritionRisk: number;
  burnoutRisk: number;
  engagement: number;
  satisfaction: number;
}

export interface Employee {
  id: string;
  employeeId: string; // e.g. "EMP-1024"
  name: string;
  email: string;
  avatar: string;
  department: 'Engineering' | 'Sales' | 'Marketing' | 'Finance' | 'HR' | 'Operations' | 'Customer Support';
  role: string;
  location: string;
  joinDate: string;
  tenureYears: number;
  salary: number;
  weeklyHours: number;
  overtimeHours: number;
  jobSatisfaction: number; // 0-100
  engagementScore: number; // 0-100
  workLifeBalance: number; // 0-100
  performanceRating: number; // 1-5 scale (e.g. 4.2)
  lastPromotionYearsAgo: number;
  absencesCount: number;
  attritionProbability: number; // 0-100
  burnoutProbability: number; // 0-100
  attritionRiskLevel: RiskLevel;
  burnoutRiskLevel: RiskLevel;
  status: 'Active' | 'On Leave' | 'Notice Period' | 'Review Required';
  manager: string;
  managerEmail: string;
  shapFactors: ShapFactor[];
  aiExplanation: string;
  historicalScores: HistoricalRiskPoint[];
  tags: string[];
}

export type PriorityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export interface Recommendation {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  role: string;
  priority: PriorityLevel;
  category: 'Workload Adjustment' | 'Career Growth' | 'Flexible Working' | 'Manager 1:1' | 'Compensation Review' | 'Recognition' | 'Mentorship' | 'Training';
  title: string;
  reason: string;
  recommendedAction: string;
  expectedImpact: string; // e.g., "-28% Attrition Risk, +15% Wellbeing"
  costEffort: 'Low' | 'Medium' | 'High';
  status: 'Suggested' | 'Adopted' | 'Dismissed';
  createdAt: string;
}

export type ActionStatus = 'Pending' | 'In Progress' | 'Completed';

export interface ActionPlan {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  actionTitle: string;
  actionType: 'Workload Adjustment' | 'Career Discussion' | 'Training & Upskilling' | 'Mentorship' | 'Recognition & Rewards' | 'Flexible Working' | 'Manager Meeting' | 'Compensation Review';
  assignedTo: string;
  assignedRole: string;
  priority: PriorityLevel;
  dueDate: string;
  status: ActionStatus;
  notes: string;
  targetOutcome: string;
  outcomeMetric?: string;
  createdAt: string;
  completedAt?: string;
}

export interface DepartmentStat {
  department: string;
  employeeCount: number;
  attritionRiskRate: number; // % high or avg
  burnoutRiskRate: number;
  avgEngagement: number;
  avgSatisfaction: number;
  avgWorkLifeBalance: number;
  avgOvertimeHours: number;
  highRiskCount: number;
  actionPlansActive: number;
}

export type InsightSeverity = 'Critical' | 'Warning' | 'Info' | 'Positive' | 'Opportunity';

export interface AIInsight {
  id: string;
  code: string; // e.g. "INS-01"
  title: string;
  description: string;
  department: string;
  severity: InsightSeverity;
  metricHighlight: string;
  supportingMetric: string;
  recommendedAction: string;
  date: string;
  category: 'Retention' | 'Burnout' | 'Overtime' | 'Engagement' | 'Career';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'critical' | 'warning' | 'success' | 'info';
  timestamp: string;
  read: boolean;
  targetEmployeeId?: string;
  linkToEmployeeId?: string;
  linkToPage?: string;
  actionUrl?: string;
}

export interface FairnessMetric {
  id: string;
  category: string;
  demographicGroup: string;
  subGroup: string;
  sampleCount: number;
  accuracyRate: number; // e.g. 91.4%
  falsePositiveRate: number; // e.g. 4.2%
  falseNegativeRate: number; // e.g. 3.8%
  fairnessStatus: 'Balanced' | 'Within Margin' | 'Review Required';
  parityIndex: number; // 0.98
}

export interface ReportItem {
  id: string;
  title: string;
  type: 'Workforce Overview' | 'Attrition Risk Audit' | 'Burnout & Wellbeing' | 'Department Comparison' | 'Retention ROI & Actions';
  frequency: 'Weekly' | 'Monthly' | 'Quarterly' | 'Custom';
  lastGenerated: string;
  status: 'Ready' | 'Generating';
  fileSize: string;
  summary: string;
}

export type ReportAuditItem = ReportItem;

export interface CsvImportRecord {
  employeeId: string;
  name: string;
  email: string;
  department: string;
  role: string;
  salary: number;
  weeklyHours: number;
  overtimeHours: number;
  tenureYears: number;
  jobSatisfaction: number;
  engagementScore: number;
  workLifeBalance: number;
  performanceRating: number;
  lastPromotionYearsAgo: number;
  absencesCount: number;
  isValid: boolean;
  validationErrors?: string[];
}
