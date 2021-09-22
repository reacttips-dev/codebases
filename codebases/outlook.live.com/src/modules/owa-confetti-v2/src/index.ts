import { LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "ConfettiV2" */ './lazyIndex'));

export const lazyCreateConfettiAnimation = new LazyImport(
    lazyModule,
    m => m.createConfettiAnimation
);
