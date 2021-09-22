import { AddinCommand, extensibilityState, IEnabledAddinCommands } from 'owa-addins-store';
import type { ExtensibilityModeEnum } from 'owa-addins-types';

export function getCommandWithGivenId(
    addinId: string,
    addinCommandId: string,
    mode: ExtensibilityModeEnum
): AddinCommand {
    const enabledAddinCommands: IEnabledAddinCommands = extensibilityState.EnabledAddinCommands;
    if (!enabledAddinCommands) {
        return null;
    }

    for (const addin of enabledAddinCommands.getExtensionPoint(mode)) {
        if (addin.Id == addinId && addin.AddinCommands.size > 0) {
            for (const element of addin.AddinCommands.values()) {
                if ((element as AddinCommand).control.Id == addinCommandId) {
                    return element as AddinCommand;
                }
            }
        }
    }

    return null;
}
