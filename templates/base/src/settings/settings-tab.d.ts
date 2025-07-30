import { App, PluginSettingTab } from 'obsidian';
export declare class SettingsTab extends PluginSettingTab {
    app: App;
    plugin: EmptyPlugin;
    private root;
    constructor(app: App, plugin: EmptyPlugin);
    display(): void;
    hide(): void;
}
