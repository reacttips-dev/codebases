import type { IExtendedTelemetryItem } from '@microsoft/1ds-core-js';
import type { CustomerContentEvent } from '@microsoft/oteljs';
import { getOneDSHelperInstance } from './getOneDSHelperInstance';

export function getOneDSCustomerContentEvent(
    event: CustomerContentEvent
): IExtendedTelemetryItem | undefined {
    let oneDSHelper = getOneDSHelperInstance();
    return oneDSHelper.getOneDSCustomerContent(event);
}
