import {
    MAILTO_HANDLER_IGNORED_COUNT,
    MAILTO_HANDLER_MAX_IGNORED_COUNT,
    LOCAL_STORAGE_TTL,
    OperationType,
} from './constants';
import { getItem, setItem, itemExists, localStorageExists } from 'owa-local-storage';
import { isBrowserOpera, isBrowserFirefox } from 'owa-user-agent';

export function doesSupportProtocolHandlerRegistration(): boolean {
    return !!window?.navigator?.registerProtocolHandler;
}

export function updateIgnoredCount() {
    // we update local storage only when user ignores the banner
    if (!itemExists(window, OperationType.AskAgainLater)) {
        const ignoredTimesString: string | null = getItem(window, MAILTO_HANDLER_IGNORED_COUNT);
        if (!ignoredTimesString) {
            setItem(window, MAILTO_HANDLER_IGNORED_COUNT, '1');
        } else {
            const ignoredTimes: number = parseInt(ignoredTimesString);
            setItem(window, MAILTO_HANDLER_IGNORED_COUNT, (ignoredTimes + 1).toString());
        }
    }
}

/* {AskAgainLater: dateTime, mailtoHandlerIgnoredCount: number} */
export function shouldShowMailtoProtocolUpsellBanner(): boolean {
    // avoid duplicate banners on these browsers
    if (isBrowserFirefox() || isBrowserOpera()) {
        return false;
    }

    if (localStorageExists(window)) {
        // we hide the banner if users click "Try It Now" or dismiss it so that it will give priority  to other banners to show
        if (itemExists(window, OperationType.TryItNow) || itemExists(window, OperationType.Close)) {
            return false;
        }
        // we have shown the banner and user selected "Ask me later", we re-show the banner after certain period
        else if (itemExists(window, OperationType.AskAgainLater)) {
            return (
                new Date().getTime() - Number(getItem(window, OperationType.AskAgainLater)) >=
                LOCAL_STORAGE_TTL
            );
        }
        // banner is shown for the first time or it has been ignored
        else {
            const ignoredCountString: string | null = getItem(window, MAILTO_HANDLER_IGNORED_COUNT);
            // banner first time shown
            if (!ignoredCountString) {
                return true;
            }
            // banner was ignored previously
            else {
                // we no longer show the banner if the times user has ignored it exceeds maximum count
                return parseInt(ignoredCountString) <= MAILTO_HANDLER_MAX_IGNORED_COUNT;
            }
        }
    }
    return false;
}
