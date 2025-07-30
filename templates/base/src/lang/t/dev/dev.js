import { LocaleProxy } from '@/lang/t/dev/proxy/locale-proxy';
import { moment } from 'obsidian';
import en from '../../locale/en';
export const locales = {
    en,
};
export function initLocale() {
    const localeKey = moment.locale();
    const lang = localeKey in locales ? localeKey : 'en';
    return locales[lang];
}
const currentLocale = initLocale();
const localeProxy = new LocaleProxy(currentLocale, locales.en);
export const t = localeProxy.createProxy();
