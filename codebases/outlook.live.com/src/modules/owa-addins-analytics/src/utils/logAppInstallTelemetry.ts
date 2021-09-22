import type { TelemetryEvent } from '@microsoft/oteljs';
import {
    addOTelColumnDataEventAppInstall,
    getOneDSTelemetryEvent,
    DataCategories_ProductServiceUsage,
    DiagnosticLevel_RequiredServiceData,
} from '../index';
import { lazyLogAddinsTelemetryEvent } from 'owa-analytics';
import { ariaTenantToken, nexusTenantToken } from './tokenConstants';

export async function logAppInstallTelemetry(addinId: string): Promise<void> {
    let event: TelemetryEvent = {
        eventName: 'Office.Extensibility.Host.AppInstall',
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
    addOTelColumnDataEventAppInstall(oneDSEvent, addinId);
    if (oneDSEvent.iKey) {
        await lazyLogAddinsTelemetryEvent.importAndExecute(
            oneDSEvent.iKey /* tenantToken */,
            oneDSEvent
        );
    }
}
