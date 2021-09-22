import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { updatePontTypeValue } from './updatePontTypeValue';

// TODO: Replace this with the ponttype type from Substrate after the Substrate code is checked in
// 1073741824 is 0b1000000000000000000000000000000
const samsungNotesEverSynchronizedPontType = 1073741824;

export function wereSamsungNotesEverSynchronized(): boolean {
    // Check the oneNoteFeedInitializedPontType pont type bit
    // If it is 0, it means we have not initialized oneNote feed for this user yet, we will do a server-side call to check it
    // If it is 1, it means we have initialized oneNote feed for this user, we do not need to another server-side call
    let currentUserPonts = getUserConfiguration().UserOptions.NewEnabledPonts;
    return (
        (currentUserPonts & samsungNotesEverSynchronizedPontType) !=
        samsungNotesEverSynchronizedPontType
    );
}

export function setWereSamsungNotesEverSynchronized() {
    let currentUserPonts = getUserConfiguration().UserOptions.NewEnabledPonts;
    currentUserPonts &= ~samsungNotesEverSynchronizedPontType;
    updatePontTypeValue(currentUserPonts);
}
