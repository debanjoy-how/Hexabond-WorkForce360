import { Employee, CsvImportRecord, RiskLevel } from '../types';
import { initialEmployees } from '../data/mockData';
import { mockFetch } from './api';

const EMPLOYEES_STORAGE_KEY = 'ai_retention_employees_v1';

function getStoredEmployees(): Employee[] {
  const stored = localStorage.getItem(EMPLOYEES_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing stored employees', e);
    }
  }
  localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(initialEmployees));
  return initialEmployees;
}

function saveEmployees(employees: Employee[]) {
  localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(employees));
}

export const employeeService = {
  getAllEmployees(): Employee[] {
    return getStoredEmployees();
  },

  async getAll(): Promise<Employee[]> {
    const list = getStoredEmployees();
    const res = await mockFetch(list, 120);
    return res.data;
  },

  async getById(idOrEmpId: string): Promise<Employee | null> {
    const list = getStoredEmployees();
    const found = list.find(
      (e) => e.id.toLowerCase() === idOrEmpId.toLowerCase() || e.employeeId.toLowerCase() === idOrEmpId.toLowerCase()
    );
    const res = await mockFetch(found || null, 80);
    return res.data;
  },

  async update(id: string, updates: Partial<Employee>): Promise<Employee> {
    const list = getStoredEmployees();
    const index = list.findIndex((e) => e.id === id);
    if (index === -1) throw new Error('Employee not found');

    const updated = { ...list[index], ...updates };
    list[index] = updated;
    saveEmployees(list);

    const res = await mockFetch(updated, 150);
    return res.data;
  },

  async importEmployeesCSV(csvContent: string): Promise<Employee[]> {
    const lines = csvContent.trim().split('\n');
    if (lines.length < 2) return getStoredEmployees();

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const records: CsvImportRecord[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const cols = line.split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));
      const obj: Record<string, string> = {};
      headers.forEach((h, idx) => {
        obj[h] = cols[idx] || '';
      });

      const name = obj['name'] || obj['employee name'] || `Employee ${i}`;
      const department = obj['department'] || 'Engineering';
      const role = obj['role'] || obj['job title'] || 'Staff Member';
      const salary = parseFloat(obj['salary']) || 95000;
      const weeklyHours = parseFloat(obj['weeklyhours'] || obj['weekly_hours'] || obj['weekly hours']) || 45;
      const overtimeHours = parseFloat(obj['overtimehours'] || obj['overtime_hours'] || obj['overtime (hrs)'] || obj['overtime']) || 6;
      const jobSatisfaction = parseFloat(obj['jobsatisfaction'] || obj['satisfaction (0-100)'] || obj['satisfaction']) || 65;
      const engagementScore = parseFloat(obj['engagementscore'] || obj['engagement (0-100)'] || obj['engagement']) || 70;
      const workLifeBalance = parseFloat(obj['worklifebalance'] || obj['wlb (0-100)'] || obj['wlb']) || 65;
      const performanceRating = parseFloat(obj['performancerating'] || obj['performance rating'] || obj['performance']) || 4.0;
      const lastPromotionYearsAgo = parseFloat(obj['lastpromotionyearsago'] || obj['last promotion (yrs)'] || obj['last_promotion']) || 1.5;
      const absencesCount = parseFloat(obj['absencescount'] || obj['absences'] || obj['unplanned leaves']) || 2;
      const tenureYears = parseFloat(obj['tenureyears'] || obj['tenure (yrs)'] || obj['tenure']) || 2.5;

      records.push({
        employeeId: obj['employeeid'] || obj['employee id'] || `EMP-${2100 + i}`,
        name,
        email: obj['email'] || `${name.toLowerCase().replace(/\s+/g, '.')}@workforce-ai.io`,
        department,
        role,
        salary,
        weeklyHours,
        overtimeHours,
        tenureYears,
        jobSatisfaction,
        engagementScore,
        workLifeBalance,
        performanceRating,
        lastPromotionYearsAgo,
        absencesCount,
        isValid: true,
      });
    }

    const result = await this.importCsv(records);
    return result.employees;
  },

  async importCsv(records: CsvImportRecord[]): Promise<{ importedCount: number; employees: Employee[] }> {
    const list = getStoredEmployees();
    const newEmployees: Employee[] = records
      .filter((r) => r.isValid)
      .map((r, i) => {
        // Calculate basic ML score simulation for new imported records
        const overtimeFactor = Math.min(35, (r.overtimeHours / 20) * 35);
        const satisfactionFactor = Math.max(0, (100 - r.jobSatisfaction) * 0.35);
        const wlbFactor = Math.max(0, (100 - r.workLifeBalance) * 0.2);
        const promoFactor = r.lastPromotionYearsAgo > 2 ? 10 : 0;

        const attritionProb = Math.min(95, Math.max(5, Math.round(overtimeFactor + satisfactionFactor + wlbFactor + promoFactor)));
        const burnoutProb = Math.min(95, Math.max(5, Math.round((r.overtimeHours * 3.5) + (100 - r.workLifeBalance) * 0.4)));

        const getRiskLevel = (prob: number): RiskLevel => {
          if (prob >= 70) return 'High';
          if (prob >= 35) return 'Medium';
          return 'Low';
        };

        const emp: Employee = {
          id: `emp-imp-${Date.now()}-${i}`,
          employeeId: r.employeeId || `EMP-${2000 + i}`,
          name: r.name,
          email: r.email,
          avatar: `https://images.unsplash.com/photo-${1500000000000 + (i % 10) * 100000}?w=150&auto=format&fit=crop&q=80`,
          department: r.department as any,
          role: r.role,
          location: 'San Francisco, CA (Hybrid)',
          joinDate: new Date(Date.now() - r.tenureYears * 365 * 24 * 3600 * 1000).toISOString().split('T')[0],
          tenureYears: r.tenureYears,
          salary: r.salary,
          weeklyHours: r.weeklyHours,
          overtimeHours: r.overtimeHours,
          jobSatisfaction: r.jobSatisfaction,
          engagementScore: r.engagementScore,
          workLifeBalance: r.workLifeBalance,
          performanceRating: r.performanceRating,
          lastPromotionYearsAgo: r.lastPromotionYearsAgo,
          absencesCount: r.absencesCount,
          attritionProbability: attritionProb,
          burnoutProbability: burnoutProb,
          attritionRiskLevel: getRiskLevel(attritionProb),
          burnoutRiskLevel: getRiskLevel(burnoutProb),
          status: 'Active',
          manager: 'Department Lead',
          managerEmail: 'lead@workforce-ai.io',
          tags: ['Newly Imported', attritionProb > 70 ? 'High Risk' : 'Normal'],
          aiExplanation: `Imported employee evaluated with ${attritionProb}% attrition probability based on recorded overtime (${r.overtimeHours}h/wk) and satisfaction (${r.jobSatisfaction}/100).`,
          shapFactors: [
            {
              factor: 'Overtime Workload Contribution',
              impact: Math.round(overtimeFactor),
              direction: overtimeFactor > 15 ? 'increases_risk' : 'decreases_risk',
              category: 'Workload',
              description: `Recorded ${r.overtimeHours} hours of overtime.`,
              metricValue: `${r.overtimeHours} hrs/wk`,
              benchmarkValue: '4.0 hrs/wk',
            },
            {
              factor: 'Job Satisfaction Metric',
              impact: Math.round(satisfactionFactor),
              direction: satisfactionFactor > 15 ? 'increases_risk' : 'decreases_risk',
              category: 'Engagement',
              description: `Survey satisfaction score is ${r.jobSatisfaction}/100.`,
              metricValue: `${r.jobSatisfaction} / 100`,
              benchmarkValue: '75 / 100',
            },
          ],
          historicalScores: [
            { month: 'Dec', attritionRisk: Math.max(10, attritionProb - 8), burnoutRisk: Math.max(10, burnoutProb - 6), engagement: r.engagementScore, satisfaction: r.jobSatisfaction },
            { month: 'Jan', attritionRisk: Math.max(10, attritionProb - 4), burnoutRisk: Math.max(10, burnoutProb - 3), engagement: r.engagementScore, satisfaction: r.jobSatisfaction },
            { month: 'Feb', attritionRisk: attritionProb, burnoutRisk: burnoutProb, engagement: r.engagementScore, satisfaction: r.jobSatisfaction },
          ],
        };
        return emp;
      });

    const combined = [...list, ...newEmployees];
    saveEmployees(combined);
    const res = await mockFetch({ importedCount: newEmployees.length, employees: combined }, 400);
    return res.data;
  },

  resetDemoData(): void {
    localStorage.removeItem(EMPLOYEES_STORAGE_KEY);
  },
};
