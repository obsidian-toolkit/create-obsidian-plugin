import InteractifyPlugin from '@/core/interactify-plugin';
import { BaseUnitContext } from '@/core/services/types/interfaces';
import { t } from '@/lang';
import { IntegratedModeContext } from '@/modes/integrated-mode/integrated-mode-context';
import InteractifyUnit from '@/modes/integrated-mode/interactify-unit/interactify-unit';
import { TriggerType } from '@/modes/integrated-mode/interactify-unit/types/constants';
import { LeafID } from '@/modes/integrated-mode/types/definitions';

import { Component, debounce, MarkdownView } from 'obsidian';

import { MdViewAdapter } from './adapters/md-view-adapter';
import State from './state';

export default class IntegratedMode extends Component {
    readonly context: IntegratedModeContext;
    state: State;

    constructor(public readonly plugin: InteractifyPlugin) {
        super();
        this.context = new IntegratedModeContext(this);
        this.state = new State(this);
    }

    initialize() {
        this.load();

        this.setupCommands();
        this.setupInternalEventHandlers();
        this.setupObsidianEventHandlers();
    }

    async onunload() {
        await this.state.clear();
    }

    private setupCommands(): void {
        this.plugin.addCommand({
            id: 'toggle-panels-state',
            name: 'Toggle control panels visibility for all the active interactive images in current note',
            checkCallback: (checking: boolean) => {
                const units = this.state.getUnits(this.context.leafID!);

                if (checking) {
                    return (
                        (this.context.inLivePreviewMode ||
                            this.context.inPreviewMode) &&
                        this.context.active &&
                        units.some((u) => u.active)
                    );
                }
                if (!this.context.active) {
                    this.plugin.showNotice(t.commands.togglePanels.notice.noMd);
                    return;
                }

                if (!units.some((d) => d.active)) {
                    this.plugin.showNotice(
                        t.commands.togglePanels.notice.noActiveImages
                    );
                    return;
                }

                const filteredU = units.filter((d) => d.active);

                const anyVisible = filteredU.some(
                    (u) => u.controlPanel.hasVisiblePanels
                );

                filteredU.forEach((u) =>
                    anyVisible
                        ? u.controlPanel.hide(TriggerType.FORCE)
                        : u.controlPanel.show(TriggerType.FORCE)
                );
                const message = anyVisible
                    ? t.commands.togglePanels.notice.hidden
                    : t.commands.togglePanels.notice.shown;
                this.plugin.showNotice(message);
                this.plugin.logger.debug(
                    'Called command `toggle-panels-management-state`'
                );
                return true;
            },
        });
    }

    private setupInternalEventHandlers(): void {
        this.plugin.emitter.on('unit.created', (unit: InteractifyUnit) => {
            const leafID = this.context.leafID;
            if (!leafID) {
                this.plugin.logger.warn('No active leaf found.');
                this.state.pushOrphanUnit(unit);
                this.plugin.logger.debug(
                    `'orphan unit with id ${unit.id} was added to state'`
                );
                return;
            }
            this.state.pushUnit(leafID, unit);
            this.plugin.logger.debug('Unit added to state', {
                leafID,
                unitName: unit.context.options.name,
            });
        });

        this.plugin.emitter.on('create-integrated-element', async (element) => {
            const view =
                this.plugin.app.workspace.getActiveViewOfType(MarkdownView);
            const ctx = this.plugin.leafIndex.data
                .get(view?.leaf.id!)
                ?.imageIndex.get(element);

            if (!ctx) {
                return;
            }

            const mdAdapter = new MdViewAdapter(this, view!.file!.stat);

            await mdAdapter.initialize(ctx);
        });

        this.plugin.emitter.on(
            'leaf-index.image.added',
            async (imageData: BaseUnitContext) => {
                const view =
                    this.plugin.app.workspace.getActiveViewOfType(MarkdownView);

                if (!view) {
                    this.plugin.logger.warn(
                        'No active Markdown view found for image data',
                        imageData
                    );
                    return;
                }

                const mdAdapter = new MdViewAdapter(this, view.file!.stat);

                this.plugin.settings.$.units.interactivity.markdown
                    .autoDetect && (await mdAdapter.initialize(imageData));
            }
        );
    }

    private setupObsidianEventHandlers(): void {
        const onLeafEvent = async (
            event: 'active-leaf-change' | 'layout-change'
        ) => {
            this.context.cleanup((leafID) => this.state.cleanupLeaf(leafID));
            this.context.initialize((leafID) => {
                this.state.initializeLeaf(leafID);
                this.setupResizeObserver(leafID);
            });

            if (!this.context.active) {
                return;
            }

            if (event === 'layout-change') {
                await this.state.cleanupUnitsOnFileChange(
                    this.context.leafID!,
                    this.context.view!.file!.stat
                );
                await this.state.cleanOrphan();
            }
        };

        this.plugin.registerEvent(
            this.plugin.app.workspace.on('layout-change', async () => {
                this.plugin.logger.debug(
                    'Calling withing the layout-change-event...'
                );

                await onLeafEvent('layout-change');

                const leafId = this.context.leafID;
                if (!leafId) {
                    return;
                }

                const images = this.plugin.leafIndex.data.get(leafId);
                if (!images) {
                    return;
                }

                const mode = this.context.inPreviewMode
                    ? 'preview'
                    : this.context.inLivePreviewMode
                      ? 'live-preview'
                      : undefined;
                if (!mode) {
                    return;
                }

                const adapter = new MdViewAdapter(
                    this,
                    this.context.view?.file?.stat!
                );
                const currentModeImages = images.imageIndex
                    .values()
                    .filter((i) => i.mode === mode);
                for (const image of currentModeImages) {
                    await adapter.initialize(image);
                }
            })
        );
        this.plugin.registerEvent(
            this.plugin.app.workspace.on('active-leaf-change', async () => {
                this.plugin.logger.debug(
                    'Called withing the active-leaf-change event...'
                );
                await onLeafEvent('active-leaf-change');
            })
        );
    }

    private setupResizeObserver(leafID: LeafID) {
        if (this.state.hasResizeObserver(leafID)) {
            return;
        }
        const debouncedApplyLayout = debounce(
            () => {
                this.state
                    .getUnits(leafID)
                    .forEach((unit) => unit.applyLayout());
            },
            50,
            true
        );

        const obs = new ResizeObserver((entries, observer) => {
            debouncedApplyLayout();
        });
        obs.observe(this.context.view?.contentEl!);
        this.state.setResizeObserver(leafID, obs);
    }
}
