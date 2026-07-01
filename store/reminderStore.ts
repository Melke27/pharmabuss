import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';
import { remindersApi } from '../lib/api';
import { getAuthToken } from '../lib/api';

interface Reminder {
  id: string;
  medicationId: string;
  title?: string;
  time: string;
  days: number[];
  enabled: boolean;
  lastTaken?: string;
  snoozedUntil?: string;
}

interface ReminderState {
  reminders: Reminder[];

  addReminder: (reminder: Reminder) => void;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  toggleReminder: (id: string) => void;
  markAsTaken: (id: string) => void;
  snoozeReminder: (id: string, minutes: number) => void;
  getRemindersForDay: (day: number) => Reminder[];
  getActiveReminders: () => Reminder[];
  fetchReminders: () => Promise<void>;
}

export const useReminderStore = create<ReminderState>()(
  persist(
    (set, get) => ({
      reminders: [],

      addReminder: async (reminder) => {
        set((state) => ({ reminders: [...state.reminders, reminder] }));
        try {
          if (getAuthToken()) {
            await remindersApi.create(reminder);
          }
        } catch {}
      },

      updateReminder: async (id, updates) => {
        set((state) => ({
          reminders: state.reminders.map((r) => (r.id === id ? { ...r, ...updates } : r)),
        }));
        try {
          if (getAuthToken()) {
            await remindersApi.update(id, updates);
          }
        } catch {}
      },

      deleteReminder: async (id) => {
        set((state) => ({ reminders: state.reminders.filter((r) => r.id !== id) }));
        try {
          if (getAuthToken()) {
            await remindersApi.delete(id);
          }
        } catch {}
      },

      toggleReminder: (id) => {
        const reminder = get().reminders.find((r) => r.id === id);
        if (reminder) {
          get().updateReminder(id, { enabled: !reminder.enabled });
        }
      },

      markAsTaken: (id) => {
        get().updateReminder(id, { lastTaken: new Date().toISOString() });
      },

      snoozeReminder: (id, minutes) => {
        const snoozedUntil = new Date(Date.now() + minutes * 60000).toISOString();
        get().updateReminder(id, { snoozedUntil });
      },

      getRemindersForDay: (day) => {
        return get().reminders.filter((r) => r.enabled && r.days.includes(day));
      },

      getActiveReminders: () => {
        return get().reminders.filter((r) => r.enabled);
      },

      fetchReminders: async () => {
        if (!getAuthToken()) return;
        try {
          const data = await remindersApi.getAll();
          const mapped: Reminder[] = data.map((item: any) => ({
            id: item._id || item.id,
            medicationId: item.medicationId,
            title: item.title,
            time: item.time,
            days: item.days || [],
            enabled: item.enabled !== false,
            lastTaken: item.lastTaken,
            snoozedUntil: item.snoozedUntil,
          }));
          set({ reminders: mapped });
        } catch {}
      },
    }),
    {
      name: 'reminder-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
