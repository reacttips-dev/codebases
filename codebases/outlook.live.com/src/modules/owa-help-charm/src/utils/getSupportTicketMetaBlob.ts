import * as HelpCharmConstants from '../utils/HelpCharmConstants';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import { getCurrentCulture } from 'owa-localize';
import { getApp, getClientVersion, getLogicalRing } from 'owa-config';
import { isPremiumConsumer } from 'owa-session-store';

type metaDictionaryType = { [metaKey: string]: string };

export function getSupportTicketMetaBlob(): string {
    let userConfig = getUserConfiguration();

    let sessionStart, sessionLength;
    if (window.performance) {
        let sessionStartTime = new Date();
        sessionStartTime.setTime(window.performance.timing.fetchStart);
        sessionStart = String(sessionStartTime);
        sessionLength = String(
            (new Date().getTime() - window.performance.timing.fetchStart) / 60000
        );
    }

    let jsHeapSizeLimit: string = HelpCharmConstants.NotApplicableConstant;
    let totalJSHeapSize: string = HelpCharmConstants.NotApplicableConstant;
    let usedJSHeapSize: string = HelpCharmConstants.NotApplicableConstant;
    let memoryUsageRatio: string = HelpCharmConstants.NotApplicableConstant;
    let isHighPrecisionMemory: string = HelpCharmConstants.NotApplicableConstant;
    let focusedInboxMeta: metaDictionaryType = {};
    let metaDictionary: metaDictionaryType = {};

    /* tslint:disable:no-string-literal */
    let windowPerfMemory = window.performance['memory'];

    if (windowPerfMemory) {
        jsHeapSizeLimit = String(
            (windowPerfMemory.jsHeapSizeLimit / HelpCharmConstants.bytesToMb) | 0
        );
        totalJSHeapSize = String(
            (windowPerfMemory.totalJSHeapSize / HelpCharmConstants.bytesToMb) | 0
        );
        usedJSHeapSize = String(
            (windowPerfMemory.usedJSHeapSize / HelpCharmConstants.bytesToMb) | 0
        );
        memoryUsageRatio = String(
            windowPerfMemory.usedJSHeapSize / windowPerfMemory.jsHeapSizeLimit
        );
        isHighPrecisionMemory = String(windowPerfMemory.usedJSHeapSize % 1000 != 0);
    }
    focusedInboxMeta['IsFocusedInboxEnabled'] = String(
        userConfig.UserOptions.IsFocusedInboxEnabled
    );
    focusedInboxMeta['IsFocusedInboxCapable'] = String(
        userConfig.UserOptions.IsFocusedInboxCapable
    );
    focusedInboxMeta['FocusedInboxServerOverride'] = String(
        userConfig.UserOptions.FocusedInboxServerOverride
    );
    focusedInboxMeta['IsFocusedInboxOnAdminLastUpdateTime'] =
        userConfig.UserOptions.IsFocusedInboxOnAdminLastUpdateTime;
    focusedInboxMeta['IsFocusedInboxOnLastUpdateTime'] =
        userConfig.UserOptions.IsFocusedInboxOnLastUpdateTime;

    metaDictionary['Name'] = userConfig.SessionSettings.UserDisplayName;
    metaDictionary['Country'] = userConfig.UserOptions.TimeZone;
    metaDictionary['Premium Consumer'] = String(isPremiumConsumer());
    metaDictionary['Memory usage ratio [0,1]'] = String(memoryUsageRatio);
    metaDictionary['Memory.IsHighPrecision'] = isHighPrecisionMemory;
    metaDictionary['Memory.JSHeapSizeLimit (MB)'] = jsHeapSizeLimit;
    metaDictionary['Memory.TotalJSHeapSize (MB)'] = totalJSHeapSize;
    metaDictionary['Memory.UsedJSHeapSize (MB)'] = usedJSHeapSize;
    metaDictionary['Platform'] = window.navigator.platform;
    metaDictionary['Browser language'] = window.navigator.language;
    metaDictionary['Cookie enabled'] = String(window.navigator.cookieEnabled);
    metaDictionary['User agent'] = window.navigator.userAgent;
    // eslint-disable-next-line @microsoft/sdl/no-cookies
    metaDictionary['Document.Cookie'] = document.cookie;
    metaDictionary['Mailbox culture'] = getCurrentCulture();
    metaDictionary['OWA layout'] = getApp();
    metaDictionary['OWA UTC Start Time'] = sessionStart;
    metaDictionary['Session length'] = sessionLength;
    metaDictionary['Focused Inbox settings'] = JSON.stringify(focusedInboxMeta);
    metaDictionary['Versioning'] = getClientVersion();
    metaDictionary['Ring'] = getLogicalRing();
    metaDictionary['UserType'] = isConsumer() ? 'Consumer' : 'Business';
    /* tslint:enable:no-string-literal */

    return JSON.stringify(metaDictionary);
}
