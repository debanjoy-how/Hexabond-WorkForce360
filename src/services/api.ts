/**
 * Base API Service Layer
 * Prepared for future FastAPI / Supabase backend integration.
 * Current implementation uses realistic asynchronous simulation with latency.
 */

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  timestamp: string;
}

const SIMULATED_LATENCY_MS = 150;

export async function mockFetch<T>(data: T, latencyMs = SIMULATED_LATENCY_MS): Promise<ApiResponse<T>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data,
        status: 200,
        message: 'Success',
        timestamp: new Date().toISOString(),
      });
    }, latencyMs);
  });
}

export const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000/api';

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    me: `${API_BASE_URL}/auth/me`,
    logout: `${API_BASE_URL}/auth/logout`,
  },
  employees: {
    list: `${API_BASE_URL}/employees`,
    detail: (id: string) => `${API_BASE_URL}/employees/${id}`,
    import: `${API_BASE_URL}/employees/import`,
    update: (id: string) => `${API_BASE_URL}/employees/${id}`,
  },
  predictions: {
    attrition: `${API_BASE_URL}/predict/attrition`,
    burnout: `${API_BASE_URL}/predict/burnout`,
    detail: (id: string) => `${API_BASE_URL}/predictions/${id}`,
    shapExplanation: (id: string) => `${API_BASE_URL}/explanations/${id}`,
    simulateScenario: `${API_BASE_URL}/predict/simulate`,
  },
  recommendations: {
    list: `${API_BASE_URL}/recommendations`,
    byEmployee: (id: string) => `${API_BASE_URL}/recommendations/${id}`,
    action: (id: string) => `${API_BASE_URL}/recommendations/${id}/action`,
  },
  actionPlans: {
    list: `${API_BASE_URL}/action-plans`,
    create: `${API_BASE_URL}/action-plans`,
    update: (id: string) => `${API_BASE_URL}/action-plans/${id}`,
  },
  analytics: {
    workforce: `${API_BASE_URL}/analytics/workforce`,
    departments: `${API_BASE_URL}/analytics/departments`,
    fairness: `${API_BASE_URL}/analytics/fairness`,
  },
  reports: {
    list: `${API_BASE_URL}/reports`,
    generate: `${API_BASE_URL}/reports/generate`,
  },
};
