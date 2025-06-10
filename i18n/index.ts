import i18n from 'i18next';
import * as Localization from 'expo-localization';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import AsyncStorage from '@react-native-async-storage/async-storage';

import translationEN from './locales/en.json';
import translationPL from './locales/pl.json';

const resources = {
  en: { translation: translationEN },
  pl: { translation: translationPL }
};

const initI18n = async () => {
    try {
        let savedLanguage = await AsyncStorage.getItem('language');
        
        if (!savedLanguage) {
            savedLanguage = Localization.getLocales()[0].languageCode;
        }
        
        i18n
        .use(LanguageDetector)
        .use(initReactI18next)
        .init({
            resources,
            lng: savedLanguage || 'en',
            fallbackLng: 'en',
            supportedLngs: ['en', 'pl'],
            detection: {
                order: ['AsyncStorage', 'navigator'],
                caches: ['localStorage'],
            },
            interpolation: {
                escapeValue: false,
            },
        });
    } catch (error) {
        console.error('Error initializing i18n:', error);
    }
}

initI18n();

export default i18n;
