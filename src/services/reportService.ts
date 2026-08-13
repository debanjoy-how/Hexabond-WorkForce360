import { ReportItem, Employee } from '../types';
import { initialReports } from '../data/mockData';
import { mockFetch } from './api';

export const reportService = {
  getAllReports(): ReportItem[] {
    return initialReports;
  },

  async getAll(): Promise<ReportItem[]> {
    const res = await mockFetch(initialReports, 100);
    return res.data;
  },

  async generateReport(type: ReportItem['type']): Promise<ReportItem> {
    const newReport: ReportItem = {
      id: `rep-${Date.now()}`,
      title: `${type} — Generated Analysis`,
      type,
      frequency: 'Custom',
      lastGenerated: new Date().toISOString().split('T')[0],
      status: 'Ready',
      fileSize: '1.9 MB PDF',
      summary: `Automated AI workforce diagnostics report generated for ${type}.`,
    };
    const res = await mockFetch(newReport, 600);
    return res.data;
  },

  exportEmployeesCSV(employees: Employee[], filename = 'workforce-attrition-export.csv') {
    let csv = `Employee ID,Name,Department,Role,Salary,Tenure (Yrs),Weekly Hours,Overtime (Hrs),Satisfaction (0-100),Engagement (0-100),WLB (0-100),Attrition Prob (%),Burnout Prob (%),Risk Level\n`;
    employees.forEach((e) => {
      csv += `"${e.employeeId}","${e.name}","${e.department}","${e.role}",${e.salary},${e.tenureYears},${e.weeklyHours},${e.overtimeHours},${e.jobSatisfaction},${e.engagementScore},${e.workLifeBalance},${e.attritionProbability},${e.burnoutProbability},"${e.attritionRiskLevel}"\n`;
    });
    this.downloadCsv(filename, csv);
  },

  downloadCsv(filename = 'workforce-attrition-export.csv', content?: string) {
    const defaultCsv = `Employee ID,Name,Department,Role,Salary,Tenure (Yrs),Weekly Hours,Overtime (Hrs),Satisfaction (0-100),Engagement (0-100),WLB (0-100),Attrition Prob (%),Burnout Prob (%),Risk Level\n` +
      `EMP-1024,Alex Chen,Engineering,Senior Software Engineer,145000,3.4,54,14,38,42,41,87,79,High\n` +
      `EMP-1088,Elena Rostova,Sales,Enterprise Account Executive,130000,4.0,56,16,44,48,39,84,82,High\n` +
      `EMP-1072,Lucas Dupont,Engineering,DevOps Architect,162000,4.5,58,18,41,47,36,89,86,High\n` +
      `EMP-1033,Devon Wright,Engineering,Full Stack Developer,118000,2.5,52,12,49,53,48,76,71,High\n` +
      `EMP-1042,Priya Sharma,Customer Support,Lead Support Specialist,82000,3.1,51,11,45,50,46,73,78,High\n` +
      `EMP-1061,Sofia Martinez,Finance,Senior Financial Analyst,124000,4.7,42,2,85,88,84,14,16,Low\n` +
      `EMP-1080,Amara Okafor,HR,People Operations Specialist,88000,2.0,41,1,89,92,86,8,11,Low\n`;

    const blob = new Blob([content || defaultCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
