import * as React from 'react';
import { HotkeysMap } from 'owa-hotkeys-map';
import { getCommandCategories, getCommands } from '../utils/MailModuleHotKeys';
import { lazyMountAndShowFullOptions } from 'owa-options-view';
import { observer } from 'mobx-react-lite';

export const MailHotkeysMap = observer(function MailHotkeysMap() {
    /**
     * KeyboardShortcutsMap requires an array of HotkeyCommands, so convert
     * the object from MailModuleHotKeys to an array.
     */
    const commandsObject = getCommands();
    const hotkeyCommands = [];
    Object.keys(commandsObject).map(key => {
        hotkeyCommands.push(commandsObject[key]);
    });

    return (
        <HotkeysMap
            commandCategories={getCommandCategories()}
            goToOptions={goToOptions}
            hotkeyCommands={hotkeyCommands}
        />
    );
});

function goToOptions() {
    lazyMountAndShowFullOptions.importAndExecute('general', 'accessibility');
}
