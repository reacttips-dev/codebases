import { LazyModule, LazyAction, createLazyComponent, LazyImport } from 'owa-bundling';
const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "GuidedSetupCards" */ './lazyIndex')
);
export let lazymountOfficeAppCard = new LazyAction(lazyModule, m => m.mountOfficeAppCard);
export let lazymountPhoneAppCard = new LazyAction(lazyModule, m => m.mountPhoneAppCard);
export let lazyDisplayQRCode = new LazyAction(lazyModule, m => m.displayQrCode);
export let lazyShouldShowEmptyStateMobilePromo = new LazyImport(
    lazyModule,
    m => m.shouldShowEmptyStateMobilePromo
);

export let EmptyStateMobilePromoComponent = createLazyComponent(
    lazyModule,
    m => m.EmptyStateMobilePromo
);

export { OutlookMobileContainer } from './utils/OutlookMobileContainer';
