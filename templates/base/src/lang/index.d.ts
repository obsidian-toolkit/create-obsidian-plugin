import { LocaleSchema } from '@/lang/types/interfaces';
declare function tf(text: string, params: Record<string, string>): string;
declare let t: LocaleSchema;
declare const tPromise: Promise<void>;
export { t, tf, tPromise };
