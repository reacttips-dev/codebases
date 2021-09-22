import * as OTel from '@microsoft/oteljs';
import { OneDSHelper } from '@microsoft/oteljs-1ds';
import { getUserConfiguration } from 'owa-session-store';
import { getSessionId, getClientVersion, getLogicalRing } from 'owa-config';
import { getBrowserInfo } from 'owa-user-agent';
import { getUserIdentitySpace, getAudienceGroup, getTenantGroup } from './addOTelColumnData';
import { OTelSchema } from '../enums/otelSchema';

let oneDSHelper: OneDSHelper = null;

export function getOneDSHelperInstance() {
    if (!oneDSHelper) {
        const config = getUserConfiguration();
        let persistentDataFields: OTel.DataField[] = [
            ...OTel.Contracts.Office.System.User.getFields('User', {
                primaryIdentityHash: config.SessionSettings.UserPuid,
                primaryIdentitySpace: getUserIdentitySpace(),
                isAnonymous: false,
            }),
            OTel.makeStringDataField(OTelSchema.AppName, 'Outlook'),
            OTel.makeStringDataField(OTelSchema.AppPlatform, 'Web'),
            OTel.makeStringDataField(OTelSchema.AppVersion, getClientVersion()),
            OTel.makeStringDataField(OTelSchema.ReleaseAudienceGroup, getAudienceGroup()),
            OTel.makeStringDataField(OTelSchema.ReleaseAudience, getLogicalRing()),
            OTel.makeStringDataField(
                OTelSchema.UserTenantId,
                config.SessionSettings.ExternalDirectoryTenantGuid
            ),
            OTel.makeStringDataField(OTelSchema.UserTenantGroup, getTenantGroup()),
            OTel.makeStringDataField(OTelSchema.BrowserName, getBrowserInfo().browser),
            OTel.makeStringDataField(
                OTelSchema.BrowserVersion,
                getBrowserInfo().browserVersion.join('.')
            ),
            OTel.makeStringDataField(OTelSchema.SessionId, getSessionId()),
            OTel.makeStringDataField(OTelSchema.SdxExEnv, getLogicalRing()),
            OTel.makeStringDataField(OTelSchema.DeviceOSBuild, 'N/A'),
            OTel.makeStringDataField(OTelSchema.DeviceOSVersion, 'N/A'),
        ];
        oneDSHelper = new OneDSHelper(persistentDataFields, { enableCustomerContent: true });
    }

    return oneDSHelper;
}
