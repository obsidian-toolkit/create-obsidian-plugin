import React from 'react';
import { App } from 'obsidian';
import EmptyPlugin from '../../core/empty-plugin';
declare const SettingsRoot: React.FC<{
    app: App;
    plugin: EmptyPlugin;
}>;
export default SettingsRoot;
