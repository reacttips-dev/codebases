import {
    Classification,
    GroupAccessType,
    NamingPolicySettings,
} from 'owa-groups-shared-store/lib/schema/UnifiedGroupsSettingsState';
import UnifiedGroupsSettingsResponseShape from 'owa-service/lib/contract/UnifiedGroupsSettingsResponseShape';
import getUnifiedGroupsSettingsOperation from 'owa-service/lib/operation/getUnifiedGroupsSettingsOperation';
import getUnifiedGroupsSettingsJsonRequest from 'owa-service/lib/factory/getUnifiedGroupsSettingsJsonRequest';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import type GetUnifiedGroupsSettingsJsonResponse from 'owa-service/lib/contract/GetUnifiedGroupsSettingsJsonResponse';
import type GetUnifiedGroupsSettingsResponseMessage from 'owa-service/lib/contract/GetUnifiedGroupsSettingsResponseMessage';
import UnifiedGroupAccessType from 'owa-service/lib/contract/UnifiedGroupAccessType';

export interface UnifiedGroupsSettings {
    supportedClassifications?: Classification[];
    defaultClassification?: string;
    namingPolicySettings?: NamingPolicySettings;
    groupsGuidelinesLink?: string;
    orgAllowAddGuests?: boolean;
    defaultGroupAccessType?: GroupAccessType;
    groupCreationEnabled?: boolean;
    isSensitivityLabelsEnabled?: boolean;
}

export enum ResponseCode {
    Success,
    Error,
    Unauthorized,
}

export interface UnifiedGroupsSettingsResponse {
    errorMessage?: string;
    responseCode: ResponseCode;
    unifiedGroupSettings?: UnifiedGroupsSettings;
}

export default async function getUnifiedGroupsSettings(
    fullResponse?: boolean
): Promise<UnifiedGroupsSettingsResponse> {
    return getUnifiedGroupsSettingsOperation(
        getUnifiedGroupsSettingsJsonRequest({
            Header: getJsonRequestHeader(),
            Body: {
                ResponseShape: fullResponse
                    ? UnifiedGroupsSettingsResponseShape.Full
                    : UnifiedGroupsSettingsResponseShape.Basic,
            },
        })
    )
        .then(response => parseResponse(response))
        .catch(() => {
            return {
                responseCode: ResponseCode.Error,
                errorMessage: 'Error while getting group settings',
            };
        });
}

function parseResponse(
    response: GetUnifiedGroupsSettingsJsonResponse
): UnifiedGroupsSettingsResponse {
    if (response?.Body) {
        return {
            responseCode: ResponseCode.Success,
            unifiedGroupSettings: {
                namingPolicySettings: getNamingPolicy(response.Body),
                defaultClassification: getDefaultClassification(response.Body),
                supportedClassifications: getSupportedClassifications(response.Body),
                groupsGuidelinesLink: getGroupGuidelinesLink(response.Body),
                orgAllowAddGuests: getAllowAddGuests(response.Body),
                defaultGroupAccessType: getDefaultAccessType(response.Body),
                groupCreationEnabled: getGroupCreationEnabled(response.Body),
                isSensitivityLabelsEnabled: IsSensitivityLabelsEnabled(response.Body),
            },
        };
    } else {
        return {
            responseCode: ResponseCode.Error,
            errorMessage: response.Body.MessageText,
        };
    }
}

function getDefaultClassification(response: GetUnifiedGroupsSettingsResponseMessage): string {
    if (response.DataClassifications) {
        if (response.DataClassifications.Default) {
            return response.DataClassifications.Default;
        } else if (
            response.DataClassifications.Classifications &&
            response.DataClassifications.Classifications.length === 1
        ) {
            return response.DataClassifications.Classifications[0].Name;
        }
    }
    return '';
}

function getNamingPolicy(response: GetUnifiedGroupsSettingsResponseMessage): NamingPolicySettings {
    if (response.NamingPolicySettings) {
        let namingPolicy: NamingPolicySettings = {};
        if (response.NamingPolicySettings.AliasDecorationPrefix) {
            namingPolicy.AliasDecorationPrefix =
                response.NamingPolicySettings.AliasDecorationPrefix;
        }

        if (response.NamingPolicySettings.AliasDecorationSuffix) {
            namingPolicy.AliasDecorationSuffix =
                response.NamingPolicySettings.AliasDecorationSuffix;
        }

        if (response.NamingPolicySettings.DisplayNameDecorationPrefix) {
            namingPolicy.DisplayNameDecorationPrefix =
                response.NamingPolicySettings.DisplayNameDecorationPrefix;
        }

        if (response.NamingPolicySettings.DisplayNameDecorationSuffix) {
            namingPolicy.DisplayNameDecorationSuffix =
                response.NamingPolicySettings.DisplayNameDecorationSuffix;
        }

        return namingPolicy;
    }

    return {};
}

function IsSensitivityLabelsEnabled(response: GetUnifiedGroupsSettingsResponseMessage): boolean {
    if (
        response.SensitivityLabelPolicy?.SensitivityLabels &&
        response.SensitivityLabelPolicy?.SensitivityLabels.length > 0
    ) {
        return true;
    }

    return false;
}

function getSupportedClassifications(
    response: GetUnifiedGroupsSettingsResponseMessage
): Classification[] {
    if (response.DataClassifications?.Classifications) {
        let classifications: Classification[];
        classifications = response.DataClassifications.Classifications;

        return classifications;
    }

    return [];
}

function getGroupGuidelinesLink(response: GetUnifiedGroupsSettingsResponseMessage): string {
    if (response.GroupsGuidelinesLink) {
        return response.GroupsGuidelinesLink;
    }

    return '';
}

function getDefaultAccessType(response: GetUnifiedGroupsSettingsResponseMessage): GroupAccessType {
    if (response.DefaultGroupAccessType) {
        if (response.DefaultGroupAccessType === UnifiedGroupAccessType.Private) {
            return GroupAccessType.Private;
        } else if (response.DefaultGroupAccessType === UnifiedGroupAccessType.Public) {
            return GroupAccessType.Public;
        }
    }

    return GroupAccessType.Private;
}

function getAllowAddGuests(response: GetUnifiedGroupsSettingsResponseMessage): boolean {
    if (response.OrgAllowAddGuests) {
        return response.OrgAllowAddGuests;
    }

    return false;
}

function getGroupCreationEnabled(response: GetUnifiedGroupsSettingsResponseMessage): boolean {
    if (response.GroupCreationEnabled) {
        return response.GroupCreationEnabled;
    }

    return false;
}
