import { LocaleWrapper } from '@/lang/t/dev/proxy/types/definitions';
export declare class LocaleProxy<T extends object> {
    private readonly currentLocale;
    private readonly fallbackLocale;
    constructor(currentLocale: T, fallbackLocale: T);
    createProxy(path?: string[]): LocaleWrapper<T>;
    private getValue;
    private isEmpty;
    private isObject;
    private handleMissing;
}
