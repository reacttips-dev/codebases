import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "OwaAdUserLog" */ './lazyIndex')
);

export const logUserAdConfigLazy = new LazyAction(lazyModule, m => m.logUserAdConfig);
