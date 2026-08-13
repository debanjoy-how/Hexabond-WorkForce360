import { ActionPlan, ActionStatus } from '../types';
import { initialActionPlans } from '../data/mockData';
import { mockFetch } from './api';

const ACTION_PLANS_STORAGE_KEY = 'ai_retention_action_plans_v1';

function getStoredActions(): ActionPlan[] {
  const stored = localStorage.getItem(ACTION_PLANS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
  }
  localStorage.setItem(ACTION_PLANS_STORAGE_KEY, JSON.stringify(initialActionPlans));
  return initialActionPlans;
}

function saveActions(list: ActionPlan[]) {
  localStorage.setItem(ACTION_PLANS_STORAGE_KEY, JSON.stringify(list));
}

export const actionPlanService = {
  getAllActionPlans(): ActionPlan[] {
    return getStoredActions();
  },

  async getAll(): Promise<ActionPlan[]> {
    const list = getStoredActions();
    const res = await mockFetch(list, 100);
    return res.data;
  },

  async getByEmployeeId(empId: string): Promise<ActionPlan[]> {
    const list = getStoredActions();
    const filtered = list.filter((a) => a.employeeId.toLowerCase() === empId.toLowerCase());
    const res = await mockFetch(filtered, 80);
    return res.data;
  },

  createActionPlan(plan: Omit<ActionPlan, 'id' | 'createdAt'>): ActionPlan {
    const list = getStoredActions();
    const newPlan: ActionPlan = {
      ...plan,
      id: `act-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    list.unshift(newPlan);
    saveActions(list);
    return newPlan;
  },

  async create(plan: Omit<ActionPlan, 'id' | 'createdAt'>): Promise<ActionPlan> {
    const created = this.createActionPlan(plan);
    const res = await mockFetch(created, 150);
    return res.data;
  },

  updateActionPlanStatus(id: string, status: ActionStatus, outcomeMetric?: string): ActionPlan {
    const list = getStoredActions();
    const idx = list.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error('Action plan not found');
    list[idx].status = status;
    if (status === 'Completed') {
      list[idx].completedAt = new Date().toISOString().split('T')[0];
      if (outcomeMetric) {
        list[idx].outcomeMetric = outcomeMetric;
      }
    }
    saveActions(list);
    return list[idx];
  },

  async updateStatus(id: string, status: ActionStatus, outcomeMetric?: string): Promise<ActionPlan> {
    const updated = this.updateActionPlanStatus(id, status, outcomeMetric);
    const res = await mockFetch(updated, 120);
    return res.data;
  },

  async updateNotes(id: string, notes: string): Promise<ActionPlan> {
    const list = getStoredActions();
    const idx = list.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error('Action plan not found');
    list[idx].notes = notes;
    saveActions(list);
    const res = await mockFetch(list[idx], 100);
    return res.data;
  },

  async delete(id: string): Promise<boolean> {
    const list = getStoredActions();
    const filtered = list.filter((a) => a.id !== id);
    saveActions(filtered);
    const res = await mockFetch(true, 100);
    return res.data;
  },
};
