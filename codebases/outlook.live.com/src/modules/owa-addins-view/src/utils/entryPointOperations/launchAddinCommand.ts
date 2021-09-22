import executeEntryPoint from './executeEntryPoint';
import type { AddinCommand } from 'owa-addins-store';
import type { ExtensibilityModeEnum } from 'owa-addins-types';
import { getCommandWithGivenId } from './AddinChecker';

export default async function launchAddinCommand(
    hostItemIndex: string,
    addinId: string,
    addinCommandId: string,
    mode: ExtensibilityModeEnum,
    initializationContext?: string
) {
    const addinCommand = getCommandWithGivenId(addinId, addinCommandId, mode);

    if (addinCommand != null) {
        await executeEntryPoint(hostItemIndex, addinCommand as AddinCommand, initializationContext);
        return;
    }

    return null;
}
