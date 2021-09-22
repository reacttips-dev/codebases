import { isFeatureEnabled } from 'owa-feature-flags';
import initializeLicenseNotice from './initializeLicenseNotice';
import { lazySetupDevTools } from 'owa-devtools';
import { clearQueryParams } from './clearQueryParams';
import { lazyinitializeDefaultDiagnostics } from 'owa-diagnostics';
import initializeGlobalEventListeners from './initializeGlobalEventListeners';
import { AnalyticsOptions, lazyInitializeAnalytics } from 'owa-analytics';
import { govern } from 'owa-tti/lib/ttiGovernor';
import initializeServiceWorker from 'owa-serviceworker-cache/lib/initializeServiceWorker';
import type { ServiceWorkerSource } from 'owa-serviceworker-common/lib/types/ServiceWorkerSource';

export function setupSharedPostBoot(
    analyticsOptions: AnalyticsOptions | undefined,
    swApp: ServiceWorkerSource | undefined,
    expectedXAppNameHeader: string | undefined
) {
    govern(
        {
            condition: !!(window?.location && window.history),
            task: () => clearQueryParams(window.location, window.history),
        },
        initializeGlobalEventListeners,
        () => lazyInitializeAnalytics.importAndExecute(analyticsOptions),
        {
            condition: isFeatureEnabled('fwk-devTools'),
            task: () => {
                lazySetupDevTools.importAndExecute();
                lazyinitializeDefaultDiagnostics.import().then(init => {
                    init();
                });
            },
        },
        {
            task: () => initializeServiceWorker(window, swApp!, expectedXAppNameHeader),
            idle: true,
            condition: !!swApp,
        },
        {
            idle: true,
            task: initializeLicenseNotice,
        }
    );
}
