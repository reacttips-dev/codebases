// order matters. Make sure we load owa-start first as it has the polyfills we need for owa-bundling to work
import { start } from 'owa-start';
import type { HandleBootErrorFunction, StartConfig } from 'owa-shared-start';
import { getBrowserWidth } from 'owa-config';
import { Module } from 'owa-workloads/lib/store/schema/Module';
import { lazyFrameworkBootstrap, getServiceWorkerConfig } from 'owa-app-module';
import { moduleToConfigMap } from 'owa-bootstrap-configs';
import type { SessionData } from 'owa-service/lib/types/SessionData';
import { determineModule } from './determineModule';

const CalendarAriaToken =
    'a6c6ad95ebe9480c9013b2e3ceed045c-bfc41774-bac1-484d-a626-8c70d99fdfee-7322';
const moduleToAriaToken: { [P in Module]?: string } = {
    Calendar: CalendarAriaToken,
    People: '90c31e9f702c4564b120167247d3cd9f-d894a4e5-72f4-4221-ab00-94e1359dfb60-7137',
    FilesHub: '56468f6991c348029c6bba403b444607-7f5d6cd1-7fbe-4ab1-be03-3b2b6aeb3eb4-7696',
    OutlookSpaces: CalendarAriaToken,
    OrgExplorer: CalendarAriaToken,
    CalendarDeepLink: CalendarAriaToken,
};

const overrideApp: { [P in Module]?: string } = {
    OutlookSpaces: 'TimeStream',
};

export function mailStart(
    runBeforeStart?: (config: StartConfig) => Promise<void>,
    overrideBootPromises?: () => Promise<SessionData>,
    onLoaderRemoved?: () => void,
    handleBootError?: HandleBootErrorFunction,
    retryQsp?: string
) {
    const mod = determineModule();
    const startLazyConfig = moduleToConfigMap[mod];
    start({
        app: overrideApp[mod] || mod,
        startupAriaToken:
            moduleToAriaToken[mod] ||
            '3b1ea01450be48f29759d868931e225d-7167685b-f6ff-421c-aa64-8ae16fe92128-7283',
        runBeforeStart,
        overrideBootPromises,
        runAfterRequests: () => {
            try {
                document.body.style.minWidth = '418px';

                // Calculating the width of the window now so we can incur the costs of the
                // browser layout in parallel with the requests
                getBrowserWidth();
            } catch {
                // This is an optimization. We don't want boot to fail if this throws an exception
            }
        },
        loadBpos: true,
        strategies: startLazyConfig.strategies,
        bootstrap: lazyFrameworkBootstrap,
        options: startLazyConfig.options,
        isDeepLink: mod == Module.MailDeepLink || mod == Module.CalendarDeepLink,
        onLoaderRemoved,
        handleBootError,
        cachesToClean: getServiceWorkerConfig(mod)?.app,
        retryQsp,
    });
}
