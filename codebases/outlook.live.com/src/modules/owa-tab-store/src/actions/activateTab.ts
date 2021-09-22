import TabViewState, { TabType, TabState } from '../store/schema/TabViewState';
import getActiveContentTab from '../utils/getActiveContentTab';
import setTabIsShown from './setTabIsShown';
import toggleChatTab from './toggleChatTab';
import { PerformanceDatapoint } from 'owa-analytics';
import { action } from 'satcheljs/lib/legacy';
import { getTabHandler } from '../utils/TabHandler';

export default action('activateTab')(function (viewState: TabViewState, isUserAction?: boolean) {
    const dp = new PerformanceDatapoint('TabViewActivateTab', { isVerbose: true });
    dp.addCustomData([viewState.type, isUserAction]);
    setTabIsShown(viewState, true /*isShown*/);

    switch (viewState.type) {
        case TabType.FloatingChat:
            toggleChatTab(viewState);
            return;
        case TabType.Primary:
        case TabType.OverflowMenu:
        case TabType.SecondaryReadingPane:
        case TabType.MailCompose:
            if (viewState.state != TabState.Active) {
                const activeTab = getActiveContentTab();

                if (activeTab) {
                    activeTab.state = TabState.Minimized;
                    const handler = getTabHandler(activeTab.type);
                    if (handler?.onDeactivate) {
                        handler.onDeactivate(activeTab);
                    }
                }

                if (viewState) {
                    viewState.state = TabState.Active;
                    viewState.blink = false;

                    const handler = getTabHandler(viewState.type);
                    if (handler?.onActivate) {
                        handler.onActivate(viewState);
                    }
                }
            }
    }
    dp.end();
});
