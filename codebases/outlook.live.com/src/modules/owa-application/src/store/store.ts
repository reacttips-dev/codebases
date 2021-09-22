import { ObservableMap } from 'mobx';
import { createStore } from 'satcheljs';

export interface AppPaneUnderlayViewState {
    isShown: ObservableMap<string, boolean>;
    shrinkable: ObservableMap<string, boolean>;
}

export default createStore<AppPaneUnderlayViewState>('appPaneUnderlayViewState', {
    isShown: new ObservableMap(),
    shrinkable: new ObservableMap(),
});
