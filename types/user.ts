// User-related type definitions

export type NCDType = 'hypertension' | 'diabetes' | 'heart_failure' | 'copd' | 'asthma' | 'other';

export type Language = 'en' | 'am' | 'or' | 'ti' | 'gz';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  role?: 'user' | 'admin';
  preferredLanguage: Language;
  conditions: NCDType[];
  allergies?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  createdAt: string;
  settings: UserSettings;
}

export interface UserSettings {
  notifications: boolean;
  voiceEnabled: boolean;
  largeText: boolean;
  highContrast: boolean;
  reminderSound: string;
  reminderAdvanceMinutes: number;
}
