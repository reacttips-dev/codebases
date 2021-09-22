import { createLazyComponent, LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/*webpackChunckName: "ConflictsView" */ './lazyIndex')
);

export const lazyInitializeConflictsView = new LazyAction(
    lazyModule,
    m => m.initializeConflictsView
);

export const ConflictsView = createLazyComponent(lazyModule, m => m.ConflictsView);

export { resetConflictsView } from './actions/publicActions';
export * from './selectors/conflictsViewSelectors';
