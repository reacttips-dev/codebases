import { setTimePanelConfigLoadState } from '../actions/internalActions';
import { getStore } from '../store/store';
import { mutator } from 'satcheljs';

export const setTimePanelConfigLoadStateMutator = mutator(
    setTimePanelConfigLoadState,
    actionMessage => {
        const { userIdentity, loadState } = actionMessage;
        getStore().configLoadStates.set(userIdentity, loadState);
    }
);
