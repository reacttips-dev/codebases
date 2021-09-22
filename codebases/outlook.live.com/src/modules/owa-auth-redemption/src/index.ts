import { LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "AuthRemediation"*/ './lazyIndex')
);

// Delay loaded action as import since action does not allow to return non-void values
export const lazyLaunchRemediateAuthDialogAndRefresh = new LazyImport(
    lazyModule,
    m => m.launchRemediateAuthDialogAndRefresh
);
export const lazyRemediateAuth = new LazyImport(lazyModule, m => m.remediateAuth);
