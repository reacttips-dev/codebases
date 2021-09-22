import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "GroupAddMemberV2" */ './lazyIndex')
);

export const lazyAddGroupMemberV2 = new LazyAction(lazyModule, m => m.addGroupMember);
