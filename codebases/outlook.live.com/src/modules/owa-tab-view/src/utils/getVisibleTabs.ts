import activateTab from 'owa-tab-store/lib/actions/activateTab';
import TabViewState, { TabType, TabState } from 'owa-tab-store/lib/store/schema/TabViewState';
import { getStore } from 'owa-tab-store/lib/store/tabStore';
import setBlink from 'owa-tab-store/lib/actions/setBlink';
import { getTabHandler } from 'owa-tab-store/lib/utils/TabHandler';

// number of tabs we need to preserve at the front, for special tabs like primary tab and list view tab
const ALWAYS_SHOW_TAB_COUNT = 1;

const TAB_MIN_WIDTH = 89; //Derrived by min-width + margin  + 1
const ACTIVE_CHAT_TAB_WIDTH = 310; // Derrived by width + margin + border
const EXTRA_RIGHT_MARGIN = 8; // Derrived from the additional margin added on the first element.

function getVisibleTabs(): {
    totalVisibleCount: number;
    visibleTabs: TabViewState[];
    shouldShrinkActiveChatTabs: boolean;
} {
    const store = getStore();
    let visibleTabs = store.tabs.filter(viewState => {
        const handler = getTabHandler(viewState.type);
        return (
            (viewState.state == TabState.Minimized || viewState.state == TabState.Active) &&
            (!handler || !handler.canShowTab || handler.canShowTab(viewState))
        );
    });
    const totalVisibleCount = visibleTabs.length;
    const startingTabBarWidth = store.tabBarWidth;
    let tabBarWidth = startingTabBarWidth - EXTRA_RIGHT_MARGIN;
    const maxWidth = getTabsWidth(visibleTabs) - EXTRA_RIGHT_MARGIN;
    let shouldShrinkActiveChatTabs = false;

    if (maxWidth > tabBarWidth) {
        let activeTabs = [];
        let inactiveTabs = [];
        let alwaysShowTabs = visibleTabs.splice(0, ALWAYS_SHOW_TAB_COUNT);

        // split active tabs out and move to front.
        visibleTabs.forEach(tab => {
            if (tab.state == TabState.Active) {
                // Mail tabs should be in front of floating chat tabs
                if (tab.type == TabType.FloatingChat) {
                    activeTabs.push(tab);
                } else {
                    activeTabs.unshift(tab);
                }
            } else {
                inactiveTabs.push(tab);
            }
        });

        visibleTabs = [...alwaysShowTabs, ...activeTabs, ...inactiveTabs];

        let overflowIndex;
        for (
            overflowIndex = 0;
            tabBarWidth > 0 && overflowIndex < visibleTabs.length;
            overflowIndex++
        ) {
            const tabState = visibleTabs[overflowIndex];
            tabBarWidth -= shouldShrinkActiveChatTabs
                ? getIndividualTabWidth(tabState)
                : TAB_MIN_WIDTH;
            if (tabBarWidth < 0) {
                if (tabState.type == TabType.FloatingChat && tabState.isChatActive) {
                    shouldShrinkActiveChatTabs = true;
                    // We need to recalculate the width based on the fact we are now shrinking tab widths.
                    tabBarWidth = startingTabBarWidth - (overflowIndex + 1 * TAB_MIN_WIDTH);
                    if (tabBarWidth < 0) {
                        break; // Despite our best efforts, it will overflow here.
                    }
                } else {
                    break; // If it's negative, the tab bar will overflow here.
                }
            }
        }

        const overflowTabs = visibleTabs.splice(overflowIndex - 1).map(tab => {
            if (tab.type == TabType.FloatingChat && tab.isChatActive) {
                activateTab(tab);
            }
            setBlink(tab, false); // We don't want tabs in the overflow menu to blink.
            return tab;
        });

        visibleTabs.push({
            id: 'overflowMenu',
            type: TabType.OverflowMenu,
            state: TabState.Minimized,
            blink: false,
            data: overflowTabs,
            sxsId: null,
        });
    }

    return {
        totalVisibleCount,
        visibleTabs,
        shouldShrinkActiveChatTabs,
    };
}

function getTabsWidth(tabs: TabViewState[]): number {
    return tabs.reduce((accumulator, tab) => accumulator + getIndividualTabWidth(tab), 0);
}

function getIndividualTabWidth(tab: TabViewState): number {
    return tab.type == TabType.FloatingChat && tab.isChatActive
        ? ACTIVE_CHAT_TAB_WIDTH
        : TAB_MIN_WIDTH;
}

export default getVisibleTabs;
