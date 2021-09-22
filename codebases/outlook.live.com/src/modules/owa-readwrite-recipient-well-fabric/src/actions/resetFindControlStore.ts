import { mutatorAction } from 'satcheljs';
import { getStore, storeInitialViewState } from '../store/store';

export const resetStore = mutatorAction('resetFindControl', () => {
    getStore().viewState = {
        ...storeInitialViewState,
        findResultSet: [...storeInitialViewState.findResultSet],
    };
});
