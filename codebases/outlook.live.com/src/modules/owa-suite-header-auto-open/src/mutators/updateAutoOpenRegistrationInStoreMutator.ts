import { updateAutoOpenRegistrationInStore } from '../actions/internalActions';
import { mutator } from 'satcheljs';
import { getStore } from '../store/store';

export const updateAutoOpenRegistrationInStoreMutator = mutator(
    updateAutoOpenRegistrationInStore,
    actionMessage => {
        getStore().autoOpenRegistrationMap.set(
            actionMessage.autoOpenPaneId,
            actionMessage.autoOpenRegistration
        );
    }
);
