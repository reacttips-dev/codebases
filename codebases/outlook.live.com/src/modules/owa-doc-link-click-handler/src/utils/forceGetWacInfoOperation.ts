import getWacInfo from 'owa-attachment-wac/lib/services/getWacInfo';
import getWacInfoForOneDriveJsApi from 'owa-attachment-wac/lib/services/getWacInfoForOneDriveJsApi';
import type WacUrlInfo from 'owa-attachment-wac/lib/types/WacUrlInfo';
import { isFeatureEnabled } from 'owa-feature-flags';
import {
    getExtensionFromFileName,
    getOfficeOnlineAppFromExtension,
    OfficeOnlineApp,
} from 'owa-file';
import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import WacAttachmentStatus from 'owa-service/lib/contract/WacAttachmentStatus';
import {
    onFinishGetWacInfoOperation,
    onGetWacInfoSuccess,
    onStartGetWacInfoOperation,
    pushSupressedUrl,
} from '../actions/internalActions';
import type DocLinkPreviewInfo from '../store/schema/DocLinkPreviewInfo';
import getValidDocLinkPreviewInfo from './getValidDocLinkPreviewInfo';

export default async function forceGetWacInfoOperation(
    url: string,
    shouldReturnDocLinkPreviewInfo: boolean,
    redeemSharingLinkIfNecessary?: boolean,
    extraFileInfo?: { fileExt?: string }
): Promise<DocLinkPreviewInfo | null> {
    try {
        onStartGetWacInfoOperation(url);

        let wacUrlInfo: WacUrlInfo = null;

        if (isFeatureEnabled('doc-SxS-jsApi-ODB-Links')) {
            const apiResponse = await getWacInfoForOneDriveJsApi(
                AttachmentDataProviderType.OneDrivePro,
                url,
                true /* isEdit, jsAPI always in edit mode */,
                redeemSharingLinkIfNecessary,
                true /* returnEvenIfNoWacInfo */
            );

            if (!apiResponse) {
                // not supported or permanent error, we should suppress further requests for this URL
                pushSupressedUrl(url);
                return null;
            } else {
                const extension = getExtensionFromFileName(apiResponse.name);
                const officeOnlineApp = getOfficeOnlineAppFromExtension(extension);

                // We filter out fluid files, as they have Wac info but are not supported in SxS
                // VSO 111869 - remove this hack once the proper fix is in, and this info is no longer returned.
                if (
                    extension === '.fluid' ||
                    extension === '.note' ||
                    extension === '.whiteboard'
                ) {
                    pushSupressedUrl(url);
                    return null;
                }

                if (extraFileInfo) {
                    extraFileInfo.fileExt = extension;
                }

                // JsAPI only supports WXP right now
                if (
                    officeOnlineApp === OfficeOnlineApp.Word ||
                    officeOnlineApp === OfficeOnlineApp.Excel ||
                    officeOnlineApp === OfficeOnlineApp.PowerPoint
                ) {
                    if (!apiResponse.openWith.wac) {
                        // this means the user will have permission to this link
                        // but need an explicit click to redeem the permission
                        onGetWacInfoSuccess(url, null, true /* needRedeem */);
                    } else {
                        wacUrlInfo = {
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
                                openUrl: url,
                                fileName: apiResponse.name,
                                userId: apiResponse.openWith.wac.userId,
                                clientThrottlingProtection:
                                    apiResponse.openWith.wac.clientThrottlingProtection,
                                requestedCallThrottling:
                                    apiResponse.openWith.wac.requestedCallThrottling,
                                irmEnabled: apiResponse.sensitivityLabel?.protectionEnabled,
                            },
                            readOnly: apiResponse.currentUserRole.readOnly,
                        };
                    }
                } else {
                    // fallback to the old way
                    wacUrlInfo = await getWacInfoLegacy(url);
                }
            }
        } else {
            wacUrlInfo = await getWacInfoLegacy(url);
        }

        if (wacUrlInfo) {
            onGetWacInfoSuccess(url, wacUrlInfo);
        }

        if (shouldReturnDocLinkPreviewInfo) {
            return getValidDocLinkPreviewInfo(url);
        } else {
            return null;
        }
    } finally {
        onFinishGetWacInfoOperation(url);
    }
}

async function getWacInfoLegacy(url: string): Promise<WacUrlInfo | null> {
    const wacAttachmentTypeResponse = await getWacInfo(url, AttachmentDataProviderType.OneDrivePro);

    if (
        wacAttachmentTypeResponse.Status ===
            WacAttachmentStatus.AttachmentDataProviderNotSupported ||
        wacAttachmentTypeResponse.Status === WacAttachmentStatus.AttachmentDataProviderError ||
        wacAttachmentTypeResponse.Status === WacAttachmentStatus.InvalidRequest
    ) {
        // not supported or permanent error, we should suppress further requests for this URL
        pushSupressedUrl(url);
    } else if (wacAttachmentTypeResponse.Status === WacAttachmentStatus.Success) {
        return {
            wacUrl: wacAttachmentTypeResponse.WacUrl,
            bootScriptUrl: wacAttachmentTypeResponse.BootScriptUrl,
            wopiSrcUrl: wacAttachmentTypeResponse.WopiSrcUrl,
            accessToken: wacAttachmentTypeResponse.AccessToken,
            deprecatedTokenAndParameters: wacAttachmentTypeResponse.Token,
        };
    }

    return null;
}
