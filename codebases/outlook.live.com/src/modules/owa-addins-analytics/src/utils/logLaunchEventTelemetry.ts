import type { TelemetryEvent } from '@microsoft/oteljs';
import {
    addOTelColumnDataEventLaunchEvent,
    getOneDSTelemetryEvent,
    DataCategories_ProductServiceUsage,
    DiagnosticLevel_RequiredServiceData,
} from '../index';
import type { IAutoRunAddinCommand } from 'owa-addins-store';
import { lazyLogAddinsTelemetryEvent } from 'owa-analytics';
import { ariaTenantToken, nexusTenantToken } from './tokenConstants';

export async function logLaunchEventTelemetry(
    autoRunAddinCommand: IAutoRunAddinCommand,
    hostItemIndex: string,
    controlId: string
): Promise<void> {
    let event: TelemetryEvent = {
        eventName: 'Office.Extensibility.Host.LaunchEvent',
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
    addOTelColumnDataEventLaunchEvent(oneDSEvent, autoRunAddinCommand, hostItemIndex, controlId);
    if (oneDSEvent.iKey) {
        await lazyLogAddinsTelemetryEvent.importAndExecute(
            oneDSEvent.iKey /* tenantToken */,
            oneDSEvent
        );
    }
}
