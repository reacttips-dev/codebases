import type { TelemetryEvent } from '@microsoft/oteljs';
import {
    addOTelColumnDataEventAppHighlighted,
    getOneDSTelemetryEvent,
    DataCategories_ProductServiceUsage,
    DiagnosticLevel_RequiredServiceData,
} from '../index';
import { lazyLogAddinsTelemetryEvent } from 'owa-analytics';
import type { ExtensibilityModeEnum } from 'owa-addins-types';
import { ariaTenantToken, nexusTenantToken } from './tokenConstants';

export async function logAppHighlightedTelemetry(
    addinId: string,
    extMode: ExtensibilityModeEnum
): Promise<void> {
    let event: TelemetryEvent = {
        eventName: 'Office.Extensibility.Host.AppHighlighted',
        telemetryProperties: {
            ariaTenantToken: ariaTenantToken,
            nexusTenantToken: nexusTenantToken,
        },
        eventFlags: {
            dataCategories: DataCategories_ProductServiceUsage,
            diagnosticLevel: DiagnosticLevel_RequiredServiceData,
        },
        timestamp: Date.now(),
    };
    const oneDSEvent = getOneDSTelemetryEvent(event);
    addOTelColumnDataEventAppHighlighted(oneDSEvent, addinId, extMode);
    if (oneDSEvent.iKey) {
        await lazyLogAddinsTelemetryEvent.importAndExecute(
            oneDSEvent.iKey /* tenantToken */,
            oneDSEvent
        );
    }
}
