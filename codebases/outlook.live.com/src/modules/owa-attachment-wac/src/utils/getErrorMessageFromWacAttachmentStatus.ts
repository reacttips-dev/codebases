import { errorGetWacUrlAttachmentDataProviderError } from 'owa-locstrings/lib/strings/errorgetwacurlattachmentdataprovidererror.locstring.json';
import {
    errorGetWacUrlNotFoundOrNoPermission,
    errorGetWacUrlProtectedByUnsupportedIrm,
    errorGetWacUrlInvalidRequest,
    errorGetWacUrlUploadFailed,
    errorGetWacUrlUnsupportedObjectType,
    errorGetWacUrlEditIrmAttachmentNotSupported,
    errorGetWacUrlEditMacAttachmentNotSupported,
} from './getErrorMessageFromWacAttachmentStatus.locstring.json';
import { errorGetWacUrl } from 'owa-locstrings/lib/strings/errorgetwacurl.locstring.json';
import loc from 'owa-localize';
import WacAttachmentStatus from 'owa-service/lib/contract/WacAttachmentStatus';

export default function getErrorMessageFromWacAttachmentStatus(
    status: WacAttachmentStatus
): string {
    switch (status) {
        case WacAttachmentStatus.NotFound:
            return loc(errorGetWacUrlNotFoundOrNoPermission);
        case WacAttachmentStatus.ProtectedByUnsupportedIrm:
            return loc(errorGetWacUrlProtectedByUnsupportedIrm);
        case WacAttachmentStatus.InvalidRequest:
            return loc(errorGetWacUrlInvalidRequest);
        case WacAttachmentStatus.AttachmentDataProviderError:
            return loc(errorGetWacUrlAttachmentDataProviderError);
        case WacAttachmentStatus.UploadFailed:
            return loc(errorGetWacUrlUploadFailed);
        case WacAttachmentStatus.UnsupportedObjectType:
            return loc(errorGetWacUrlUnsupportedObjectType);
        case WacAttachmentStatus.EditIrmAttachmentNotSupported:
            return loc(errorGetWacUrlEditIrmAttachmentNotSupported);
        case WacAttachmentStatus.EditMacAttachmentNotSupported:
            return loc(errorGetWacUrlEditMacAttachmentNotSupported);
        // these two status should return the same string as default case
        // - WacAttachmentStatus.AttachmentDataProviderNotSupported:
        // - WacAttachmentStatus.WacDiscoveryFailed:
        default:
            return loc(errorGetWacUrl);
    }
}
