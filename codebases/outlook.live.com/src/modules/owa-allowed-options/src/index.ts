import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "AllowedOptions"*/ './lazyIndex')
);

export const lazyLoadAllowedOptions = new LazyAction(lazyModule, m => m.loadAllowedOptions);

export { default as isOptionAllowed } from './utils/isOptionAllowed';
