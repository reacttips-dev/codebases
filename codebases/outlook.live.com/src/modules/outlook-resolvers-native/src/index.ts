import { LazyBootModule, LazyImport } from 'owa-bundling-light';

const lazyModule = new LazyBootModule(
    () => import(/* webpackChunkName: "NativeResolvers" */ './nativeResolversSync')
);

export const lazyNativeResolvers = new LazyImport(lazyModule, m => m.nativeResolvers);
