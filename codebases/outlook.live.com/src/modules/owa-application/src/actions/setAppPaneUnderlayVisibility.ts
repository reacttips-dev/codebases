import getStore, { AppPaneUnderlayViewState } from '../store/store';
import { action, mutator } from 'satcheljs';

let setAppPaneUnderlayVisibility = action(
    'setAppPaneUnderlayVisibility',
    (
        key: string,
        isShown: boolean,
        shrinkable?: boolean,
        underlayViewState?: AppPaneUnderlayViewState
    ) => {
        return {
            key,
            isShown,
            shrinkable,
            underlayViewState,
        };
    }
);

mutator(setAppPaneUnderlayVisibility, actionMessage => {
    let store = actionMessage.underlayViewState || getStore();
    if (!actionMessage.isShown) {
        store.shrinkable.delete(actionMessage.key);
    } else {
        store.shrinkable.set(actionMessage.key, actionMessage.shrinkable);
    }

    store.isShown.set(actionMessage.key, actionMessage.isShown);
});

export default setAppPaneUnderlayVisibility;
