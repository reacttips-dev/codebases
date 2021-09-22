import { LazyModule, LazyImport } from 'owa-bundling';

const lazyMousetrapModule = new LazyModule(() => import('mousetrap'));
export const lazyMousetrapImport = new LazyImport(lazyMousetrapModule, m => m.default);
