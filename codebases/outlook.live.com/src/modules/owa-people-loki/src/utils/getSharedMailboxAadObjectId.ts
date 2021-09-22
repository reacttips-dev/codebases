import sessionStore from 'owa-session-store/lib/store/store';

export function getSharedMailboxAadObjectId() {
    const {
        IsExplicitLogon,
        ExternalDirectoryUserGuid,
    } = sessionStore.userConfiguration?.SessionSettings;

    return IsExplicitLogon ? ExternalDirectoryUserGuid : undefined;
}
