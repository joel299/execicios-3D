/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WorkoutSessionLog } from '../types/workout';

const STORAGE_KEY_SESSIONS = 'fisiolocal_workout_sessions_v1';
const STORAGE_KEY_PREFS = 'fisiolocal_user_preferences_v1';

export interface UserPreferences {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  playbackSpeed: number; // 0.5, 1.0, 1.5
  autoAdvance: boolean;
}

const DEFAULT_PREFS: UserPreferences = {
  soundEnabled: true,
  vibrationEnabled: true,
  playbackSpeed: 1.0,
  autoAdvance: true,
};

export const storageService = {
  getSessions(): WorkoutSessionLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SESSIONS);
      if (!data) return [];
      return JSON.parse(data) as WorkoutSessionLog[];
    } catch {
      return [];
    }
  },

  saveSession(session: Omit<WorkoutSessionLog, 'id' | 'timestamp'>): WorkoutSessionLog | null {
    const fullSession: WorkoutSessionLog = {
      ...session,
      id: 'ws_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      timestamp: Date.now(),
    };

    try {
      const existing = this.getSessions();
      existing.unshift(fullSession);
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(existing));
    } catch {
      return null;
    }

    return fullSession;
  },

  getPreferences(): UserPreferences {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PREFS);
      if (!data) return DEFAULT_PREFS;
      return { ...DEFAULT_PREFS, ...JSON.parse(data) };
    } catch {
      return DEFAULT_PREFS;
    }
  },

  savePreferences(prefs: Partial<UserPreferences>): UserPreferences {
    try {
      const current = this.getPreferences();
      const updated = { ...current, ...prefs };
      localStorage.setItem(STORAGE_KEY_PREFS, JSON.stringify(updated));
      return updated;
    } catch {
      return DEFAULT_PREFS;
    }
  },

  getStats() {
    const sessions = this.getSessions();
    const totalSessions = sessions.length;
    const totalMinutes = Math.round(
      sessions.reduce((acc, curr) => acc + (curr.durationCompletedSeconds || 0), 0) / 60
    );
    const averagePain = totalSessions > 0
      ? (sessions.reduce((acc, curr) => acc + (curr.painScore || 0), 0) / totalSessions).toFixed(1)
      : '0.0';

    return {
      totalSessions,
      totalMinutes,
      averagePain,
      recentSessions: sessions.slice(0, 10),
    };
  }
};
