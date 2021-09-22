import {
    AWT_NEAR_REAL_TIME,
    AWTLogManager,
    AWT_COLLECTOR_URL_EUROPE,
    AWT_COLLECTOR_URL_USGOV_DOJ,
    AWT_COLLECTOR_URL_USGOV_DOD,
    AWTLogger,
} from '@aria/webjs-sdk';
import { getVariantEnvironment, getAriaUrl, AriaUrlSuffix } from 'owa-metatags';
import type { CustomDataMap } from 'owa-analytics-types';
import { getClientVersion } from 'owa-config';

let initialized = false;
export function getLogger(tenantToken: string): AWTLogger {
    if (!initialized) {
        AWTLogManager.setTransmitProfile(AWT_NEAR_REAL_TIME);

        const collectorUri = getCollectorUrl();
        if (collectorUri) {
            AWTLogManager.initialize(tenantToken, { collectorUri });
        } else {
            AWTLogManager.initialize(tenantToken);
        }
        const context = AWTLogManager.getSemanticContext();
        context.setAppVersion(getClientVersion());
    }
    return AWTLogManager.getLogger(tenantToken);
}

export function createEventProperties(eventName?: string, props?: CustomDataMap) {
    return {
        name: eventName,
        properties: props ? JSON.parse(JSON.stringify(props)) : {},
    };
}

export function ariaFlush() {
    AWTLogManager.flush(() => {});
}

function getCollectorUrl(): string | undefined {
    const ariaUrl = getAriaUrl();
    if (ariaUrl) {
        return ariaUrl;
    }

    const environment = getVariantEnvironment();
    switch (environment) {
        case 'BlackForest':
            return AWT_COLLECTOR_URL_EUROPE;
        case 'GccHigh':
            return AWT_COLLECTOR_URL_USGOV_DOJ;
        case 'DoD':
            return AWT_COLLECTOR_URL_USGOV_DOD;
        case 'AG08':
            return 'https://office.collector.azure.eaglex.ic.gov/' + AriaUrlSuffix;
        case 'AG09':
            return 'https://office.collector.azure.microsoft.scloud/' + AriaUrlSuffix;
        default:
            return undefined;
    }
}
