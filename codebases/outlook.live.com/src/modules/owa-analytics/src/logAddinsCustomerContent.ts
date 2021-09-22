import { logOneDSDatapoint } from './OneDsWrapper';
import type { IExtendedTelemetryItem } from '@microsoft/1ds-analytics-js';
import { getVariantEnvironment } from 'owa-metatags';
import { isFeatureEnabled } from 'owa-feature-flags';

export function logAddinsCustomerContent(tenantToken: string, item: IExtendedTelemetryItem) {
    if (!isFeatureEnabled('addin-sendCustomerContent')) {
        return;
    }

    const endpointUrl = getCustomerContentCollectorUrl();

    if (!endpointUrl) {
        // We only log Customer Content telemetry event for 'Prod'
        // and 'Dogfood'. For other environments, we drop it.
        return;
    }
    logOneDSDatapoint({ tenantToken, item, overrideEndpointUrl: endpointUrl });
}

function getCustomerContentCollectorUrl(): string | undefined {
    const environment = getVariantEnvironment();

    switch (environment) {
        case 'Prod':
        case 'Dogfood':
            return 'https://office-c.events.data.microsoft.com/OneCollector/1.0/';
        default:
            return undefined;
    }
}
