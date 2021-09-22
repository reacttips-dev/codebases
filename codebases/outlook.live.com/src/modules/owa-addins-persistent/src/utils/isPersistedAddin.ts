import getPersistedAddin from '../getPersistedAddin';
import type IAddinCommand from 'owa-addins-store/lib/store/schema/interfaces/IAddinCommand';
import { ExtensibilityModeEnum } from 'owa-addins-types';
export default function (addinCommand: IAddinCommand) {
    const readPersistedAddin = getPersistedAddin(ExtensibilityModeEnum.MessageRead);
    const composePersistedAddin = getPersistedAddin(ExtensibilityModeEnum.MessageCompose);
    if (
        readPersistedAddin &&
        addinCommand.extension.Id === readPersistedAddin.addinId &&
        addinCommand.get_Id().indexOf(readPersistedAddin.commandId) >= 0
    ) {
        return true;
    }
    if (
        composePersistedAddin &&
        addinCommand.extension.Id === composePersistedAddin.addinId &&
        addinCommand.get_Id().indexOf(composePersistedAddin.commandId) >= 0
    ) {
        return true;
    }
    return false;
}
