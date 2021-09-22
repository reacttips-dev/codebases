import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import('./lazyIndex'));

export var lazyRegisterAndInitializeSharedABT = new LazyAction(
    lazyModule,
    m => m.registerAndInitializeSharedABT
);
