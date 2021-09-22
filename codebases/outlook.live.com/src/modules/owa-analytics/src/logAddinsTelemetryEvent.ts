import { logOneDSDatapoint } from './OneDsWrapper';
import type { IExtendedTelemetryItem } from '@microsoft/1ds-analytics-js';

export function logAddinsTelemetryEvent(tenantToken: string, item: IExtendedTelemetryItem) {
    logOneDSDatapoint({ tenantToken, item, skipCommonProperties: true });
}
