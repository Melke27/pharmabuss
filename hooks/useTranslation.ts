// Custom hook for translations

import { useUserStore } from '../store';
import { t } from '../i18n/config';

export const useTranslation = () => {
  const { user, appLanguage } = useUserStore();
  const language = user?.preferredLanguage || appLanguage || 'en';

  return {
    t: (key: string) => t(key, language),
    language,
  };
};
