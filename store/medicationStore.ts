import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Medication, DrugInteraction, DoseSchedule, AdherenceRecord } from '../types';
import { medicationsApi } from '../lib/api';
import { getAuthToken } from '../lib/api';

interface MedicationState {
  medications: Medication[];
  interactions: DrugInteraction[];
  doseSchedules: DoseSchedule[];
  adherenceRecords: AdherenceRecord[];
  isLoading: boolean;

  addMedication: (medication: Medication) => void;
  updateMedication: (id: string, updates: Partial<Medication>) => void;
  deleteMedication: (id: string) => void;
  setMedications: (medications: Medication[]) => void;
  addInteraction: (interaction: DrugInteraction) => void;
  clearInteractions: () => void;
  addDoseSchedule: (schedule: DoseSchedule) => void;
  updateDoseSchedule: (id: string, updates: Partial<DoseSchedule>) => void;
  addAdherenceRecord: (record: AdherenceRecord) => void;
  getAdherenceRate: (medicationId: string, days: number) => number;
  fetchMedications: () => Promise<void>;
  syncToServer: () => Promise<void>;
}

export const useMedicationStore = create<MedicationState>()(
  persist(
    (set, get) => ({
      medications: [],
      interactions: [],
      doseSchedules: [],
      adherenceRecords: [],
      isLoading: false,

      addMedication: async (medication) => {
        set((state) => ({ medications: [...state.medications, medication] }));
        try {
          if (getAuthToken()) {
            await medicationsApi.create(medication);
          }
        } catch {}
      },

      updateMedication: (id, updates) => {
        set((state) => ({
          medications: state.medications.map((med) =>
            med.id === id ? { ...med, ...updates } : med
          ),
        }));
        medicationsApi.update(id, updates).catch(() => {});
      },

      deleteMedication: async (id) => {
        set((state) => ({
          medications: state.medications.filter((med) => med.id !== id),
        }));
        try {
          if (getAuthToken()) {
            await medicationsApi.delete(id);
          }
        } catch {}
      },

      setMedications: (medications) => set({ medications }),

      addInteraction: (interaction) =>
        set((state) => ({ interactions: [...state.interactions, interaction] })),

      clearInteractions: () => set({ interactions: [] }),

      addDoseSchedule: (schedule) =>
        set((state) => ({ doseSchedules: [...state.doseSchedules, schedule] })),

      updateDoseSchedule: (id, updates) =>
        set((state) => ({
          doseSchedules: state.doseSchedules.map((schedule) =>
            schedule.medicationId === id ? { ...schedule, ...updates } : schedule
          ),
        })),

      addAdherenceRecord: (record) =>
        set((state) => ({ adherenceRecords: [...state.adherenceRecords, record] })),

      getAdherenceRate: (medicationId, days) => {
        const records = get().adherenceRecords
          .filter((r) => r.medicationId === medicationId)
          .slice(-days);

        if (records.length === 0) return 0;
        const totalTaken = records.reduce((sum, r) => sum + r.takenDoses, 0);
        const totalScheduled = records.reduce((sum, r) => sum + r.scheduledDoses, 0);
        return totalScheduled > 0 ? (totalTaken / totalScheduled) * 100 : 0;
      },

      fetchMedications: async () => {
        if (!getAuthToken()) return;
        set({ isLoading: true });
        try {
          const data = await medicationsApi.getAll();
          const mapped: Medication[] = data.map((item: any) => ({
            id: item._id || item.id,
            name: item.name,
            genericName: item.genericName,
            dosage: item.dosage,
            unit: item.unit,
            frequency: item.frequency,
            instructions: item.instructions || '',
            startDate: item.startDate,
            endDate: item.endDate,
            status: item.status || 'active',
            prescribedBy: item.prescribedBy,
            notes: item.notes,
            refillDate: item.refillDate,
            currentStock: item.currentStock,
          }));
          set({ medications: mapped, isLoading: false });
        } catch {
          set({ isLoading: false });
        }
      },

      syncToServer: async () => {
        if (!getAuthToken()) return;
        const { medications } = get();
        for (const med of medications) {
          try {
            await medicationsApi.create(med);
          } catch {}
        }
      },
    }),
    {
      name: 'medication-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        medications: state.medications,
        interactions: state.interactions,
        doseSchedules: state.doseSchedules,
        adherenceRecords: state.adherenceRecords,
      }),
    }
  )
);
