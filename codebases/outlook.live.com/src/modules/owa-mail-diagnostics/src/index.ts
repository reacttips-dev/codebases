import { LazyModule, LazyAction, createLazyComponent } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "MailModuleDiagnostics" */ './lazyIndex')
);

export const MailModuleDiagnosticsPanel = createLazyComponent(
    lazyModule,
    m => m.MailModuleDiagnosticsPanel
);

export const lazyGetMailModuleDiagnostics = new LazyAction(
    lazyModule,
    m => m.getMailModuleDiagnostics
);
