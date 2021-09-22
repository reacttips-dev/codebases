import { LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "GroupAddMember" */ './lazyIndex')
);

export const lazyAddGroupMember = new LazyImport(lazyModule, m => m.addGroupMember);
