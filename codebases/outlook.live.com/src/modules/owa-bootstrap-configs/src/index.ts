import { LazyModule } from 'owa-bundling-light';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "ChangeModule"*/ './lazyIndex')
);
lazyModule.import();

export { moduleToConfigMap } from './configRegistry';
