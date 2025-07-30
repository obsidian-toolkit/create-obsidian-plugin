import { UndoRedoApi } from './types/interfaces';
export declare const useHistory: <T extends readonly unknown[]>(state: T, updateState: (state: T) => Promise<void>) => UndoRedoApi<T>;
