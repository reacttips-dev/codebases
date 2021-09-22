import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "filesViewStrings" */ './lazyIndex')
);

export const lazyLoadItemsViewStrings = new LazyAction(lazyModule, m => m.loadItemsViewStrings);
