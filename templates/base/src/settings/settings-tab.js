import { jsx as _jsx } from "react/jsx-runtime";
import { PluginSettingTab } from 'obsidian';
import { createRoot } from 'react-dom/client';
from;
'../core/{{PLUGIN_ID}}-plugin';
import SettingsRoot from './ui/SettingsRoot';
export class SettingsTab extends PluginSettingTab {
    app;
    plugin;
    root = undefined;
    constructor(app, plugin) {
        super(app, plugin);
        this.app = app;
        this.plugin = plugin;
        this.containerEl.addClass('izd-settings');
    }
    display() {
        this.plugin.settings.emitter.on('**', (payload) => {
            this.plugin.emitter.emit(payload.eventName, payload);
        });
        this.root = createRoot(this.containerEl);
        this.root.render(_jsx(SettingsRoot, { app: this.app, plugin: this.plugin }));
    }
    hide() {
        this.plugin.settings.emitter.removeAllListeners();
        this.root?.unmount();
        this.containerEl.empty();
    }
}
