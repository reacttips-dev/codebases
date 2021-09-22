export interface ApiSharedProperties {
    delegatePermissions: number;
    owner: string;
    targetRestUrl: string;
    targetMailbox: string;
}

export interface AdapterSharedProperties {
    delegatePermissions: DelegatePermissions;
    owner: string;
}

export interface DelegatePermissions {
    Read: boolean;
    Create: boolean;
    DeleteOwn: boolean;
    DeleteAll: boolean;
    EditOwn: boolean;
    EditAll: boolean;
}

export enum DelegatePermissionsBitMapValues {
    Read = 1,
    Create = 2,
    DeleteOwn = 4,
    DeleteAll = 8,
    EditOwn = 16,
    EditAll = 32,
}
