import { Component } from 'obsidian';
import { Root } from 'react-dom/client';
export default class Help extends Component {
    rootDiv: null | HTMLDivElement;
    root: Root | null;
    isHelpOpen: boolean;
    constructor(plugin: {}, { PLUGIN_ID_UPPER_CAMEL }: {
        PLUGIN_ID_UPPER_CAMEL: any;
    });
}
