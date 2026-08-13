import React, { useState } from 'react';
import { Employee } from '../types';
import { employeeService } from '../services/employeeService';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Download,
  ArrowRight,
  RefreshCw,
  Eye,
  FileCheck,
  Zap,
} from 'lucide-react';

interface DataImportPageProps {
  onImportComplete: (newEmployees: Employee[]) => void;
  onNavigate: (page: string) => void;
}

export const DataImportPage: React.FC<DataImportPageProps> = ({
  onImportComplete,
  onNavigate,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [csvContent, setCsvContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [parsedRows, setParsedRows] = useState<Partial<Employee>[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importedCount, setImportedCount] = useState<number>(0);

  // Sample CSV template generator
  const handleDownloadSample = () => {
    const sample = `employee_id,name,email,department,role,salary,tenure_years,weekly_hours,overtime_hours,engagement_score,job_satisfaction,work_life_balance,performance_rating,last_promotion_years_ago
EMP-2001,Jordan Reed,jordan.reed@workforce-ai.io,Engineering,Full-Stack Engineer,135000,2.1,50,10,48,45,42,4.5,2.1
EMP-2002,Priya Sharma,priya.sharma@workforce-ai.io,Marketing,Growth Marketing Lead,118000,1.8,42,2,76,78,75,4.2,1.2
EMP-2003,Devon Vance,devon.vance@workforce-ai.io,Sales,Enterprise Account Exec,142000,3.0,52,12,52,50,46,4.6,3.0
EMP-2004,Samantha Lee,samantha.lee@workforce-ai.io,Customer Support,Support Lead,82000,2.5,45,6,68,65,62,4.0,1.5`;

    const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'workforce_sample_import_template.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvContent(text);
      validateAndParse(text);
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvContent(text);
      validateAndParse(text);
    };
    reader.readAsText(file);
  };

  // Quick Demo Preload
  const handleLoadDemoDataset = () => {
    const demo = `employee_id,name,email,department,role,salary,tenure_years,weekly_hours,overtime_hours,engagement_score,job_satisfaction,work_life_balance,performance_rating,last_promotion_years_ago
EMP-2001,Jordan Reed,jordan.reed@workforce-ai.io,Engineering,Full-Stack Engineer,135000,2.1,50,10,48,45,42,4.5,2.1
EMP-2002,Priya Sharma,priya.sharma@workforce-ai.io,Marketing,Growth Marketing Lead,118000,1.8,42,2,76,78,75,4.2,1.2
EMP-2003,Devon Vance,devon.vance@workforce-ai.io,Sales,Enterprise Account Exec,142000,3.0,52,12,52,50,46,4.6,3.0
EMP-2004,Samantha Lee,samantha.lee@workforce-ai.io,Customer Support,Support Lead,82000,2.5,45,6,68,65,62,4.0,1.5`;

    setFileName('workforce_q1_cohort.csv');
    setCsvContent(demo);
    validateAndParse(demo);
  };

  const validateAndParse = (csvText: string) => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      setValidationErrors(['File is empty or missing data rows.']);
      return;
    }

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const requiredHeaders = ['employee_id', 'name', 'department', 'role'];
    const missing = requiredHeaders.filter((req) => !headers.includes(req));

    if (missing.length > 0) {
      setValidationErrors([`Missing required headers: ${missing.join(', ')}`]);
      return;
    }

    const rows: Partial<Employee>[] = [];
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map((p) => p.trim());
      if (parts.length < headers.length) continue;

      const obj: any = {};
      headers.forEach((h, idx) => {
        obj[h] = parts[idx];
      });

      rows.push({
        id: `emp-import-${Date.now()}-${i}`,
        employeeId: obj.employee_id || `EMP-${2000 + i}`,
        name: obj.name,
        email: obj.email || `${obj.name.toLowerCase().replace(' ', '.')}@company.com`,
        department: obj.department || 'Engineering',
        role: obj.role || 'Staff Specialist',
        salary: Number(obj.salary) || 120000,
        tenureYears: Number(obj.tenure_years) || 2.0,
        weeklyHours: Number(obj.weekly_hours) || 45,
        overtimeHours: Number(obj.overtime_hours) || 5,
        engagementScore: Number(obj.engagement_score) || 65,
        jobSatisfaction: Number(obj.job_satisfaction) || 60,
        workLifeBalance: Number(obj.work_life_balance) || 58,
        performanceRating: Number(obj.performance_rating) || 4.0,
        lastPromotionYearsAgo: Number(obj.last_promotion_years_ago) || 1.5,
      });
    }

    setParsedRows(rows);
    setValidationErrors([]);
    setStep(2);
  };

  const handleRunAiBatchInference = async () => {
    setIsProcessing(true);
    setStep(3);

    try {
      const enriched = await employeeService.importEmployeesCSV(csvContent);
      setImportedCount(enriched.length);
      setIsProcessing(false);
      setStep(4);
      onImportComplete(enriched);
    } catch (err) {
      setIsProcessing(false);
      setValidationErrors(['Error running batch ML inference on dataset.']);
    }
  };

  return (
    <div id="data-import-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 shrink-0">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Workforce CSV Data Import & AI Scoring
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Ingest new employee rosters and run automated XGBoost flight risk & burnout classification.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDownloadSample}
          className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Sample CSV Template</span>
        </button>
      </div>

      {/* 4-Step Progress Ribbon */}
      <div className="grid grid-cols-4 gap-2 bg-white p-3 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className={`p-2 rounded-xl text-center text-xs font-bold ${step >= 1 ? 'bg-indigo-50 text-indigo-700' : 'text-slate-400'}`}>
          1. Upload CSV
        </div>
        <div className={`p-2 rounded-xl text-center text-xs font-bold ${step >= 2 ? 'bg-indigo-50 text-indigo-700' : 'text-slate-400'}`}>
          2. Validate & Preview
        </div>
        <div className={`p-2 rounded-xl text-center text-xs font-bold ${step >= 3 ? 'bg-indigo-50 text-indigo-700' : 'text-slate-400'}`}>
          3. AI Batch Scoring
        </div>
        <div className={`p-2 rounded-xl text-center text-xs font-bold ${step === 4 ? 'bg-emerald-50 text-emerald-700' : 'text-slate-400'}`}>
          4. Complete
        </div>
      </div>

      {/* Step 1: Upload Box */}
      {step === 1 && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-6">
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-10 text-center space-y-4 bg-slate-50/50 transition-colors cursor-pointer"
          >
            <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <UploadCloud className="w-7 h-7" />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-800">
                Drag and drop your employee CSV file here
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Supports .csv files with standard HR headers (employee_id, name, department, role, salary, etc.)
              </p>
            </div>

            <label className="inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-colors">
              Browse File on Computer
              <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {/* Quick Demo Preload Button */}
          <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-indigo-950">Don't have a CSV file ready?</p>
              <p className="text-[11px] text-indigo-700">Preload our sample cohort (4 employee records) to test the ML scoring pipeline.</p>
            </div>
            <button
              type="button"
              onClick={handleLoadDemoDataset}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors shrink-0 flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Preload Sample Cohort</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Validate & Preview Data */}
      {step === 2 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <FileCheck className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Validated: {fileName}</h3>
                <p className="text-xs text-slate-500">{parsedRows.length} valid rows ready for AI batch inference</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-700"
            >
              Choose different file
            </button>
          </div>

          {/* Data Preview Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">ID</th>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3 text-right">Salary</th>
                  <th className="py-2.5 px-3 text-center">Overtime</th>
                  <th className="py-2.5 px-3 text-center">Engagement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {parsedRows.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-600">{r.employeeId}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{r.name}</td>
                    <td className="py-2.5 px-3 text-slate-700">{r.department}</td>
                    <td className="py-2.5 px-3 text-slate-600">{r.role}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-700">${r.salary?.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-center font-mono text-rose-600 font-bold">+{r.overtimeHours}h</td>
                    <td className="py-2.5 px-3 text-center font-mono text-indigo-600 font-bold">{r.engagementScore}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleRunAiBatchInference}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Run AI Batch Scoring on {parsedRows.length} Records</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 3: AI Inference Processing Animation */}
      {step === 3 && (
        <div className="bg-white p-12 rounded-2xl border border-slate-200/90 shadow-xs text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center animate-spin">
            <RefreshCw className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Executing XGBoost & TreeSHAP Inference</h3>
            <p className="text-xs text-slate-500 mt-1">
              Calculating flight risk probability, burnout risk score, and feature attribution waterfalls...
            </p>
          </div>
        </div>
      )}

      {/* Step 4: Import Complete */}
      {step === 4 && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200/90 shadow-xs text-center space-y-5">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900">Import & AI Scoring Successful!</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Successfully scored and added <strong>{importedCount} employee records</strong> into the workforce intelligence database.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setParsedRows([]);
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Import Another File
            </button>
            <button
              type="button"
              onClick={() => onNavigate('employees')}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
            >
              <span>View in Employee Directory</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
