import { LazyAction, LazyModule } from 'owa-bundling';

import 'owa-fms-action-handlers/lib/orchestrators/turnOffFocusedInbox';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "LightningView" */ './lazyIndex')
);

export const lazyLoadLightningPrimaryView = new LazyAction(
    lazyModule,
    m => m.loadLightningPrimaryView
);
