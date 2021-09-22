import type { GroupAccessType } from 'owa-groups-shared-store/lib/schema/UnifiedGroupsSettingsState';

export enum UserType {
    Consumer,
    Enterprise,
}

export enum GroupIdentityType {
    SmtpAddress,
    ExternalDirectoryObjectId,
}

export interface GroupIdentity {
    Type: GroupIdentityType;
    Value: string;
}

export interface GroupInfo {
    type: UserType;
    groupName: string;
    groupDescription: string;
    smtpAddress: string;
    photoUrl?: string;
    externalDirectoryObjectId: string;
}

export interface CultureInfo {
    key: string;
    text: string;
}

export interface EnterpriseGroup extends GroupInfo {
    groupPrivacy: GroupAccessType;
    groupMembersAreAutoSubscribed: boolean;
    pickedLanguageKey: string;
    allowExternalSenders?: boolean;
    groupClassification?: string;
}

export interface SuggestedUnifiedGroups {
    foo?: string;
}
