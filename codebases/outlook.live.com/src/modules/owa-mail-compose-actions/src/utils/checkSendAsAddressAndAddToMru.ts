import updateSendAsMruAddresses from '../services/updateSendAsMruAddresses';
import type { FromViewState } from 'owa-mail-compose-store';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { updateUserConfiguration } from 'owa-session-store/lib/actions/updateUserConfiguration';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';

const MAX_SEND_AS_MRU_ADDRESSES_COUNT = 10;

/**
 * Check the send as address and add to MRU if:
 * 1. This is not a Consumer account (MRU is Enterprise only)
 * 2. The From well is showing
 * 3. The current send as address is not the user's default address or connected account
 * 4. The current send as address is not already in the user's MRU send as addresses
 * @pre current send as address has been validated on the client and the user has permission to send from it
 * @param fromViewState, the view state for the From well, contains the current send as address
 */
export default function checkSendAsAddressAndAddToMru(fromViewState: FromViewState) {
    if (!isConsumer() && fromViewState && fromViewState.isFromShown) {
        const currentSendAsAddress = fromViewState.from?.email?.EmailAddress;
        if (
            currentSendAsAddress &&
            !includesIgnoreCase(currentSendAsAddress, fromViewState.sendAsEmailAddresses) &&
            !includesIgnoreCase(currentSendAsAddress, getSendAsMruAddresses())
        ) {
            addSendAsAddressToMru(currentSendAsAddress);
        }
    }
}

function includesIgnoreCase(targetAddress: string, addresses: readonly string[]): boolean {
    const addressToCompare = targetAddress.toLowerCase();

    if (addresses && addresses.length > 0) {
        for (let address of addresses) {
            if (addressToCompare === address.toLowerCase()) {
                return true;
            }
        }
    }

    return false;
}

export function addSendAsAddressToMru(sendAsAddress: string) {
    let sendAsMruAddresses: string[] = [];

    // The new address should be placed at the beginning of the list, so that the
    // MRU is shown in chronological order (newest on top)
    sendAsMruAddresses.push(sendAsAddress);

    // Append the existing MRU addresses until we have reached the maximum count
    const initialSendAsMruAddresses = getSendAsMruAddresses();
    for (
        let i = 0;
        i < initialSendAsMruAddresses.length &&
        sendAsMruAddresses.length < MAX_SEND_AS_MRU_ADDRESSES_COUNT;
        i++
    ) {
        const existingSendAsMruAddress = initialSendAsMruAddresses[i];
        sendAsMruAddresses.push(existingSendAsMruAddress);
    }

    // Update local user config store and save to server
    updateUserConfiguration(config => {
        config.UserOptions.SendAsMruAddresses = sendAsMruAddresses;
    });
    updateSendAsMruAddresses();
}

export function getSendAsMruAddresses(): readonly string[] {
    return getUserConfiguration().UserOptions.SendAsMruAddresses || [];
}
