import { LocaleProxy } from '@/lang/t/dev/proxy/locale-proxy';
import { PartialLocale } from '@/lang/t/types/definitions';
import { LocaleSchema } from '@/lang/types/interfaces';

import { moment } from 'obsidian';

import en from '../../locale/en';

export const locales: Record<string, LocaleSchema> = {
    en,
};

export function initLocale(): LocaleSchema | PartialLocale {
    const localeKey = moment.locale() as keyof typeof locales;
    const lang = localeKey in locales ? localeKey : 'en';

    return locales[lang];
}

const currentLocale: LocaleSchema | PartialLocale = initLocale();

const localeProxy = new LocaleProxy(currentLocale, locales.en);

export const t = localeProxy.createProxy();
