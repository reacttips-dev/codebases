import { mutatorAction } from 'satcheljs';
import { composeStore } from 'owa-mail-compose-store';
import createCLPViewState from '../../utils/clp/createCLPViewState';

export default mutatorAction('refreshCLPViewStateForExistingCompose', () => {
    [...composeStore.viewStates.values()].forEach(viewState => {
        let { protectionViewState } = viewState;
        if (protectionViewState) {
            let { clpViewState } = protectionViewState;
            protectionViewState.clpViewState = createCLPViewState(
                clpViewState?.existingLabelString,
                viewState.referenceItemId
            );
        }
    });
});
