import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "PostSharedBoot" */ './lazyIndex')
);

export const lazySetupSharedPostBoot = new LazyAction(lazyModule, m => m.setupSharedPostBoot);
export { tabOutline } from './initializeGlobalEventListeners';
