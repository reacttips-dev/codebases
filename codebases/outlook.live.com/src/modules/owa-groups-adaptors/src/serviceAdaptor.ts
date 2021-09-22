import type FindUnifiedGroupsJsonResponse from 'owa-service/lib/contract/FindUnifiedGroupsJsonResponse';
import type UnifiedGroupsSortType from 'owa-service/lib/contract/UnifiedGroupsSortType';
import type GetSuggestedUnifiedGroupsJsonResponse from 'owa-service/lib/contract/GetSuggestedUnifiedGroupsJsonResponse';
import type GetUserUnifiedGroupsJsonResponse from 'owa-service/lib/contract/GetUserUnifiedGroupsJsonResponse';
import type UpgradeDistributionGroupResponse from 'owa-service/lib/contract/UpgradeDistributionGroupJsonResponse';
import type GetUnifiedGroupDetailsJsonResponse from 'owa-service/lib/contract/GetUnifiedGroupDetailsJsonResponse';
import type {
    DismissUserUnifiedGroupSuggestionResult,
    SetUnifiedGroupMembershipStateResult,
    SetUnifiedGroupUserSubscribeStateResult,
    JoinPrivateUnifiedGroupResult,
    GetUnifiedGroupMembersResult,
    ValidateUnifiedGroupPropertiesResult,
} from 'owa-groups-types';
import type CreateUnifiedGroupResponse from 'owa-service/lib/contract/CreateUnifiedGroupResponse';
import type ModernGroupObjectType from 'owa-service/lib/contract/ModernGroupObjectType';
import type GetFileItemsJsonResponse from 'owa-service/lib/contract/GetFileItemsJsonResponse';
import type AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import type WacAttachmentType from 'owa-service/lib/contract/WacAttachmentType';
import type GetSharePointTextFileContentResponse from 'owa-service/lib/contract/GetSharePointTextFileContentResponse';
import type GetAttachmentTextPreviewResponse from 'owa-service/lib/contract/GetAttachmentTextPreviewResponse';
import type GetRegionalConfigurationResponse from 'owa-service/lib/contract/GetRegionalConfigurationResponse';
import type GetUnifiedGroupsSettingsJsonResponse from 'owa-service/lib/contract/GetUnifiedGroupsSettingsJsonResponse';
import type GetPeopleIKnowGraphResponse from 'owa-service/lib/contract/GetPeopleIKnowGraphResponse';

// Promise for GetFileItems
export interface GetFileItemsPromise {
    (groupSmtpAddress: string): Promise<GetFileItemsJsonResponse>;
}

export let getFileItemsPromiseOverride: GetFileItemsPromise;

// Promise for DismissUserGroupSuggestion
export interface DismissUserGroupSuggestionPromise {
    (groupId: string): Promise<DismissUserUnifiedGroupSuggestionResult>;
}

export let dismissUserGroupSuggestionPromiseOverride: DismissUserGroupSuggestionPromise;

// Promise for FindUnifiedGroups
export interface FindUnifiedGroupsPromise {
    (filterText?: string, groupsToLoad?: number): Promise<FindUnifiedGroupsJsonResponse>;
}

export let findUnifiedGroupsPromiseOverride: FindUnifiedGroupsPromise;

// Promise for GetUnifiedGroupDetails
export interface GetUnifiedGroupDetailsPromise {
    (
        groupSmtpAddress: string,
        loadFullDetails?: boolean
    ): Promise<GetUnifiedGroupDetailsJsonResponse>;
}

export let getUnifiedGroupDetailsPromiseOverride: GetUnifiedGroupDetailsPromise;

// Promise for GetPeopleIKnowCommand
export interface GetPeopleIKnowCommandPromise {
    (): Promise<GetPeopleIKnowGraphResponse>;
}

export let getPeopleIKnowCommandPromiseOverride: GetPeopleIKnowCommandPromise;

// Promise for GetSuggestedUnifiedGroups
export interface GetSuggestedUnifiedGroupsPromise {
    (groupsToLoad?: number): Promise<GetSuggestedUnifiedGroupsJsonResponse>;
}

export let getSuggestedUnifiedGroupsPromiseOverride: GetSuggestedUnifiedGroupsPromise;

// Promise for GetUserUnifiedGroups
export interface GetUserUnifiedGroupPromise {
    (sortType: UnifiedGroupsSortType): Promise<GetUserUnifiedGroupsJsonResponse>;
}

export let getUserUnifiedGroupPromiseOverride: GetUserUnifiedGroupPromise;

