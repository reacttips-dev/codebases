import addChatTab from './addChatTabActionCreator';
import onHideNotificationReceived from './onHideNotificationReceived';
import onNotificationReceived from './onNotificationReceived';
import SwcEventNames from './swcEventNames';
import isSkypeInTabsEnabled from './isSkypeInTabsEnabled';
import updateIsGlimpseOpen from '../actions/updateIsGlimpseOpen';
import updateIsSwcInitialized from '../actions/updateIsSwcInitialized';
import updateUnreadConversationCount from '../actions/updateUnreadConversationCount';
import type { MessagingSetting } from '../store/schema/swcTypes';
import { getIsDarkTheme } from 'owa-fabric-theme';
import { getCurrentLanguage } from 'owa-localize';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import { getCurrentThemeId } from 'owa-theme';
import { getAccessTokenforResource } from 'owa-tokenprovider';
import { dispatch } from 'satcheljs';

const OUTLOOK_DATA_STYLE_VALUE = 'outlook';
const DARK_MODE_THEME_NAME = 'dark';

const messagingSettings: MessagingSetting = {
    IsVirtual: true,
    ParallelView: isSkypeInTabsEnabled() ? false : true,
    Style: OUTLOOK_DATA_STYLE_VALUE,
    CanCollapse: true,
};

export default function initializeSkype(chatWrapper: HTMLElement) {
    let theme = getIsDarkTheme() ? DARK_MODE_THEME_NAME : getCurrentThemeId();

    if (window.swc) {
        window.swc.init(null, getInitParams()).then(() => {
            updateIsSwcInitialized(true);
            window.swc.API.registerEvent(
                SwcEventNames.ApiReceivedNotification,
                onNotificationReceived
            );
            window.swc.API.registerEvent(
                SwcEventNames.ApiUnreadConversationUpdate,
                onUnreadConversationUpdate
            );
            window.swc.API.registerEvent(
                SwcEventNames.ApiHideNotification,
                onHideNotificationReceived
            );
            window.swc.API.registerEvent(SwcEventNames.ApiRecentItemSelected, onRecentItemSelected);
            window.swc.create('chat', messagingSettings, chatWrapper);
            if (isSkypeInTabsEnabled()) {
                window.swc
                    .getRecents()
                    .then(recentsProxy => recentsProxy.setOptions({ PreventOpenChat: true }));
            }
            window.swc.setTheme(theme);
        });
    }
}

function getInitParams(): any {
    let defaultParams = {
        toLoadUnreadConversationsCount: true,
        locale: getCurrentLanguage(),
    };

    if (isConsumer()) {
        return defaultParams;
    } else {
        return {
            tokenProvider: getToken,
            tokenType: 'aad',
            ...defaultParams,
        };
    }
}

// SWC will need multiple AAD tokens for different resources to connect with Teams
// We are currently giving them a tokenProvider as a short term solution,
// while they investigate getting the required AAD tokens through their client (similiar to SWX)
function getToken(resourceAudience: string): Promise<string> {
    return getAccessTokenforResource(resourceAudience, 'SkypeApi');
}

function onRecentItemSelected(id: string) {
    updateIsGlimpseOpen(false);
    if (isSkypeInTabsEnabled()) {
        dispatch(addChatTab(id));
    }
}

function onUnreadConversationUpdate(value: number) {
    updateUnreadConversationCount(value);
}
