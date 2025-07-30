import { DefaultSettings } from '@/settings/types/interfaces';

export function defaultSettings(): DefaultSettings {
    return {
        debug: {
            enabled: false,
            level: 'none'
        }
    } as DefaultSettings;
}
