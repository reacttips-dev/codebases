import { LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "GroupEdit" */ './lazyIndex'));

export const lazyEditGroup = new LazyImport(lazyModule, m => m.editGroup);
