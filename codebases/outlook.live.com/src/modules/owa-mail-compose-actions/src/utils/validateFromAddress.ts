import type { ComposeViewState, FromViewState } from 'owa-mail-compose-store';
import changeFrom from '../actions/changeFrom';

// Returns true if the from address is valid, false otherwise
export default function validateFromAddress(composeViewState: ComposeViewState): boolean {
    const fromViewState: FromViewState = composeViewState.fromViewState;
    // The user will likely just leave the From address as is, which is already valid
    // In this case, fromWellFindControlViewState will be null
    if (fromViewState?.fromWellFindControlViewState) {
        if (fromViewState.isFromShown) {
            return fromViewState.isFromValid;
        } else {
            // In the case that the user changed the from address, but then hid the From well,
            // send from the primary account address
            if (
                fromViewState.sendAsEmailAddresses &&
                fromViewState.sendAsEmailAddresses.length > 0
            ) {
                const primaryAccountAddress = fromViewState.sendAsEmailAddresses[0];
                changeFrom(fromViewState, primaryAccountAddress);
            }
        }
    }

    return true;
}
