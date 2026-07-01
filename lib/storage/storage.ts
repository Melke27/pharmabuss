// Local storage utilities using AsyncStorage

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER: '@polypharmacy_user',
  MEDICATIONS: '@polypharmacy_medications',
  REMINDERS: '@polypharmacy_reminders',
  SETTINGS: '@polypharmacy_settings',
  LANGUAGE: '@polypharmacy_language',
};

export class StorageService {
  /**
   * Store data
   */
  static async store(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error storing data:', error);
      throw error;
    }
  }

  /**
   * Retrieve data
   */
  static async retrieve<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error retrieving data:', error);
      return null;
    }
  }

  /**
   * Remove data
   */
  static async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data:', error);
      throw error;
    }
  }

  /**
   * Clear all data
   */
  static async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }

  /**
   * Store user data
   */
  static async storeUser(user: any): Promise<void> {
    return this.store(STORAGE_KEYS.USER, user);
  }

  /**
   * Retrieve user data
   */
  static async getUser(): Promise<any> {
    return this.retrieve(STORAGE_KEYS.USER);
  }

  /**
   * Store medications
   */
  static async storeMedications(medications: any[]): Promise<void> {
    return this.store(STORAGE_KEYS.MEDICATIONS, medications);
  }

  /**
   * Retrieve medications
   */
  static async getMedications(): Promise<any[]> {
    const medications = await this.retrieve<any[]>(STORAGE_KEYS.MEDICATIONS);
    return medications || [];
  }

  /**
   * Store reminders
   */
  static async storeReminders(reminders: any[]): Promise<void> {
    return this.store(STORAGE_KEYS.REMINDERS, reminders);
  }

  /**
   * Retrieve reminders
   */
  static async getReminders(): Promise<any[]> {
    const reminders = await this.retrieve<any[]>(STORAGE_KEYS.REMINDERS);
    return reminders || [];
  }

  /**
   * Store settings
   */
  static async storeSettings(settings: any): Promise<void> {
    return this.store(STORAGE_KEYS.SETTINGS, settings);
  }

  /**
   * Retrieve settings
   */
  static async getSettings(): Promise<any> {
    const settings = await this.retrieve(STORAGE_KEYS.SETTINGS);
    return settings || {};
  }

  /**
   * Store language preference
   */
  static async storeLanguage(language: string): Promise<void> {
    return this.store(STORAGE_KEYS.LANGUAGE, language);
  }

  /**
   * Retrieve language preference
   */
  static async getLanguage(): Promise<string> {
    const language = await this.retrieve<string>(STORAGE_KEYS.LANGUAGE);
    return language || 'en';
  }
}
