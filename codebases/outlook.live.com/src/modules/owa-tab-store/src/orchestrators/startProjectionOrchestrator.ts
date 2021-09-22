import setTabIsShown from '../actions/setTabIsShown';
import TabViewState, { TabState, TabType } from '../store/schema/TabViewState';
import getTabById from '../utils/getTabById';
import { getTabHandler } from '../utils/TabHandler';
import startProjection from 'owa-popout-v2/lib/actions/startProjection';
import { mutatorAction, orchestrator } from 'satcheljs';

orchestrator(startProjection, actionMessage => {
    const { tabId, targetWindow } = actionMessage;
    const tab = getTabById(tabId);
    if (tab) {
        switch (tab.type) {
            case TabType.SecondaryReadingPane:
            case TabType.MailCompose:
            case TabType.SxS:
            case TabType.CalendarCompose:
                // Hide the tab to make sure another tab is activated when this is active tab
                setTabIsShown(tab, false /*isShown*/);
                popoutTab(tab);

                const handler = getTabHandler(tab.type);
                if (handler?.onPopout) {
                    handler.onPopout(tab, targetWindow);
                }

                break;

            case TabType.FloatingChat:
            case TabType.OverflowMenu:
            case TabType.Primary:
                throw new Error("Can't popout tab with type " + tab.type);
        }
    }
});

const popoutTab = mutatorAction('PopoutTab', (tab: TabViewState) => {
    tab.state = TabState.Popout;
});
