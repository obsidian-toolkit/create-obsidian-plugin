import { Component } from 'obsidian';
export default class DOMWatcher extends Component {
    observer = null;
    subscribers = new Map();
    constructor() {
        super();
        this.load();
        this.enable();
    }
    enable() {
        this.observer = new MutationObserver(async (mutations) => {
            for (const mutation of mutations) {
                await this.processMutation(mutation);
            }
        });
        this.observer.observe(document.body, {
            childList: true, // Add/removal of children
            subtree: true, // monitor all subtree
            attributes: true, // changes in attributes
            attributeOldValue: true,
        });
    }
    async processMutation(mutation) {
        for (const [condition, callback] of this.subscribers) {
            if (condition(mutation)) {
                await callback(mutation);
            }
        }
    }
    onunload() {
        super.onunload();
        this.observer?.disconnect();
        this.subscribers.clear();
    }
    subscribe(condition, callback) {
        this.subscribers.set(condition, callback);
    }
    unsubscribe(condition) {
        this.subscribers.delete(condition);
    }
}
