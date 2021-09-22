import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "owa-link-account"*/ './lazyIndex')
);

export const lazyLinkAccountAndGetAccessToken = new LazyAction(
    lazyModule,
    m => m.linkAccountAndGetAccessToken
);

export const lazyGetAllConnectedAccounts = new LazyAction(
    lazyModule,
    m => m.getAllConnectedAccounts
);

export const lazyGetConnectedAccount = new LazyAction(lazyModule, m => m.getConnectedAccount);

export const lazyAddConnectedAccount = new LazyAction(lazyModule, m => m.addConnectedAccount);

export const lazyRemoveConnectedAccount = new LazyAction(lazyModule, m => m.removeConnectedAccount);

export const lazyRefreshConnectedAccountAccessToken = new LazyAction(
    lazyModule,
    m => m.refreshConnectedAccountAccessToken
);

export const lazyIdpResponseHandler = new LazyAction(lazyModule, m => m.idpResponseHandler);

export const lazySetAddConnectedAccountHandler = new LazyAction(
    lazyModule,
    m => m.setAddConnectedAccountHandler
);

export const lazyGetPreliminaryLinkedAccountAndSourceIds = new LazyAction(
    lazyModule,
    m => m.getPreliminaryLinkedAccountAndSourceIds
);

if (typeof window !== 'undefined' && typeof window.Owa !== 'undefined') {
    window.Owa.lazyIdpResponseHandler = lazyIdpResponseHandler;
}

// Exported types
export * from './contracts/ConnectedAccountResponse';
export * from './contracts/SharedProperties';
export type { ConnectedAccountRequest } from './contracts/ConnectedAccountRequest';

export type {
    GetAllConnectedAccountsResponse,
    GetAccessTokenResponse,
    ConnectedAccountResponse,
} from './contracts/ConnectedAccountResponse';
export { ErrorType } from './contracts/ErrorResponse';
export type {
    FullErrorResponse,
    ErrorResponse,
    TooManyRequestsFullErrorResponse,
} from './contracts/ErrorResponse';
export type { default as UserAccount } from './contracts/UserAccount';
export { getAccessToken } from './utils/getAccessToken';
