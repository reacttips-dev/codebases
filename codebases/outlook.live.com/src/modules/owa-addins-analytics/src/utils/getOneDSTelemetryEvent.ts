import type { IExtendedTelemetryItem } from '@microsoft/1ds-core-js';
import type { TelemetryEvent } from '@microsoft/oteljs';
import { getOneDSHelperInstance } from './getOneDSHelperInstance';

export function getOneDSTelemetryEvent(event: TelemetryEvent): IExtendedTelemetryItem | undefined {
    let oneDSHelper = getOneDSHelperInstance();
    return oneDSHelper.getOneDSTelemetryEvent(event);
}
