import { mutator } from 'satcheljs';
import { onSmimeOptionsDirty } from '../actions/smimeActions';

/**
 * Mutator that sets the S/MIME options to the composeviewstate.
 */
export default mutator(onSmimeOptionsDirty, actionMessage => {
    const { viewState, shouldEncryptMessageAsSmime, shouldSignMessageAsSmime } = actionMessage;
    const { smimeViewState } = viewState;
    if (smimeViewState) {
        smimeViewState.shouldEncryptMessageAsSmime = shouldEncryptMessageAsSmime;
        smimeViewState.shouldSignMessageAsSmime = shouldSignMessageAsSmime;
        viewState.isDirty = true;
    }
});
