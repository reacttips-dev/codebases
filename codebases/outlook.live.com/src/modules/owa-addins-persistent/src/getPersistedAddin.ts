import getEndpointNameForMode from './utils/getEndpointNameForMode';
import type PersistedAddinCommand from './schema/PersistedAddinCommand';
import persistedAddins from './persistedAddins';
import type { ExtensibilityModeEnum } from 'owa-addins-types';

export default function getPersistedAddin(mode: ExtensibilityModeEnum): PersistedAddinCommand {
    const modeString = getEndpointNameForMode(mode);
    return persistedAddins()[modeString];
}
