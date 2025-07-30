import { t, tf } from '@/lang';
import { useEffect, useState } from 'react';
import { useSettingsContext } from '../core/SettingsContext';
export const useHistory = (state, updateState) => {
    const { plugin } = useSettingsContext();
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [undoStack, setUndoStack] = useState([]);
    const [redoStack, setRedoStack] = useState([]);
    const [undoDescription, setUndoDescription] = useState('');
    const [redoDescription, setRedoDescription] = useState('');
    if (process.env.NODE_ENV === 'development') {
        useEffect(() => {
            window.undoDebug = {
                undoStack,
                redoStack,
                undoDescription,
                redoDescription,
                canUndo: undoStack.length > 0,
                canRedo: redoStack.length > 0,
                currentState: state,
            };
        }, [undoStack, redoStack, undoDescription, redoDescription, state]);
    }
    useEffect(() => {
        if (undoStack.length > 0) {
            const action = undoStack[undoStack.length - 1];
            setUndoDescription(action.description);
        }
        else {
            setUndoDescription('');
        }
        if (redoStack.length > 0) {
            const action = redoStack[redoStack.length - 1];
            setRedoDescription(action.description);
        }
        else {
            setRedoDescription('');
        }
    }, [undoStack, redoStack]);
    const getUndoLabel = () => {
        if (!undoDescription) {
            return t.settings.pages.images.presets.history.tooltips.undo
                .nothing;
        }
        const count = undoStack.length > 1 ? ` (${undoStack.length - 1} more)` : '';
        return tf(t.settings.pages.images.presets.history.tooltips.undo.available, {
            description: undoDescription,
            count,
        });
    };
    const getRedoLabel = () => {
        if (!redoDescription) {
            return t.settings.pages.images.presets.history.tooltips.redo
                .nothing;
        }
        const count = redoStack.length > 1 ? ` (${redoStack.length - 1} more)` : '';
        return tf(t.settings.pages.images.presets.history.tooltips.redo.available, {
            description: redoDescription,
            count,
        });
    };
    useEffect(() => {
        const handler = async () => {
            setUndoStack([]);
            setRedoStack([]);
            setCanUndo(false);
            setCanRedo(false);
        };
        plugin.settings.emitter.on('settings-reset', handler);
        plugin.settings.emitter.on('settings-clear-history', handler);
        return () => {
            plugin.settings.emitter.off('settings-reset', handler);
            plugin.settings.emitter.off('settings-clear-history', handler);
        };
    }, []);
    const updateUndoStack = (state, description) => {
        let newUndoStack = [...undoStack];
        newUndoStack.push({
            description: description,
            state: state,
        });
        setCanUndo(true);
        if (newUndoStack.length > 50) {
            newUndoStack = [...newUndoStack.slice(-49)];
        }
        setUndoStack(newUndoStack);
        setRedoStack([]);
        setCanRedo(false);
    };
    const updateRedoStack = (action) => {
        const newRedoStack = [...redoStack, action];
        setRedoStack(newRedoStack);
        setCanRedo(true);
    };
    const undo = async () => {
        if (undoStack.length > 0) {
            const previousState = undoStack[undoStack.length - 1];
            // Сохраняем ТЕКУЩЕЕ состояние в redo стек
            updateRedoStack({
                state: [...state], // текущее состояние
                description: previousState.description, // меняем местами описания
            });
            // Восстанавливаем предыдущее состояние
            await updateState([...previousState.state]);
            const newUndoStack = undoStack.slice(0, -1);
            setUndoStack(newUndoStack);
            setCanUndo(newUndoStack.length > 0);
        }
    };
    const redo = async () => {
        if (redoStack.length > 0) {
            const redoAction = redoStack[redoStack.length - 1];
            // Добавляем текущее состояние обратно в undo стек
            const newUndoStack = [
                ...undoStack,
                {
                    state: [...state], // текущее состояние
                    description: redoAction.description,
                },
            ];
            setUndoStack(newUndoStack);
            // Убираем последний элемент из redo стека
            const newRedoStack = redoStack.slice(0, -1);
            setRedoStack(newRedoStack);
            // Применяем redo состояние
            await updateState([...redoAction.state]);
            setCanUndo(true);
            setCanRedo(newRedoStack.length > 0);
        }
    };
    useEffect(() => {
        const handler = async (e) => {
            if (e.code !== 'KeyZ' && e.code !== 'KeyY') {
                return;
            }
            if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
                e.preventDefault();
                if (canRedo) {
                    await redo();
                }
                else {
                    plugin.showNotice(t.settings.pages.images.presets.history.notices
                        .nothingToRedo);
                }
            }
            else if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                if (canUndo) {
                    await undo();
                }
                else {
                    plugin.showNotice(t.settings.pages.images.presets.history.notices
                        .nothingToUndo);
                }
            }
            if (e.code === 'KeyY' && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
                e.preventDefault();
                await redo();
            }
        };
        window.addEventListener('keydown', handler, true);
        return () => {
            window.removeEventListener('keydown', handler, true);
        };
    }, [undo, redo]);
    return {
        updateUndoStack,
        undo,
        redo,
        canUndo,
        canRedo,
        getRedoLabel,
        getUndoLabel,
    };
};
