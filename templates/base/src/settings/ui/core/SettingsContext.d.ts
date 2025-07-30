import React from 'react';
import { SettingProviderProps, SettingsContextProps } from './types/interfaces';
export declare const SettingProvider: ({ app, plugin, children, }: SettingProviderProps) => React.ReactElement;
export declare const useSettingsContext: () => SettingsContextProps;
