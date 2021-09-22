import { mutatorAction } from 'satcheljs';
import type OwaUserConfiguration from 'owa-service/lib/contract/OwaUserConfiguration';
import store from '../store/store';

export const updateUserConfiguration: (
    updateFunction: (userConfig: OwaUserConfiguration) => void
) => void = mutatorAction(
    'setUserConfiguration',
    (updateFunction: (userConfig: OwaUserConfiguration) => void) => {
        updateFunction(store.userConfiguration);
    }
);
