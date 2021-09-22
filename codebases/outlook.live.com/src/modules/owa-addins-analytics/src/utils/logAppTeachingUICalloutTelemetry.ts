import type { TelemetryEvent } from '@microsoft/oteljs';
import {
    addOTelColumnDataEventAppTeachingUICallout,
    getOneDSTelemetryEvent,
    DataCategories_ProductServiceUsage,
    DiagnosticLevel_RequiredServiceData,
} from '../index';
import type {
    ExtensibilityModeEnum,
    AddinTeachingUICalloutGoalEnum,
    AddinTeachingUICalloutActionEnum,
} from 'owa-addins-types';
import { lazyLogAddinsTelemetryEvent } from 'owa-analytics';
import { ariaTenantToken, nexusTenantToken } from './tokenConstants';

export async function logAppTeachingUICalloutTelemetry(
    addinId: string,
    goal: AddinTeachingUICalloutGoalEnum,
    action: AddinTeachingUICalloutActionEnum,
    extMode: ExtensibilityModeEnum
): Promise<void> {
    let event: TelemetryEvent = {
        eventName: 'Office.Extensibility.Host.AppTeachingUICallout',
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
    addOTelColumnDataEventAppTeachingUICallout(oneDSEvent, addinId, goal, action, extMode);
    if (oneDSEvent.iKey) {
        await lazyLogAddinsTelemetryEvent.importAndExecute(
            oneDSEvent.iKey /* tenantToken */,
            oneDSEvent
        );
    }
}
