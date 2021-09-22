import { errorGetWacUrl } from 'owa-locstrings/lib/strings/errorgetwacurl.locstring.json';
import loc from 'owa-localize';
import getErrorMessageFromWacAttachmentStatus from './getErrorMessageFromWacAttachmentStatus';
import getWacInfo from '../services/getWacInfo';
import type WacUrlInfo from '../types/WacUrlInfo';
import getWacInfoForOneDriveJsApi from '../services/getWacInfoForOneDriveJsApi';
import { isFeatureEnabled } from 'owa-feature-flags';
import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import WacAttachmentStatus from 'owa-service/lib/contract/WacAttachmentStatus';
import type WacAttachmentType from 'owa-service/lib/contract/WacAttachmentType';

export default async function getWacInfoForSharePointLink(
    linkUrl: string,
    shouldGrantAccess: boolean = false,
    isEdit: boolean = false,
    useOws: boolean = false
): Promise<WacUrlInfo> {
    if (isFeatureEnabled('doc-SxS-jsApi-ODB-Links') && !useOws) {
        const apiResponse = await getWacInfoForOneDriveJsApi(
            AttachmentDataProviderType.OneDrivePro,
            linkUrl,
            true /* isEdit, jsAPI always in edit mode */,
            shouldGrantAccess
        );

        if (apiResponse) {
            return {
                wacUrl: apiResponse.openWith.wac.applicationUrl,
                jsApiInfo: {
                    bootScriptUrl: apiResponse.openWith.wac.bootstrapperUrl,
                    wopiSrcUrl: apiResponse.openWith.wac.wopiSrc,
                    accessToken: apiResponse.openWith.wac.accessToken,
                    accessTokenExpiry: apiResponse.openWith.wac.accessTokenExpiry,
                    fileSize: apiResponse.size,
                    fileGetUrl: apiResponse.openWith.wac.fileGetUrl,
                    bundleInfo: apiResponse.officeBundle,
                    fetchStartTime: apiResponse.fetchStartTime,
                    responseStartTime: apiResponse.responseStartTime,
                    openUrl: linkUrl,
                    fileName: apiResponse.name,
                    userId: apiResponse.openWith.wac.userId,
                    clientThrottlingProtection: apiResponse.openWith.wac.clientThrottlingProtection,
                    requestedCallThrottling: apiResponse.openWith.wac.requestedCallThrottling,
                    irmEnabled: apiResponse.sensitivityLabel?.protectionEnabled,
                },
                readOnly: !isEdit,
            };
        } else {
            throw {
                errorMessage: loc(errorGetWacUrl),
                error: new Error('getWacInfoForOneDriveJsApi failed'),
            };
        }
    } else {
        let wacAttachmentTypeResponse: WacAttachmentType;
        try {
            wacAttachmentTypeResponse = await getWacInfo(
                linkUrl,
                AttachmentDataProviderType.OneDrivePro,
                shouldGrantAccess,
                isEdit
            );
        } catch (error) {
            throw {
                errorMessage: loc(errorGetWacUrl),
                error: error,
            };
        }

        if (wacAttachmentTypeResponse.Status === WacAttachmentStatus.Success) {
            return {
                wacUrl: wacAttachmentTypeResponse.WacUrl,
                bootScriptUrl: wacAttachmentTypeResponse.BootScriptUrl,
                wopiSrcUrl: wacAttachmentTypeResponse.WopiSrcUrl,
                accessToken: wacAttachmentTypeResponse.AccessToken,
                accessTokenTtl: wacAttachmentTypeResponse.AccessTokenTtl,
                additionalParameters: wacAttachmentTypeResponse.AdditionalParameters,
                deprecatedTokenAndParameters: wacAttachmentTypeResponse.Token,
            };
        } else {
            const errorMessage = getErrorMessageFromWacAttachmentStatus(
                wacAttachmentTypeResponse.Status
            );
            throw {
                errorMessage: errorMessage,
                error: new Error(
                    `GetWacAttachmentInfo failed with status: ${wacAttachmentTypeResponse.Status}`
                ),
            };
        }
    }
}