// Promise for JoinGroup
export interface JoinGroupPromise {
    (userId: string, groupId: string): Promise<SetUnifiedGroupMembershipStateResult>;
}

export let joinGroupPromiseOverride: JoinGroupPromise;

// Promise for LeaveGroup
export interface LeaveGroupPromise {
    (userId: string, groupId: string): Promise<SetUnifiedGroupMembershipStateResult>;
}

export let leaveGroupPromiseOverride: JoinGroupPromise;

// Promise for RequestToJoinGroup
export interface RequestToJoinGroupPromise {
    (groupId: string): Promise<JoinPrivateUnifiedGroupResult>;
}

export var requestToJoinGroupPromiseOverride: RequestToJoinGroupPromise;

// Promise for setUnifiedGroupUserSubscribeState
export interface SetUnifiedGroupUserSubscribeStatePromise {
    (groupId: string): Promise<SetUnifiedGroupUserSubscribeStateResult>;
}

export let setUnifiedGroupUserSubscribeStatePromiseOverride: SetUnifiedGroupUserSubscribeStatePromise;

// Promise for UpgradeDistributionGroup
export interface UpgradeDistributionGroupPromise {
    (primarySmtpAddress: string): Promise<UpgradeDistributionGroupResponse>;
}

export let upgradeDistributionGroupPromiseOverride: UpgradeDistributionGroupPromise;

// Promise for GetUnifiedGroupMembers
export interface GetUnifiedGroupMembersPromise {
    (groupSmtpAddress: string, maxMembersToReturn?: number): Promise<GetUnifiedGroupMembersResult>;
}

export let getUnifiedGroupMembersPromiseOverride: GetUnifiedGroupMembersPromise;

// Promise for ValidateUnifiedGroupProperties
export interface ValidateUnifiedGroupPropertiesPromise {
    (nameValue?: string, aliasValue?: string): Promise<ValidateUnifiedGroupPropertiesResult>;
}

export let validateUnifiedGroupsPropertiesPromiseOverride: ValidateUnifiedGroupPropertiesPromise;

// Promise for CreateUnifiedGroup
export interface CreateUnifiedGroupPromise {
    (
        name: string,
        alias: string,
        groupType: ModernGroupObjectType,
        autoSubscribeNewGroupMembers: boolean,
        cultureId: string,
        description?: string,
        classification?: string,
        pushToken?: string
    ): Promise<CreateUnifiedGroupResponse>;
}

export let createUnifiedGroupPromiseOverride: CreateUnifiedGroupPromise;

export interface GetRegionalConfigurationPromise {
    (): Promise<GetRegionalConfigurationResponse>;
}

export let getRegionalConfigurationPromiseOverride: GetRegionalConfigurationPromise;

export interface GetUnifiedGroupsSettingsPromise {
    (): Promise<GetUnifiedGroupsSettingsJsonResponse>;
}

export var getUnifiedGroupsSettingsPromiseOverride: GetUnifiedGroupsSettingsPromise;

// Promise for getWacInfo
export interface GetWacInfoPromise {
    (
        url: string,
        providerType: AttachmentDataProviderType,
        isEdit: boolean
    ): Promise<WacAttachmentType>;
}

export let getWacInfoPromiseOverride: GetWacInfoPromise;

// Promise for getSharePointTextFileContent
export interface GetSharePointTextFileContentPromise {
    (id: string, url: string): Promise<GetSharePointTextFileContentResponse>;
}

export let getSharePointTextFileContentOverride: GetSharePointTextFileContentPromise;

// Promise for getWacAttachmentInfo
export interface GetWacAttachmentInfoPromise {
    (
        groupSmtpAddress: string,
        attachmentId: string,
        isEdit: boolean,
        draftId: string,
        appId: string
    ): Promise<WacAttachmentType>;
}

export let getWacAttachmentInfoPromiseOverride: GetWacAttachmentInfoPromise;

// Promise for GetAttachmentTextPreview
export interface GetAttachmentTextPreviewPromise {
    (attachmentId: string, showFullFile?: boolean): Promise<GetAttachmentTextPreviewResponse>;
}

export let getAttachmentTextPreviewPromiseOverride: GetAttachmentTextPreviewPromise;

// Promise for updateUnifiedGroup
export interface UpdateUnifiedGroupMockPromise {
    (groupSmtpAddress: string): Promise<boolean>;
}

export let updateUnifiedGroupPromiseOverride: UpdateUnifiedGroupMockPromise;

