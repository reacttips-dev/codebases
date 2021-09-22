import getExtensibilityState from '../store/getExtensibilityState';
import { action } from 'satcheljs/lib/legacy';
import { ObservableMap } from 'mobx';
import type ExtensionEventResult from '../store/schema/ExtensionEventResult';
import { setPendingUILess } from '../store/pendingUILess';
import type IExtendedAddinCommand from '../store/schema/interfaces/IExtendedAddinCommand';

export default action('setUilessExtendedAddinCommand')(function setUilessExtendedAddinCommand(
    controlId: string,
    extendedAddinCommand: IExtendedAddinCommand,
    hostItemIndex: string
): Promise<ExtensionEventResult> {
    const pendingUILess = setPendingUILess(controlId);

    const runningUILessExtendedAddinCommands = getExtensibilityState()
        .runningUILessExtendedAddinCommands;
    if (!runningUILessExtendedAddinCommands.has(hostItemIndex)) {
        runningUILessExtendedAddinCommands.set(
            hostItemIndex,
            new ObservableMap<string, IExtendedAddinCommand>()
        );
    }
    runningUILessExtendedAddinCommands.get(hostItemIndex).set(controlId, extendedAddinCommand);

    return pendingUILess;
});
