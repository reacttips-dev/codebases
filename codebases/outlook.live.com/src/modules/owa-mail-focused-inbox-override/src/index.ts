import { LazyModule, LazyImport, registerLazyOrchestrator } from 'owa-bundling';
import { onAfterSelectionChanged } from 'owa-mail-actions/lib/mailListSelectionActions';

export const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "FocusedOverride"*/ './lazyIndex')
);

export const lazyIsFocusedOverridden = new LazyImport(lazyModule, m => m.isFocusedOverridden);

registerLazyOrchestrator(
    onAfterSelectionChanged,
    lazyModule,
    m => m.getFocusedOverrideOrchestrator
);
