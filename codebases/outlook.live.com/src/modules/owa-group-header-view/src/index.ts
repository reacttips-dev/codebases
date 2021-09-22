import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyGroupHeaderModule = new LazyModule(
    () =>
        import(/* webpackChunkName: "GroupHeader" */ 'owa-group-header/lib/components/GroupHeader')
);

export const GroupHeader = createLazyComponent(lazyGroupHeaderModule, m => m.default);

const lazyGroupDeepLinkModule = new LazyModule(
    () =>
        import(
            /* webpackChunkName: "GroupDeepLink" */ 'owa-group-deeplink/lib/components/DeeplinkActionDialog'
        )
);

export const GroupDeepLinkDialog = createLazyComponent(lazyGroupDeepLinkModule, m => m.default);

import type * as imports from './lazyIndex';

const lazyModule = new LazyModule<typeof imports>(
    () => import(/* webpackChunkName: "GroupHeaderV2" */ './lazyIndex')
);

export const GroupHeaderV2 = createLazyComponent(lazyModule, m => m.GroupHeaderV2);
