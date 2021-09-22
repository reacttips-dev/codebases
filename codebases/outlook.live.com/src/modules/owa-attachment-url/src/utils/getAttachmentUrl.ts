import { assertNever } from 'owa-assert';
import type { ClientAttachmentId } from 'owa-client-ids';
import * as OwaFilesUrl from 'owa-files-url';
import AttachmentUrlType from 'owa-files-url/lib/schema/AttachmentUrlType';
import { getOwaCanaryCookie } from 'owa-service/lib/canary';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';
import type ReferenceAttachment from 'owa-service/lib/contract/ReferenceAttachment';
import type FetchPreviewUrlRequest from '../types/FetchPreviewUrlRequest';
import tryGetAttachmentUrl from './tryGetAttachmentUrl';

// Get the Url for cloudy attachments.
export function getAttachmentUrlForCloudy(
    clientAttachmentId: ClientAttachmentId,
    attachment: AttachmentType,
    attachmentUrlType: AttachmentUrlType,
    isReadOnly: boolean,
    includeCanary: boolean = true
) {
    const {
        Name: name,
        OriginalPermissionType: originalPermissionType,
        PermissionType: permissionType,
    } = <ReferenceAttachment>attachment;

    const longPathName: string | null = tryGetAttachmentUrl(attachment);

    const isGroups: boolean = clientAttachmentId?.mailboxInfo?.type === 'GroupMailbox';
    const groupsAddress: string = isGroups
        ? clientAttachmentId.mailboxInfo.mailboxSmtpAddress + '/'
        : null;

    switch (attachmentUrlType) {
        case AttachmentUrlType.FullFile:
        case AttachmentUrlType.Print:
            return OwaFilesUrl.getAttachmentUrlForCloudy(
                clientAttachmentId,
                longPathName,
                attachmentUrlType,
                isReadOnly,
                permissionType,
                originalPermissionType,
                includeCanary,
                name,
                groupsAddress
            );
        case AttachmentUrlType.Preview:
            if ((<ReferenceAttachment>attachment).AttachmentPreviewUrl) {
                return (<ReferenceAttachment>attachment).AttachmentPreviewUrl;
            } else {
                return OwaFilesUrl.getAttachmentUrlForCloudy(
                    clientAttachmentId,
                    longPathName,
                    AttachmentUrlType.Preview,
                    isReadOnly,
                    permissionType,
                    originalPermissionType,
                    includeCanary,
                    name,
                    groupsAddress
                );
            }
        case AttachmentUrlType.Thumbnail:
            return (<ReferenceAttachment>attachment).AttachmentThumbnailUrl;
        default:
            return assertNever(attachmentUrlType);
    }
}

// Get the download Url for classic attachments.
export function getAttachmentUrlForClassic(
    attachmentId: ClientAttachmentId,
    attachmentUrlType: AttachmentUrlType,
    addIsDownloadQueryParam: boolean = false,
    includeDownloadToken: boolean = true
) {
    return OwaFilesUrl.getAttachmentUrlForClassic(
        attachmentId,
        attachmentUrlType,
        addIsDownloadQueryParam,
        includeDownloadToken
    );
}

/*
 * Initialize the preview URL
 * @returns {FetchPreviewUrl} The request to fetch the preview url
 */
export function getPreviewUrlRequest(
    attachmentId: ClientAttachmentId,
    attachment: AttachmentType,
    isCloudy: boolean,
    isReadyOnly: boolean,
    addIsDownloadQueryParam: boolean = false
): FetchPreviewUrlRequest {
    const previewUrl = isCloudy
        ? getAttachmentUrlForCloudy(
              attachmentId,
              attachment,
              AttachmentUrlType.Preview,
              isReadyOnly,
              false /* includeCanary */
          )
        : getAttachmentUrlForClassic(
              attachmentId,
              AttachmentUrlType.Preview,
              addIsDownloadQueryParam,
              false /* includeDownloadToken */
          );

    if (isCloudy) {
        return {
            url: previewUrl,
            init: {
                credentials: 'include',
                headers: new Headers(),
            },
        };
    } else {
        // If the attachment is classic then we send the download token
        // as header
        const token = OwaFilesUrl.getDownloadTokenForUserIdentity(attachmentId.mailboxInfo);
        const headers = new Headers();
        headers.set('X-Token', token);
        headers.set('X-OWA-CANARY', getOwaCanaryCookie());
        return {
            url: previewUrl,
            init: {
                headers: headers,
            },
        };
    }
}

export default function getAttachmentUrl(
    attachmentId: ClientAttachmentId,
    attachment: AttachmentType,
    attachmentUrlType: AttachmentUrlType,
    isCloudy: boolean,
    isReadyOnly: boolean,
    addIsDownloadQueryParam: boolean = false
): string {
    const downloadUrl = isCloudy
        ? getAttachmentUrlForCloudy(attachmentId, attachment, attachmentUrlType, isReadyOnly)
        : getAttachmentUrlForClassic(attachmentId, attachmentUrlType, addIsDownloadQueryParam);
    return downloadUrl;
}
