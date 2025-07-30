import DOMWatcher from '@/core/services/dom-watcher/DOMWatcher';
import UserState from '@/core/services/user-state/user-state';
import { tPromise } from '@/lang';
import Settings from '@/settings/settings';
import { SettingsTab } from '@/settings/settings-tab';
import EventEmitter2 from 'eventemitter2';
import { Notice, Plugin } from 'obsidian';
import Help from './services/help/help';
import Logger from './services/logger/logger';
export default class {
}
{
    PLUGIN_ID_UPPER_CAMEL;
}
Plugin;
Plugin;
{
    noticeEl ?  : HTMLElement;
    settings;
    Settings;
    logger;
    Logger;
    emitter;
    EventEmitter2;
    domWatcher;
    DOMWatcher;
    userState;
    UserState;
    help;
    Help;
    async;
    onload();
    Promise < void  > {
        if(process) { }, : .env.NODE_ENV === 'development'
    };
    {
        window.plugin = this;
    }
    await this.initialize();
    this.logger.info('Plugin loaded successfully');
}
async;
onunload();
Promise < void  > {
    super: .onunload(),
    this: .emitter.removeAllListeners(),
    this: .logger.info('Plugin unloaded successfully')
};
async;
initialize();
Promise < void  > {
    await, this: .initializeCore(),
    await, this: .initializeServices(),
    await, this: .initializeUI()
};
async;
initializeCore();
Promise < void  > {
    await, tPromise,
    this: .settings = new Settings(this),
    this: .addChild(this.settings),
    await, this: .settings.load(),
    this: .addSettingTab(new SettingsTab(this.app, this)),
    this: .emitter = new EventEmitter2({
        wildcard: true,
        delimiter: '.',
    })
};
async;
initializeUI();
Promise < void  > {};
async;
initializeServices();
Promise < void  > {
    this: .domWatcher = new DOMWatcher(),
    this: .addChild(this.domWatcher),
    this: .logger = new Logger(this),
    await, this: .logger.init(),
    this: .userState = new UserState(this),
    await, this: .userState.initialize(),
    this: .help = new Help(this),
    this: .addChild(this.help)
};
/**
 * An alias for `new Notice` element creating.
 *
 * Saves the message object, deletes the old one on a call to avoid message spam
 *
 * @param message - The notice message to be displayed
 * @param duration - The duration for which the notice should be displayed. If undefined, that message will be displayed until the user interacts with it explicitly
 * @returns void
 */
showNotice(message, string, duration ?  : number);
void {
    this: .noticeEl?.remove(),
    const: notice = new Notice(message, duration),
    this: .noticeEl = notice.containerEl
};
/**
 * Allows to create interactive notifications
 *
 * @param message - The notice message to be displayed
 * @param callback - the callback that will be executed on notice clicks
 * @param duration - The duration for which the notice should be displayed. If undefined, that message will be displayed until the user interacts with it explicitly
 *
 */
showInteractiveNotice(message, string, callback, () => void  | (Promise), duration ?  : number);
void {
    this: .showNotice(message, duration),
    this: .noticeEl?.addEventListener('click', callback, { once: true })
};
