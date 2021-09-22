import {
    getApp,
    getClientId,
    getRefUrl,
    getClientVersion,
    getBackend,
    getFrontend,
    getThroughEdge,
    getServerVersion,
    getDag,
    getForest,
    getLogicalRing,
    getSessionId,
    getLayout,
    getHostValue,
    scrubForPii,
} from 'owa-config';
import { getPhysicalRing, getVariantEnvironment } from 'owa-metatags';
import { isExplicitLogonSession } from 'owa-config/lib/isExplicitLogonSession';
import type { AWTEventData } from '@aria/webjs-compact-sdk';
import { getBrowserInfo, getOsInfo } from 'owa-user-agent';
import {
    getPuid,
    getTenantGuid,
    getMailboxGuid,
    getPremiumUser,
    isConsumer,
} from './sessionDiagnostics';
import type ErrorDiagnostics from './interfaces/ErrorDiagnostics';
import { getQueryStringParameter } from 'owa-querystring';

export function createBaseEvent(
    name: string,
    errorDiagnostics: ErrorDiagnostics | undefined
): AWTEventData {
    const browserInfo = getBrowserInfo();
    const osInfo = getOsInfo();
    const properties: { [index: string]: string | boolean | number | undefined | null } = {
        AppName: getApp(),
        UserAgent: window.navigator.userAgent,
        ExplicitLogon: isExplicitLogonSession(window),
        Puid: getPuid(),
        TenantGuid: getTenantGuid(),
        MBXGuid: getMailboxGuid(),
        IsPremium: getPremiumUser(),
        ClientId: getClientId(),
        RefUrl: getRefUrl(),
        ClientVersion: getClientVersion(),
        BEServer: errorDiagnostics?.ebe || getBackend(),
        FEServer: errorDiagnostics?.efe || getFrontend(),
        ThroughEdge: getThroughEdge(),
        ServiceVersion: getServerVersion(),
        Dag: getDag(),
        Forest: getForest(),
        DeployRing: getLogicalRing(),
        'Session.Id': getSessionId(),
        PhysicalRing: getPhysicalRing(),
        VariantEnv: getVariantEnvironment(),
        BrowserName: browserInfo.browser,
        Host: getHostValue(),
        BrowserVersion: browserInfo.browserVersion.toString(),
        OsName: osInfo.os,
        OsVersion: osInfo.osVersion,
        RetryStrategy: getQueryStringParameter('bO'),
        IsConsumer: isConsumer(),
        Layout: getLayout(),
    };

    if (errorDiagnostics) {
        properties.ErrorType = errorDiagnostics.et;
        properties.ErrorSource = errorDiagnostics.esrc;
        properties.Error = errorDiagnostics.err;
        properties.ExtraErrorInfo = scrubForPii(errorDiagnostics.estack);
        properties.StatusCode = errorDiagnostics.st;
        properties.RequestId = errorDiagnostics.reqid;
    }

    return { name, properties: <{ [index: string]: string | boolean }>properties };
}
