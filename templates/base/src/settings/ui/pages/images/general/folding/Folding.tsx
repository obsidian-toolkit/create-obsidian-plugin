import { t } from '@/lang';

import React, { FC } from 'react';

import { OSetting } from '@obsidian-devkit/native-react-components';

import { useSettingsContext } from '../../../../core/SettingsContext';

const Folding: FC = (): React.ReactElement => {
    const { plugin } = useSettingsContext();
    return (
        <>
            <OSetting
                name={t.settings.pages.images.general.fold.header}
                heading
            />

            <OSetting
                name={t.settings.pages.images.general.fold.foldByDefault.name}
            >
                <input
                    type='checkbox'
                    defaultChecked={
                        plugin.settings.$.units.folding.foldByDefault
                    }
                    onChange={async (e) => {
                        plugin.settings.$.units.folding.foldByDefault =
                            e.target.checked;
                        await plugin.settings.save();
                    }}
                />
            </OSetting>

            <OSetting
                name={
                    t.settings.pages.images.general.fold.autoFoldOnFocusChange
                        .name
                }
            >
                <input
                    type='checkbox'
                    defaultChecked={
                        plugin.settings.$.units.folding.autoFoldOnFocusChange
                    }
                    onChange={async (e) => {
                        plugin.settings.$.units.folding.autoFoldOnFocusChange =
                            e.target.checked;
                        await plugin.settings.save();
                    }}
                />
            </OSetting>
        </>
    );
};

export default Folding;
