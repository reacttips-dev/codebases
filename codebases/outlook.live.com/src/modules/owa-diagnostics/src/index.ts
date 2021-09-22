import { LazyAction, LazyImport, LazyModule, createLazyComponent } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "Diagnostics"*/ './lazyIndex'));

export const DiagnosticsPanel = createLazyComponent(lazyModule, m => m.DiagnosticsPanel);
export const lazyRegisterDiagnostics = new LazyAction(lazyModule, m => m.registerDiagnostics);
export const lazySetSelectedPivot = new LazyImport(lazyModule, m => m.setSelectedPivot);
export const lazyGetDiagnosticsLogState = new LazyImport(lazyModule, m => m.getDiagnosticsLogState);
export const lazyinitializeDefaultDiagnostics = new LazyImport(
    lazyModule,
    m => m.initializeDefaultDiagnostics
);

export const DiagnosticsHost = createLazyComponent(lazyModule, m => m.DiagnosticsHost);
export const DiagnosticsInspector = createLazyComponent(lazyModule, m => m.DiagnosticsInspector);
export const TwoColumnInspector = createLazyComponent(lazyModule, m => m.TwoColumnInspector);

export { declareDiagnostics } from './utils/declareDiagnostics';
export type { ShapeOf } from './utils/declareDiagnostics';
export type { DiagnosticsLogger } from './legacy/store/schema/DiagnosticsLogState';
