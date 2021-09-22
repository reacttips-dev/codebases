import saveHoverSurfaceAction from '../actions/saveHoverSurfaceAction';
import { lazyUpdateUserConfigurationService } from 'owa-session-store/lib/lazyFunctions';
import { getMailTriageActionsFromHoverActionKeys } from '../utils/hoverSurfaceActionHelper';
import type { HoverActionKey } from 'owa-outlook-service-options';

// Number of options that must be sent and updated on server.
export const CUSTOM_HOVER_SIZE = 4;

export default function saveHoverSurfaceActionService(hoverActionKeys: HoverActionKey[]) {
    // Remove "None" elements
    hoverActionKeys = hoverActionKeys
        .filter(hoverActionKey => hoverActionKey != 'None')
        .slice(0, CUSTOM_HOVER_SIZE);

    // Ensure we have CUSTOM_HOVER_SIZE number of items to send
    while (hoverActionKeys.length < CUSTOM_HOVER_SIZE) {
        hoverActionKeys.unshift('None');
    }

    // Convert to server readable configuration
    const mailTriageActions = getMailTriageActionsFromHoverActionKeys(hoverActionKeys);

    // Update user config cache
    saveHoverSurfaceAction(hoverActionKeys);
    return lazyUpdateUserConfigurationService.importAndExecute(
        [
            {
                key: 'MailTriageOnHoverActions',
                valuetype: 'StringArray',
                value: mailTriageActions as any,
            },
        ],
        'OWA.ViewStateConfiguration'
    );
}
