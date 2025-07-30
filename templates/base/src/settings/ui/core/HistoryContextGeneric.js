import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useMemo, } from 'react';
import { useHistory } from '../hooks/useHistory';
import { useSettingsContext } from './SettingsContext';
const createHistoryContext = () => {
    const Context = createContext(undefined);
    const HistoryProvider = ({ state, updateState, children, }) => {
        const { undo, canUndo, redo, canRedo, getRedoLabel, getUndoLabel, updateUndoStack, } = useHistory(state, updateState);
        const { plugin } = useSettingsContext();
        const contextValue = useMemo(() => ({
            undo,
            canUndo,
            redo,
            canRedo,
            getRedoLabel,
            getUndoLabel,
            updateUndoStack,
        }), [
            undo,
            canUndo,
            redo,
            canRedo,
            getRedoLabel,
            getUndoLabel,
            updateUndoStack,
        ]);
        useEffect(() => {
            return () => {
                plugin.settings.emitter.emit('settings-clear-history', {
                    eventName: 'settings-clear-history',
                    oldValue: undefined,
                    newValue: undefined,
                });
            };
        }, [plugin]);
        return (_jsx(Context.Provider, { value: contextValue, children: children }));
    };
    const useHistoryContext = () => {
        const context = useContext(Context);
        if (context === undefined) {
            throw new Error('useUndoRedoContext must be used within a UndoRedoProvider');
        }
        return context;
    };
    return { HistoryProvider, useHistoryContext };
};
export default createHistoryContext;
