// i18n configuration

import { Language } from '../types';
import en from './locales/en.json';
import am from './locales/am.json';
import or from './locales/or.json';
import ti from './locales/ti.json';
import gz from './locales/gz.json';

const translations: Record<Language, any> = {
  en,
  am,
  or,
  ti,
  gz,
};

export const getTranslation = (language: Language, key: string): string => {
  const keys = key.split('.');
  let value: any = translations[language];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback to English if translation not found
      value = translations.en;
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && fallbackKey in value) {
          value = value[fallbackKey];
        } else {
          return key; // Return key if translation not found
        }
      }
      break;
    }
  }
  
  return typeof value === 'string' ? value : key;
};

export const t = (key: string, language?: Language): string => {
  const currentLanguage = language || 'en';
  return getTranslation(currentLanguage, key);
};

export const supportedLanguages: Language[] = ['en', 'am', 'or', 'ti', 'gz'];

export const languageNames: Record<Language, string> = {
  en: 'English',
  am: 'አማርኛ',
  or: 'Afaan Oromoo',
  ti: 'ትግርኛ',
  gz: 'ጉራጊኛ',
};
