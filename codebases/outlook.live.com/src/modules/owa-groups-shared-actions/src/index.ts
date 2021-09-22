import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "OwaGroupSharedActions" */ './lazyIndex')
);

export const lazyLoadUnifiedGroupsSettings = new LazyAction(
    lazyModule,
    m => m.loadUnifiedGroupsSettings
);

export const lazyGetGroupDetailsAction = new LazyAction(lazyModule, m => m.getGroupDetailsAction);
