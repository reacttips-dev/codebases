import { action } from 'satcheljs';
import type { ServiceCallLog } from '../store/schema/FormsDiagnosticsStore';

/**
 * Action which logs the service call for diagnostics panel
 */
export const logServiceCallForDiagnostics = action(
    'logServiceCallForDiagnostics',
    (serviceCall: ServiceCallLog) => ({ serviceCall })
);
