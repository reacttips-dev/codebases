import getStore, { AppPaneUnderlayViewState } from '../store/store';

let reducer = (sum, isShown) => {
    return sum || isShown;
};

export default function isAppPaneUnderlayExpanded(underlay?: AppPaneUnderlayViewState) {
    const store = underlay || getStore();
    return [...store.isShown.values()].reduce(reducer, false);
}
