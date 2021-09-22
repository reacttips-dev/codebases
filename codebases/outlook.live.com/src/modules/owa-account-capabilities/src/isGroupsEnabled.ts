import { getUserConfigurationForUser } from 'owa-session-store';

export function isGroupsEnabled(userIdentity?: string) {
    const userConfiguration = getUserConfigurationForUser(userIdentity);
    return userConfiguration?.GroupsEnabled && !userConfiguration.SessionSettings.IsExplicitLogon;
}
