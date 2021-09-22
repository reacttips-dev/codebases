import {
    ApplicationInsights,
    IExtendedConfiguration,
    IExtendedTelemetryItem,
    NRT_PROFILE,
    IPayloadData,
    IPlugin,
} from '@microsoft/1ds-analytics-js';
import { DataContexts, PrivacyGuardPlugin } from '@microsoft/1ds-privacy-guard-js';
import { getClientVersion, getSessionId, getApp, scrubForPii } from 'owa-config';
import { getVariantEnvironment, getAriaUrl, AriaUrlSuffix } from 'owa-metatags';
import { getUserConfiguration } from 'owa-session-store';
import type { CustomDataMap } from 'owa-analytics-types';
import { isFeatureEnabled } from 'owa-feature-flags';
import addCommonProperties from './utils/addCommonProperties';
import type { InternalAnalyticOptions } from './types/InternalAnalyticOptions';
import pako from 'pako';

type DatapointParams = {
    tenantToken: string;
    item: IExtendedTelemetryItem;
    analyticsOptions?: InternalAnalyticOptions;
    overrideEndpointUrl?: string;
    skipCommonProperties?: boolean;
};

const insights: { [tenant: string]: ApplicationInsights } = {};
export function logOneDSDatapoint({
    tenantToken,
    item,
    analyticsOptions,
    overrideEndpointUrl,
    skipCommonProperties = false,
}: DatapointParams) {
    if (!insights[tenantToken]) {
        const userConfiguration = getUserConfiguration();

        insights[tenantToken] = new ApplicationInsights();
        const config: IExtendedConfiguration = {
            instrumentationKey: tenantToken,
            endpointUrl: overrideEndpointUrl || getCollectorUrl(),
            disableCookiesUsage: true, // This stops sending installId in the SDK section
            channelConfiguration: {
                payloadPreprocessor: gzipFunc,
            },
        };

        let plugins: IPlugin[] | undefined = undefined;
        if (isFeatureEnabled('fwk-oneDs-privacyGuard')) {
            const privacyGuard: PrivacyGuardPlugin = new PrivacyGuardPlugin();
            const sessionSettings = userConfiguration?.SessionSettings;

            const dataCtx: DataContexts = {
                UserName: sessionSettings?.UserDisplayName,
                UserAlias: sessionSettings?.UserPrincipalName?.split('@')[0],
            };

            config.extensionConfig = {
                [privacyGuard.identifier]: {
                    context: dataCtx,
                },
            };
            plugins = [privacyGuard];
        }

        insights[tenantToken].initialize(config, plugins);
        insights[tenantToken].getPostChannel()?._setTransmitProfile(NRT_PROFILE);

        const propertyManager = insights[tenantToken].getPropertyManager();
        const context = propertyManager.getPropertiesContext();

        if (!skipCommonProperties) {
            addCommonProperties(propertyManager, analyticsOptions);
        }

        if (context) {
            context.app.ver = getClientVersion();
            context.session.setId(getSessionId());
            context.device.localId = undefined;
            context.web.domain = undefined;
        }
    }

    if (item.data) {
        item.data.App = getApp();
        const hostTelemetry = scrubForPii(analyticsOptions?.opxSessionInfo?.hostTelemetry);
        if (hostTelemetry) {
            item.data.HostTelemetry = hostTelemetry;
        }
    }
    insights[tenantToken].track(item);
}

function gzipFunc(payload: IPayloadData, cb: (data: IPayloadData) => void) {
    try {
        const dataToSend = pako.gzip(payload.data);
        const headers = payload.headers || {};
        headers['Content-Encoding'] = 'gzip';
        payload.headers = headers;
        payload.data = dataToSend;
        cb(payload);
    } catch (err) {
        // send original payload on error
        return cb(payload);
    }
}

export function oneDSFlush() {
    Object.values(insights).forEach(analytics => {
        if (analytics) {
            try {
                analytics.getPostChannel().flush();
            } catch {}
        }
    });
}

export function createEvent(eventName: string, props?: CustomDataMap): IExtendedTelemetryItem {
    return {
        name: eventName,
        data: props ? JSON.parse(JSON.stringify(props)) : {},
    };
}

function getCollectorUrl(): string | undefined {
    const ariaUrl = getAriaUrl();
    if (ariaUrl) {
        return ariaUrl;
    }

    const environment = getVariantEnvironment();
    switch (environment) {
        case 'BlackForest':
            return 'https://emea.events.data.microsoft.com/' + AriaUrlSuffix;
        case 'GccHigh':
            return 'https://tb.events.data.microsoft.com/' + AriaUrlSuffix;
        case 'DoD':
            return 'https://pf.events.data.microsoft.com/' + AriaUrlSuffix;
        case 'AG08':
            return 'https://office.collector.azure.eaglex.ic.gov/' + AriaUrlSuffix;
        case 'AG09':
            return 'https://office.collector.azure.microsoft.scloud/' + AriaUrlSuffix;
        default:
            return undefined;
    }
}
