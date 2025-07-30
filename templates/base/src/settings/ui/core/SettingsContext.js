import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useMemo, useState, } from 'react';
const SettingsContext = createContext(undefined);
export const SettingProvider = ({ app, plugin, children, }) => {
    const [reloadCount, setReloadCount] = useState(0);
    const [currentPath, setCurrentPath] = useState('/images');
    const forceReload = useCallback(() => {
        setReloadCount((prev) => prev + 1);
    }, []);
    const contextValue = useMemo(() => ({
        app,
        plugin,
        forceReload,
        reloadCount,
        currentPath,
        setCurrentPath,
    }), [app, plugin, forceReload, reloadCount, currentPath, setCurrentPath]);
    return (_jsx(SettingsContext.Provider, { value: contextValue, children: children }));
};
export const useSettingsContext = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettingsContext must be used within a SettingProvider');
    }
    return context;
};
