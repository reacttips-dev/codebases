import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "GroupEditV2" */ './lazyIndex')
);

export const lazyEditGroupV2 = new LazyAction(lazyModule, m => m.editGroup);
