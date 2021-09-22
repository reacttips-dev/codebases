import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "HeaderCharms"*/ './lazyCharms')
);

export const SkypeCharmStub = createLazyComponent(lazyModule, m => m.SkypeCharm);
