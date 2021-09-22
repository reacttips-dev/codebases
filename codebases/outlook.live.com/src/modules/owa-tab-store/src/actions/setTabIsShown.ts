import TabViewState, { TabState } from '../store/schema/TabViewState';
import activateTab from './activateTab';
import { action } from 'satcheljs/lib/legacy';
import { getStore } from '../store/tabStore';

function getNextVisibleTab(tab: TabViewState): TabViewState {
    const tabs = getStore().tabs;
    const startIndex = Math.max(tabs.indexOf(tab), 0);
    const nextActiveTab = tabs.filter(
        t => t.id == tab.parentTabId && t.state == TabState.Minimized
    )[0];

    if (nextActiveTab) {
        return nextActiveTab;
    }

    for (let i = startIndex; i < tabs.length; i++) {
        if (tabs[i].state == TabState.Minimized) {
            return tabs[i];
        }
    }

    for (let i = startIndex - 1; i >= 0; i--) {
        if (tabs[i].state == TabState.Minimized) {
            return tabs[i];
        }
    }

    return null;
}

export default action('setTabIsShown')(function (viewState: TabViewState, isShown: boolean) {
    switch (viewState.state) {
        case TabState.Hidden:
            if (isShown) {
                viewState.state = TabState.Minimized;
                viewState.blink = true;
            }
            break;

        case TabState.Minimized:
        case TabState.Active:
        case TabState.Popout:
            if (!isShown) {
                const nextActiveTab =
                    viewState.state == TabState.Active && getNextVisibleTab(viewState);

                if (nextActiveTab) {
                    activateTab(nextActiveTab);
                }

                viewState.state = TabState.Hidden;
            }
            break;
    }
});
