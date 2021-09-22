import getEndpointNameForMode from './utils/getEndpointNameForMode';
import type PersistedAddinCommand from './schema/PersistedAddinCommand';
import persistedAddins from './persistedAddins';
import type { ExtensibilityModeEnum } from 'owa-addins-types';
import { savePersistedAddin } from 'owa-addins-services';

export default function setPersistedAddin(
    mode: ExtensibilityModeEnum,
    persistedAddin: PersistedAddinCommand
) {
    const modeString = getEndpointNameForMode(mode);
    setPersistedAddinByModeString(modeString, persistedAddin);
}

export function setPersistedAddinByModeString(
    modeString: string,
    persistedAddin: PersistedAddinCommand
) {
    const addinId = persistedAddin ? persistedAddin.addinId : '';
    const commandId = persistedAddin ? persistedAddin.commandId : '';

    persistedAddins()[modeString] = persistedAddin || undefined;
    savePersistedAddin(modeString, addinId, commandId);
}
