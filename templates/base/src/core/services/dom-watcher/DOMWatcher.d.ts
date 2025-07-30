import { Component } from 'obsidian';
type MutationCondition = (mutation: MutationRecord) => boolean;
type MutationCallback = (mutation: MutationRecord) => void | Promise<void>;
export default class DOMWatcher extends Component {
    observer: MutationObserver | null;
    private readonly subscribers;
    constructor();
    private enable;
    private processMutation;
    onunload(): void;
    subscribe(condition: MutationCondition, callback: MutationCallback): void;
    unsubscribe(condition: MutationCondition): void;
}
export {};
