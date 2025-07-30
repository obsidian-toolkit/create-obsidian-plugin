import EventEmitter2 from 'eventemitter2';
import { Component } from 'obsidian';
import { EventsWrapper } from './proxy/types/definitions';
import { DefaultSettings } from './types/interfaces';
export default class Settings extends Component {
    dirty: boolean;
    private data;
    readonly emitter: EventEmitter2;
    $$: EventsWrapper<DefaultSettings>;
    private savePromise?;
    private saveTimeout?;
    private saveResolve?;
    constructor(plugin: {}, { PLUGIN_ID_UPPER_CAMEL }: {
        PLUGIN_ID_UPPER_CAMEL: any;
    });
}
