import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import eng from './locales/eng.json';
import ita from './locales/ita.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      eng: { translation: eng },
      ita: { translation: ita },
    },
    lng: 'eng',
    fallbackLng: 'eng',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
