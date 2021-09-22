import type PersistedAddinCommand from './schema/PersistedAddinCommand';
import type { AddinCommand } from 'owa-addins-store';

export default function createPersistedAddin(addin: AddinCommand): PersistedAddinCommand {
    return {
        addinId: addin.extension.Id,
        commandId: addin.control.Id,
    };
}
