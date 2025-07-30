import { jsx as _jsx } from "react/jsx-runtime";
import { useSettingsContext } from '@/settings/ui/core/SettingsContext';
import { Router } from 'wouter';
import { memoryLocation } from 'wouter/memory-location';
import RoutesContent from './routes-content/RoutesContent';
const SettingsPage = () => {
    const { reloadCount, currentPath } = useSettingsContext();
    const { hook: memoryHook } = memoryLocation({ path: currentPath });
    return (_jsx(Router, { hook: memoryHook, children: _jsx(RoutesContent, {}) }, reloadCount));
};
export default SettingsPage;
