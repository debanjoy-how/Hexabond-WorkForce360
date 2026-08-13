import { DepartmentStat, FairnessMetric, AIInsight } from '../types';
import { initialDepartmentStats, initialAIInsights, initialFairnessMetrics } from '../data/mockData';
import { mockFetch } from './api';

export const analyticsService = {
  getDepartmentStats(): DepartmentStat[] {
    return initialDepartmentStats;
  },

  async getDepartmentStatsAsync(): Promise<DepartmentStat[]> {
    const res = await mockFetch(initialDepartmentStats, 120);
    return res.data;
  },

  getAIInsights(): AIInsight[] {
    return initialAIInsights;
  },

  async getAIInsightsAsync(): Promise<AIInsight[]> {
    const res = await mockFetch(initialAIInsights, 100);
    return res.data;
  },

  getFairnessMetrics(): FairnessMetric[] {
    return initialFairnessMetrics;
  },

  async getFairnessMetricsAsync(): Promise<FairnessMetric[]> {
    const res = await mockFetch(initialFairnessMetrics, 100);
    return res.data;
  },
};
