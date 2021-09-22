import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "ExpressionStore"*/ './lazyIndex')
);

export let lazyCloseExpressionPane = new LazyAction(lazyModule, m => m.closeExpressionPane);
