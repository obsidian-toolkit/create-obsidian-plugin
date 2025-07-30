import { jsx as _jsx } from "react/jsx-runtime";
import { SettingProvider } from './core/SettingsContext';
import SettingsPage from './settings-page/SettingsPage';
const SettingsRoot = ({ app, plugin }) => (_jsx(SettingProvider, { app: app, plugin: plugin, children: _jsx(SettingsPage, {}) }));
export default SettingsRoot;
