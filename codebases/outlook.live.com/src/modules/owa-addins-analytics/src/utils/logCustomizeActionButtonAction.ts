import type { TelemetryEvent } from '@microsoft/oteljs';
import {
    addOTelColumnDataEventCustomizeActionButtonAction,
    getOneDSTelemetryEvent,
    DataCategories_ProductServiceUsage,
    DiagnosticLevel_RequiredServiceData,
} from '../index';
import { lazyLogAddinsTelemetryEvent } from 'owa-analytics';
import type { CustomizeActionStatusEnum, CustomizeActionPlacementEnum } from 'owa-addins-types';
import { ariaTenantToken, nexusTenantToken } from './tokenConstants';

export async function logCustomizeActionButtonAction(
    customizeActionStatus: CustomizeActionStatusEnum,
    customizeActionPlacement: CustomizeActionPlacementEnum
): Promise<void> {
    let event: TelemetryEvent = {
        eventName: 'Office.Extensibility.Host.CustomizeActionButtonAction',
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
    addOTelColumnDataEventCustomizeActionButtonAction(
        oneDSEvent,
        customizeActionStatus,
        customizeActionPlacement
    );
    if (oneDSEvent.iKey) {
        await lazyLogAddinsTelemetryEvent.importAndExecute(
            oneDSEvent.iKey /* tenantToken */,
            oneDSEvent
        );
    }
}
