import type { AutoOpenPaneId } from '../constants';
import type { AutoOpenRegistration } from '../store/store';
import { action } from 'satcheljs';

export const updateAutoOpenRegistrationInStore = action(
    'updateAutoOpenRegistrationInStore',
    (autoOpenPaneId: AutoOpenPaneId, autoOpenRegistration: AutoOpenRegistration) => ({
        autoOpenPaneId,
        autoOpenRegistration,
    })
);
