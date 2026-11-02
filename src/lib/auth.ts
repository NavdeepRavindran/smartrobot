'use client';

export interface UserSession {
  username: string;
  role: string;
  loginTime: string;
  name: string;
}

const AUTH_STORAGE_KEY = 'smr_auth_session';

export const VALID_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
};

export function getStoredSession(): UserSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserSession;
  } catch {
    return null;
  }
}

export function saveSession(user: UserSession): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function isAuthenticated(): boolean {
  return getStoredSession() !== null;
}
