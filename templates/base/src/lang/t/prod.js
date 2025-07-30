import { moment } from 'obsidian';
import en from '../locale/en/flat.json';
export const locales = {
    en: en,
};
export function initLocale() {
    const localeKey = moment.locale();
    const lang = localeKey in locales ? localeKey : 'en';
    return locales[lang];
}
const currentLocale = initLocale();
export function t(key) {
    return (currentLocale[key] ??
        en[key] ??
        `[missing: ${key}]`);
}
