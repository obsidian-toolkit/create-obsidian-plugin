import { Component } from 'obsidian';

import Events from '../events';
import { Handler } from '../types/interfaces';

export class Keyboard extends Component implements Handler {
    constructor(private readonly events: Events) {
        super();
    }

    initialize(): void {
        this.load();
        const { container } = this.events.unit.context;

        this.registerDomEvent(container, 'keydown', this.keyDown);
    }

    keyDown = async (event: KeyboardEvent): Promise<void> => {
        const { code, ctrlKey, shiftKey, altKey } = event;
        const actions = this.events.unit.actions;

        const moveKeys = {
            ArrowUp: () => actions.moveElement(0, 50, { animated: true }),
            ArrowDown: () => actions.moveElement(0, -50, { animated: true }),
            ArrowLeft: () => actions.moveElement(50, 0, { animated: true }),
            ArrowRight: () => actions.moveElement(-50, 0, { animated: true }),
        };

        const ctrlKeys = {
            Equal: () => actions.zoomElement(1.1, { animated: true }),
            Minus: () => actions.zoomElement(0.9, { animated: true }),
            Digit0: () => actions.resetZoomAndMove({ animated: true }),
        };

        const ctrlAltKeys = {
            KeyF: async () => await actions.toggleFullscreen(),
        };

        let handler = null;

        if (ctrlKey && altKey && code in ctrlAltKeys) {
            handler = ctrlAltKeys[code as keyof typeof ctrlAltKeys];
        } else if (ctrlKey && code in ctrlKeys) {
            handler = ctrlKeys[code as keyof typeof ctrlKeys];
        } else if (!ctrlKey && !shiftKey && code in moveKeys) {
            handler = moveKeys[code as keyof typeof moveKeys];
        }

        if (handler) {
            event.preventDefault();
            event.stopPropagation();
            handler();
        }
    };
}
