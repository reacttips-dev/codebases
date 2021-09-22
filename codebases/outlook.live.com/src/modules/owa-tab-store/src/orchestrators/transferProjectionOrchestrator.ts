import closeTab from '../actions/closeTab';
import TabViewState, { TabType } from '../store/schema/TabViewState';
import { getStore } from '../store/tabStore';
import transferProjectionTab from 'owa-popout-v2/lib/actions/transferProjectionTab';
import { mutatorAction, orchestrator } from 'satcheljs';

orchestrator(transferProjectionTab, actionMessage => {
    const { oldTabId, newTabId } = actionMessage;
    let tabs = getStore().tabs;
    let newTab = null;
    let oldTabIndex = -1;
    for (let i = 0; i < tabs.length; i++) {
        if (oldTabIndex == -1 || newTab == null) {
            if (tabs[i].id == oldTabId) {
                oldTabIndex = i;
            }

            if (tabs[i].id == newTabId) {
                newTab = tabs[i];
            }
        }
    }

    // Transfer the tab data and then close the hidden tab which we copied the data from
    transferTabData(oldTabIndex, newTab);
    closeTab(newTab, true /*forceClose*/);
});

const transferTabData = mutatorAction(
    'transferTabData',
    (oldTabIndex: number, newTab: TabViewState) => {
        const oldTab = getStore().tabs[oldTabIndex];
        if (newTab.type != TabType.Primary) {
            // Transfer the new tab data, only keeping the state and id of the old tab
            const transferedTab = {
                ...newTab,
                id: oldTab.id,
                state: oldTab.state,
            };

            getStore().tabs[oldTabIndex] = transferedTab;
        }
    }
);
