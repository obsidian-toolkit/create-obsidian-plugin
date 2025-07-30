
export enum DebugLevel {
    None = 'none',
    Debug = 'debug',
    Info = 'info',
    Warn = 'warn',
    Error = 'error',
}

interface Debug {
    enabled: boolean;
    level: DebugLevel;
}

export interface DefaultSettings {
    debug: Debug;
}

export interface SettingsEventPayload {
    eventName: string;
    oldValue: any;
    newValue: any;
}
