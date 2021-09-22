import { LazyModule, LazyAction } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "FluidTenantConfig" */ './lazyIndex')
);

export const lazyUpdateTenantConfigForFluid = new LazyAction(
    lazyModule,
    m => m.updateTenantConfigForFluid
);

export { preloadFluid } from './actions/publicActions';

export const lazyGetBposNavBarDataHelper = new LazyAction(
    lazyModule,
    m => m.getBposNavBarDataHelper
);
