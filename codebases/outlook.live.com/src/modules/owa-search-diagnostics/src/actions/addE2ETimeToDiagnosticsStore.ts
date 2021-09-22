import { action } from 'satcheljs';

/**
 * Add the SearchEndToEnd time to the search diagnostics store
 */
export const addE2ETimeToDiagnosticsStore = action(
    '__DIAGNOSTICS_ADD_E2E_TIME_TO_DIAGNOSTICS_STORE',
    (jsEndToEndTime: number, jsRenderingTime: number) => ({ jsEndToEndTime, jsRenderingTime })
);