export function initializeServiceCallbacks(
    getUserUnifiedGroupPromiseOverrideImpl?: GetUserUnifiedGroupPromise,
    upgradePromiseOverrideImpl?: UpgradeDistributionGroupPromise,
    findUnifiedGroupsOverrideImpl?: FindUnifiedGroupsPromise,
    getSuggestedGroupsOverrideImpl?: GetSuggestedUnifiedGroupsPromise,
    getUnifiedGroupDetailsPromiseOverrideImpl?: GetUnifiedGroupDetailsPromise,
    getPeopleIKnowCommandPromiseOverrideImpl?: GetPeopleIKnowCommandPromise,
    dismissUserGroupSuggestionPromiseOverrideImpl?: DismissUserGroupSuggestionPromise,
    joinGroupPromiseOverrideImpl?: JoinGroupPromise,
    leaveGroupPromiseOverrideImpl?: LeaveGroupPromise,
    setUnifiedGroupUserSubscribeStatePromiseOverrideImpl?: SetUnifiedGroupUserSubscribeStatePromise,
    getUnifiedGroupMembersPromiseOverrideImpl?: GetUnifiedGroupMembersPromise,
    validateUnifiedGroupsPropertiesPromiseOverrideImpl?: ValidateUnifiedGroupPropertiesPromise,
    createUnifiedGroupPromiseOverrideImpl?: CreateUnifiedGroupPromise,
    getRegionalConfigurationPromiseOverrideImpl?: GetRegionalConfigurationPromise,
    getUnifiedGroupsSettingsPromiseOverrideImpl?: GetUnifiedGroupsSettingsPromise,
    requestToJoinGroupPromiseOverrideImpl?: RequestToJoinGroupPromise,
    getFileItemsPromiseOverrideImpl?: GetFileItemsPromise,
    getWacInfoPromiseOverrideImpl?: GetWacInfoPromise,
    getSharePointTextFileContentOverrideImpl?: GetSharePointTextFileContentPromise,
    getWacAttachmentInfoPromiseOverrideImpl?: GetWacAttachmentInfoPromise,
    getAttachmentTextPreviewPromiseOverrideImpl?: GetAttachmentTextPreviewPromise,
    updateUnifiedGroupOverrideImpl?: UpdateUnifiedGroupMockPromise
): void {
    getUserUnifiedGroupPromiseOverride = getUserUnifiedGroupPromiseOverrideImpl;
    upgradeDistributionGroupPromiseOverride = upgradePromiseOverrideImpl;
    findUnifiedGroupsPromiseOverride = findUnifiedGroupsOverrideImpl;
    getSuggestedUnifiedGroupsPromiseOverride = getSuggestedGroupsOverrideImpl;
    getUnifiedGroupDetailsPromiseOverride = getUnifiedGroupDetailsPromiseOverrideImpl;
    getPeopleIKnowCommandPromiseOverride = getPeopleIKnowCommandPromiseOverrideImpl;
    dismissUserGroupSuggestionPromiseOverride = dismissUserGroupSuggestionPromiseOverrideImpl;
    joinGroupPromiseOverride = joinGroupPromiseOverrideImpl;
    leaveGroupPromiseOverride = leaveGroupPromiseOverrideImpl;
    setUnifiedGroupUserSubscribeStatePromiseOverride = setUnifiedGroupUserSubscribeStatePromiseOverrideImpl;
    getUnifiedGroupMembersPromiseOverride = getUnifiedGroupMembersPromiseOverrideImpl;
    validateUnifiedGroupsPropertiesPromiseOverride = validateUnifiedGroupsPropertiesPromiseOverrideImpl;
    createUnifiedGroupPromiseOverride = createUnifiedGroupPromiseOverrideImpl;
    getRegionalConfigurationPromiseOverride = getRegionalConfigurationPromiseOverrideImpl;
    getUnifiedGroupsSettingsPromiseOverride = getUnifiedGroupsSettingsPromiseOverrideImpl;
    requestToJoinGroupPromiseOverride = requestToJoinGroupPromiseOverrideImpl;
    getFileItemsPromiseOverride = getFileItemsPromiseOverrideImpl;
    getWacInfoPromiseOverride = getWacInfoPromiseOverrideImpl;
    getSharePointTextFileContentOverride = getSharePointTextFileContentOverrideImpl;
    getWacAttachmentInfoPromiseOverride = getWacAttachmentInfoPromiseOverrideImpl;
    getAttachmentTextPreviewPromiseOverride = getAttachmentTextPreviewPromiseOverrideImpl;
    updateUnifiedGroupPromiseOverride = updateUnifiedGroupOverrideImpl;
}
