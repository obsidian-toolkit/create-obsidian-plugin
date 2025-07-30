import { PartialLocale } from '@/lang/t/types/definitions';
import { LocaleSchema } from '@/lang/types/interfaces';
export declare const locales: Record<string, LocaleSchema>;
export declare function initLocale(): LocaleSchema | PartialLocale;
export declare const t: any;
