import { AddinOptionSurfaceItems, lazySetAddinOptionSurfaceItems } from 'owa-surface-actions';
import { createAddinOptionSurfaceItems } from 'owa-addins-view';
import type { IEnabledAddinCommands, IAddin } from 'owa-addins-store';
import { ExtensibilityModeEnum } from 'owa-addins-types';

export default function setAddinCommandsForOptions(
    enabledAddinCommands: IEnabledAddinCommands
): void {
    const addinOptionSurfaceItems: AddinOptionSurfaceItems = {};
    const modesForOptions = [
        ExtensibilityModeEnum.MessageRead,
        ExtensibilityModeEnum.MessageCompose,
        ExtensibilityModeEnum.AppointmentAttendee,
        ExtensibilityModeEnum.AppointmentOrganizer,
    ];

    modesForOptions.forEach(mode => {
        const addins: IAddin[] = enabledAddinCommands.getExtensionPoint(mode);
        addinOptionSurfaceItems[mode] = createAddinOptionSurfaceItems(addins);
    });

    lazySetAddinOptionSurfaceItems.importAndExecute(addinOptionSurfaceItems);
}
