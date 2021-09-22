import { LazyImport, LazyModule, createLazyComponent } from 'owa-bundling';

import renderCouponPeekPlaceHolder, {
    CouponPreviewWellProps,
} from './components/CouponPreviewPlaceholder';

export {
    getValidCouponIndexesForConversation,
    getValidCouponIndexesForItem,
} from './helpers/getValidCouponIndexes';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "CouponPeek" */ './lazyIndex'));

export let lazyFetchCouponData = new LazyImport(lazyModule, m => m.fetchCouponData);
export let lazyRemoveCouponFromStore = new LazyImport(lazyModule, m => m.removeCouponFromStore);

// Delayed Loaded Components
export let CouponPreviewWell = createLazyComponent(
    lazyModule,
    m => m.CouponPreviewWell,
    (props: CouponPreviewWellProps) => renderCouponPeekPlaceHolder(props)
);
