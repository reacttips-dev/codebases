import { action, orchestrator, mutatorAction } from 'satcheljs';
import { getStore } from '../store/tabStore';
import activateTab from '../actions/activateTab';
import type TabViewState from '../store/schema/TabViewState';

export let addTabViewState = action(
    'ADD_TAB_VIEW_STATE',
    (viewState: TabViewState, makeActive: boolean) => ({
        viewState,
        makeActive,
    })
);

export default addTabViewState;

// Put the orchestrator here because we need it to be sync so that popout can work correctly
orchestrator(addTabViewState, actionMessage => {
    const { viewState, makeActive } = actionMessage;
    const store = getStore();
    addTabToStore(viewState);

    if (makeActive) {
        // Use the reference from the store (http://aka.ms/mobx4)
        activateTab(store.tabs[store.tabs.length - 1]);
    }
});

const addTabToStore = mutatorAction('addTabToStore', (viewState: TabViewState) => {
    const store = getStore();
    store.tabs.push(viewState);
});
