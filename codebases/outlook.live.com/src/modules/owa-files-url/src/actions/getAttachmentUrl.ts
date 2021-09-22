import { assertNever } from 'owa-assert';
import { format, isStringNullOrWhiteSpace } from 'owa-localize';
import { getOwaCanaryCookie } from 'owa-service/lib/canary';
import type { ClientAttachmentId } from 'owa-client-ids';
import {
    ATTACHMENT_DOWNLOAD_RELATIVE_URL_TEMPLATE,
    ATTACHMENT_PREVIEW_RELATIVE_URL_TEMPLATE,
    ATTACHMENT_PRINT_RELATIVE_URL_TEMPLATE,
    ATTACHMENT_THUMBNAIL_RELATIVE_URL_TEMPLATE,
    OWA_ROOT_PREFIX,
    REFERENCE_ATTACHMENT_DOWNLOAD_RELATIVE_URL_TEMPLATE,
    REFERENCE_ATTACHMENT_PREVIEW_RELATIVE_URL_TEMPLATE,
    REFERENCE_ATTACHMENT_PRINT_RELATIVE_URL_TEMPLATE,
} from '../constants';
import AttachmentUrlType from '../schema/AttachmentUrlType';
import isImageFile from '../utils/isImageFile';
import getDownloadUrlForClassicAttachment from './getDownloadUrlForClassicAttachment';
import getScopedPath from 'owa-url/lib/getScopedPath';

// Get the download Url and preview URL only for images for cloudy attachments. < no thumbnail URL. Thumbnail URL is already a part of reference Attachment object>
// pass permissionlevel as 0 if you dont know it. It will make server to get the information.
export function getAttachmentUrlForCloudy(
    attachmentId: ClientAttachmentId,
    attachmentLongPathName: string,
    attachmentUrlType:
        | AttachmentUrlType.FullFile
        | AttachmentUrlType.Preview
        | AttachmentUrlType.Print,
    isReadyOnly: boolean,
    permissionType: number = 0,
    originalPermissionType: number = 0,
    includeCanary: boolean = true,
    name: string = null,
    groupsAddress: string = null
) {
    let template;
    switch (attachmentUrlType) {
        case AttachmentUrlType.FullFile:
            template = REFERENCE_ATTACHMENT_DOWNLOAD_RELATIVE_URL_TEMPLATE;
            break;
        case AttachmentUrlType.Print:
            template = REFERENCE_ATTACHMENT_PRINT_RELATIVE_URL_TEMPLATE;
            break;
        case AttachmentUrlType.Preview:
            if (isImageFile(name)) {
                template = REFERENCE_ATTACHMENT_PREVIEW_RELATIVE_URL_TEMPLATE;
            } else {
                return null;
            }
            break;
        default:
            assertNever(attachmentUrlType);
    }
    let permissionLevel = isReadyOnly ? originalPermissionType : permissionType;
    if (!permissionLevel && permissionType) {
        permissionLevel = permissionType;
    }

    let attachmentUrl = format(
        '{0}&permissionLevel={1}',
        format(
            template,
            encodeURIComponent(attachmentId.Id),
            encodeURIComponent(attachmentLongPathName)
        ),
        permissionLevel
    );

    const urlWithDownloadUrlBase = getDownloadUrlForClassicAttachment(
        attachmentId,
        template,
        true /* includeDownloadToken */,
        attachmentUrlType === AttachmentUrlType.Print,
        attachmentUrl
    );

    if (urlWithDownloadUrlBase) {
        return urlWithDownloadUrlBase;
    }

    let url = format('{0}{1}{2}', OWA_ROOT_PREFIX, groupsAddress, attachmentUrl);

    if (includeCanary) {
        const owaCanary = getOwaCanaryCookie();
        url = `${url}&X-OWA-CANARY=${owaCanary}`;
    }

    return getScopedPath(url);
}

export function getAttachmentUrlForClassic(
    attachmentId: ClientAttachmentId,
    attachmentUrlType: AttachmentUrlType,
    addIsDownloadQueryParam: boolean = false,
    includeDownloadToken: boolean = true
) {
    let template: string;
    switch (attachmentUrlType) {
        case AttachmentUrlType.FullFile:
            template = ATTACHMENT_DOWNLOAD_RELATIVE_URL_TEMPLATE;
            break;
        case AttachmentUrlType.Preview:
            template = ATTACHMENT_PREVIEW_RELATIVE_URL_TEMPLATE;
            break;
        case AttachmentUrlType.Thumbnail:
            template = ATTACHMENT_THUMBNAIL_RELATIVE_URL_TEMPLATE;
            break;
        case AttachmentUrlType.Print:
            template = ATTACHMENT_PRINT_RELATIVE_URL_TEMPLATE;
            break;
        default:
            return assertNever(attachmentUrlType);
    }

    // Add isDownload to the querystring
    if (!isStringNullOrWhiteSpace(template)) {
        const downloadUrl = getDownloadUrlForClassicAttachment(
            attachmentId,
            template,
            includeDownloadToken,
            attachmentUrlType === AttachmentUrlType.Print
        );
        return format(
            '{0}{1}{2}',
            downloadUrl,
            addIsDownloadQueryParam ? '&isDownload=true' : '',
            '&animation=true'
        ); // This will make the API return the full image if it is a gif
    }

    return null;
}
