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
    domain?: string;
    groupDescription: string;
    smtpAddress: string;
    oldSmtpAddress?: string;
    photoUrl?: string;
    externalDirectoryObjectId: string;
    kind?: number;
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
    subscriptionEnabled?: boolean;
}
