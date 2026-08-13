import { Recommendation } from '../types';
import { initialRecommendations } from '../data/mockData';
import { mockFetch } from './api';

const RECOMMENDATIONS_STORAGE_KEY = 'ai_retention_recommendations_v1';

function getStoredRecs(): Recommendation[] {
  const stored = localStorage.getItem(RECOMMENDATIONS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
  }
  localStorage.setItem(RECOMMENDATIONS_STORAGE_KEY, JSON.stringify(initialRecommendations));
  return initialRecommendations;
}

function saveRecs(list: Recommendation[]) {
  localStorage.setItem(RECOMMENDATIONS_STORAGE_KEY, JSON.stringify(list));
}

export const recommendationService = {
  getAllRecommendations(): Recommendation[] {
    return getStoredRecs();
  },

  async getAll(): Promise<Recommendation[]> {
    const list = getStoredRecs();
    const res = await mockFetch(list, 100);
    return res.data;
  },

  async getByEmployeeId(empId: string): Promise<Recommendation[]> {
    const list = getStoredRecs();
    const filtered = list.filter(
      (r) => r.employeeId.toLowerCase() === empId.toLowerCase()
    );
    const res = await mockFetch(filtered, 80);
    return res.data;
  },

  async updateStatus(id: string, status: 'Adopted' | 'Dismissed' | 'Suggested'): Promise<Recommendation> {
    const list = getStoredRecs();
    const idx = list.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error('Recommendation not found');
    list[idx].status = status;
    saveRecs(list);
    const res = await mockFetch(list[idx], 100);
    return res.data;
  },
};
