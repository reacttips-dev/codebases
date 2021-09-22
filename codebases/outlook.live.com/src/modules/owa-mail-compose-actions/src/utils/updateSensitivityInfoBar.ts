import type { ComposeViewState } from 'owa-mail-compose-store';
import addInfoBarMessage from 'owa-info-bar/lib/actions/addInfoBarMessage';
import removeInfoBarMessage from 'owa-info-bar/lib/actions/removeInfoBarMessage';

// VSO 32823: Instead of passing in the composeViewState, we should pass in an identifier that can be used to look up the
// composeViewState from the store. As actions are dispatched, there is a possibility we no longer have a reference to the
// most recent version of the composeViewState object by the time we execute this code. Whenever objects need to be mutated,
// they should be fetched from the store.
export default function updateSensitivityInfoBar(composeViewState: ComposeViewState) {
    if (!composeViewState.sensitivity || composeViewState.sensitivity == 'Normal') {
        removeInfoBarMessage(composeViewState, 'infoSensitivity');
    } else {
        addInfoBarMessage(composeViewState, 'infoSensitivity');
    }
}
