import { LazyModule, createLazyComponent } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "ImmersiveExitButton" */ './lazyIndex')
);

export const ImmersiveExitButton = createLazyComponent(lazyModule, m => m.ImmersiveExitButton);
