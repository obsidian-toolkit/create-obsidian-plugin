import { InteractifyAdapters } from '@/modes/integrated-mode/adapters/types/constants';
import InteractifyUnit from '@/modes/integrated-mode/interactify-unit/interactify-unit';
import {
    StateData,
    StateOrphanData,
} from '@/modes/integrated-mode/types/interfaces';

import { FileStats } from 'obsidian';

import IntegratedMode from './integrated-mode';
import { LeafID } from './types/definitions';

export default class State {
    data = new Map<LeafID, StateData>();
    orphans: StateOrphanData = { units: [] };

    constructor(private readonly integratedMode: IntegratedMode) {}

    /**
     * Initializes the data for a leaf with the given id if it doesn't exist.
     *
     * @param leafID The id of the leaf to initialize.
     */
    initializeLeaf(leafID: LeafID): void {
        if (!this.data.get(leafID)) {
            this.data.set(leafID, {
                resizeObserver: undefined,
                units: [],
            });
            this.integratedMode.plugin.logger.debug(
                `Initialized data for leaf width id: ${leafID}...`
            );
        }
    }

    async cleanupLeaf(leafID: LeafID): Promise<void> {
        const data = this.data.get(leafID);
        if (!data) {
            this.integratedMode.plugin.logger.error(`No data for leaf`, {
                leafID,
            });
            return;
        }

        for (const unit of data.units) {
            await unit.onDelete();
            this.integratedMode.plugin.logger.debug(`Unloaded unit`, {
                unitName: unit.context.options.name,
            });
        }

        this.data.delete(leafID);
        this.integratedMode.plugin.logger.debug(
            `Data for leaf with id ${leafID} was cleaned successfully.`
        );
    }

    async clear(): Promise<void> {
        this.integratedMode.plugin.logger.debug('Started to clear state...');
        for (const leafID of this.data.keys()) {
            await this.cleanupLeaf(leafID);
        }

        await this.cleanOrphan();

        this.integratedMode.plugin.logger.debug(
            'State was cleared successfully.'
        );
    }

    getResizeObserver(leafID: LeafID): ResizeObserver | undefined {
        return this.data.get(leafID)?.resizeObserver;
    }

    setResizeObserver(leafID: LeafID, observer: ResizeObserver) {
        const data = this.data.get(leafID);
        if (data) {
            data.resizeObserver = observer;
        }
    }
    hasResizeObserver(leafID: LeafID): boolean {
        return !!this.getResizeObserver(leafID);
    }

    getUnits(leafID: LeafID): InteractifyUnit[] {
        return this.data.get(leafID)?.units ?? [];
    }

    pushUnit(leafID: LeafID, unit: InteractifyUnit): void {
        const data = this.data.get(leafID);
        if (!data) {
            this.integratedMode.plugin.logger.error(
                `No data for leafID: ${leafID}`
            );
            return;
        }
        data.units.push(unit);
    }

    pushOrphanUnit(unit: InteractifyUnit): void {
        this.orphans.units.push(unit);
    }

    async cleanOrphan() {
        for (const unit of this.orphans.units) {
            await unit.onDelete();
        }
    }

    async cleanupUnitsOnFileChange(
        leafID: LeafID,
        currentFileStats: FileStats
    ): Promise<void> {
        const data = this.data.get(leafID);
        if (!data) {
            this.integratedMode.plugin.logger.error(
                `No data for leafID: ${leafID}`
            );
            return;
        }

        const currentFileCtime = currentFileStats.ctime;

        const unitsToKeep = [];
        for (const unit of data.units) {
            if (
                unit.context.adapter === InteractifyAdapters.PickerMode ||
                currentFileCtime !== unit.fileStats.ctime
            ) {
                await unit.onDelete();
                this.integratedMode.plugin.logger.debug(
                    `Cleaned up unit with id ${unit.id} due to file change`
                );
            } else {
                unitsToKeep.push(unit);
            }
        }
        data.units = unitsToKeep;
    }
}
