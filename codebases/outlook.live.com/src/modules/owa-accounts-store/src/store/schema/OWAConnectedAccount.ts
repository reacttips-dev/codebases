import type { OwaDate } from 'owa-datetime';

export interface OWAConnectedAccount {
    userIdentity: string;
    accountId: string;

    /* The account unique id value contains the CID for the Outlook.com account and PUID for the Gmail account */
    accountUniqueId: string;

    token: string;
    tokenExpiry: OwaDate;
    anchorMailbox: string;
    accountProviderType: AccountProviderType;
    accountState: OWAConnectedAccountState;
}

export enum OWAConnectedAccountState {
    Valid = 0,
    AccountDeprovisioned = 1, // gmail cloud cache account deprovisioned
    AccessRevoked = 2, // Access Token Revoked
    TransientTokenError = 3, // MSA down etc
    FailedToInitializeOWAConfig = 4, // getOwaUserConfiguration failed
    AccountNotFound = 5, // account removed at the backend
    UnknownTokenError = 6, // non-transient token error for unknown reason
}

export type AccountProviderType = 'Outlook' | 'Google' | 'ICloud';
