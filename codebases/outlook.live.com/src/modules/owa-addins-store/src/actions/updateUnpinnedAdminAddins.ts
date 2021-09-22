import extensibilityState from '../store/store';
import { mutatorAction } from 'satcheljs';
import { ExtensibilityModeEnum } from 'owa-addins-types';

/*The action updates Extensibility store with Unpinned admin add-ins in each surface
 * This will be used later on to show lightning callout and highlight add-ins in overflow menu.
 * @param addinsList => List of unpinned aadmin dd-ins for that surface
 * @param surfaceType => The surface ( read / compose / calendar )
 */
export const updateUnpinnedAdminAddins = mutatorAction(
    'updateUnpinnedAdminAddins',
    (addinsList: string[], surfaceType: ExtensibilityModeEnum) => {
        switch (surfaceType) {
            case ExtensibilityModeEnum.MessageRead:
                extensibilityState.mailReadSurfaceUnpinnedAdminAddins = addinsList;
                break;
            case ExtensibilityModeEnum.MessageCompose:
                extensibilityState.mailComposeSurfaceUnpinnedAdminAddins = addinsList;
                break;
            case ExtensibilityModeEnum.AppointmentOrganizer:
                extensibilityState.calendarSurfaceUnpinnedAdminAddins = addinsList;
                break;
        }
    }
);
