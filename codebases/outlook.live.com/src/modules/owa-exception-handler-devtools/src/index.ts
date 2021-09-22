import { LazyAction, LazyModule } from 'owa-bundling';
import { isFeatureEnabled } from 'owa-feature-flags';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "ErrorHandler" */ './lazyIndex')
);

let lazyInitializeErrorHandlerDevtools = new LazyAction(
    lazyModule,
    m => m.initializeErrorHandlerDevtools
);

// only initialize up once per session
let hasInitialized = false;

export function setupErrorHandler() {
    if (
        !hasInitialized &&
        (process.env.NODE_ENV === 'dev' ||
            (isFeatureEnabled('fwk-devTools') && isFeatureEnabled('fwk-errorpopup')))
    ) {
        lazyInitializeErrorHandlerDevtools.importAndExecute();
        hasInitialized = true;
    }
}
