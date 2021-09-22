import getStore, { AppPaneUnderlayViewState } from '../store/store';

let reducer = (sum, shrinkable) => {
    return sum || shrinkable;
};

export default function isAppPaneUnderlayShrinkable(underlay?: AppPaneUnderlayViewState) {
    const store = underlay || getStore();
    return [...store.shrinkable.values()].reduce(reducer, false);
}
