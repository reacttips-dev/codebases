import { createLazyComponent, LazyModule, LazyAction } from 'owa-bundling';

import { launchDomainConnectSetAlias } from './orchestrator/launchCreateEmailFromPopout';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "OwaMailDomainConnect" */ './lazyIndex')
);

export let PremiumDomainConnectFirstStepLightable = createLazyComponent(
    lazyModule,
    m => m.DomainConnectFirstStepLightable
);
export let PremiumDomainConnectFirstStep = createLazyComponent(
    lazyModule,
    m => m.DomainConnectFirstStep
);
export let PremiumDomainConnectSecondStep = createLazyComponent(
    lazyModule,
    m => m.DomainConnectSecondStep
);

export let lazyMountAndShowDCSecondStep = new LazyAction(
    lazyModule,
    m => m.mountAndShowDCSecondStep
);

if (typeof window !== 'undefined' && typeof window.Owa !== 'undefined') {
    window.Owa.launchDomainConnectSetAlias = launchDomainConnectSetAlias;
}
