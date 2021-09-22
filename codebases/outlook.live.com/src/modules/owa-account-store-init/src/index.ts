export {
    owaConnectedAccountAdded,
    owaAccountStoreInitializationFailed,
} from './actions/publicActions';

export { OwaConnectedAccountInitSource } from './schema/OwaConnectedAccountInitSource';

import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "owa-account-store-init"*/ './lazyIndex')
);

export const lazyInitializeOwaAccountsStore = new LazyAction(
    lazyModule,
    m => m.initializeOwaAccountsStore
);

export const lazyInitializeOwaConnectedAccount = new LazyAction(
    lazyModule,
    m => m.initializeOwaConnectedAccount
);

export const lazyRemoveOWAConnectedAccount = new LazyAction(
    lazyModule,
    m => m.removeOWAConnectedAccount
);
