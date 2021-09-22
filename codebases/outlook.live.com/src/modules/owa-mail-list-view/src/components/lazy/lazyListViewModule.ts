import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import('./lazyIndex'));
export const lazySetupMailListContentKeys = new LazyAction(
    lazyModule,
    m => m.setupMailListContentKeys
);
export const lazySetupTriageActionKeys = new LazyAction(lazyModule, m => m.setupTriageActionKeys);
export const lazySetupMailListItemContainerKeys = new LazyAction(
    lazyModule,
    m => m.setupMailListItemContainerKeys
);

export const lazyUpdateMailItemHeights = new LazyAction(lazyModule, m => m.updateMailItemHeights);
export const lazyUpdateMailItemHeightsThrottled = new LazyAction(
    lazyModule,
    m => m.updateMailItemHeightsThrottled
);
