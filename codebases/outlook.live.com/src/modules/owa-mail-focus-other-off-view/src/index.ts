import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "TurnOffFocusedOther" */ './lazyIndex')
);

export let TurnOffFocusedOtherItem = createLazyComponent(
    lazyModule,
    m => m.TurnOffFocusedOtherItem
);
