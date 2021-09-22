import { createLazyComponent, LazyAction, LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "ExpressionPane" */ './lazyIndex')
);

export let lazyShowExpressionPane = new LazyAction(lazyModule, m => m.showExpressionPane);
export let ExpressionPane = createLazyComponent(lazyModule, m => m.ExpressionPane);
export const lazyToggleExpressionPane = new LazyImport(lazyModule, m => m.toggleExpressionPane);
