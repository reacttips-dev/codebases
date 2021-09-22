import getConnectedNotesService from '../services/getConnectedNotesService';
import { isSuccessStatusCode } from 'owa-http-status-codes';
import {
    wereSamsungNotesEverSynchronized,
    setWereSamsungNotesEverSynchronized,
} from './wereSamsungNotesEverSynchronized';
import { lazyLogFloodgateActivity } from 'owa-floodgate-feedback-view';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';

let hasInitialized = false;

export default async function initializeOneNoteFeed() {
    if (!wereSamsungNotesEverSynchronized() && !hasInitialized) {
        hasInitialized = true;
        const response = await getConnectedNotesService();
        if (isSuccessStatusCode(response.status)) {
            const responseBody = await response.json();
            const connectedNotes = responseBody.value;

            if (isHostAppFeatureEnabled('floodgate') && connectedNotes.length > 0) {
                lazyLogFloodgateActivity.import().then(logFloodgateActivity => {
                    logFloodgateActivity('SamsungNotesSynced');
                });
                // Update the ponttype to onenote feed is initialized so that we do not need to run a server check again for this user
                setWereSamsungNotesEverSynchronized();
            }
        }
    }
}
