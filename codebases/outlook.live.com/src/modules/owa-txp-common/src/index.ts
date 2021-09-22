import { LazyAction, LazyModule } from 'owa-bundling';

const lazyIndex = new LazyModule(
    () => import(/* webpackChunkName: "OwaTxpCommon" */ './lazyIndex')
);

const lazyGetTxpObjectFromTxpEntities = new LazyAction(
    lazyIndex,
    m => m.getTxpObjectFromTxpEntities
);

export { lazyGetTxpObjectFromTxpEntities };
export { default as areAnyTXPEntitiesSupported } from './utils/featureChecks/areAnyTXPEntitiesSupported';
