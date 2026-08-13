import { User, UserRole } from '../types';
import { currentUserMock, managerUserMock, employeeUserMock } from '../data/mockData';
import { mockFetch } from './api';

const AUTH_STORAGE_KEY = 'ai_retention_current_user';

export const authService = {
  getCurrentUser(): User {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        // fallback
      }
    }
    return currentUserMock;
  },

  async login(email: string, role: UserRole = 'hr_admin'): Promise<User> {
    let userToSet: User;
    if (role === 'manager') {
      userToSet = { ...managerUserMock, email: email || managerUserMock.email };
    } else if (role === 'employee') {
      userToSet = { ...employeeUserMock, email: email || employeeUserMock.email };
    } else {
      userToSet = { ...currentUserMock, email: email || currentUserMock.email };
    }

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userToSet));
    const res = await mockFetch(userToSet, 300);
    return res.data;
  },

  switchRole(role: UserRole): User {
    let userToSet: User;
    if (role === 'manager') {
      userToSet = managerUserMock;
    } else if (role === 'employee') {
      userToSet = employeeUserMock;
    } else {
      userToSet = currentUserMock;
    }
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userToSet));
    return userToSet;
  },

  async logout(): Promise<void> {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    await mockFetch(true, 100);
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem(AUTH_STORAGE_KEY);
  },
};
