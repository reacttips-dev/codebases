import getSharingLinkInfo from './getSharingLinkInfo';
import type SharingLinkInfo from '../store/schema/SharingLinkInfo';
import { isNewLink } from '../utils/isNewLink';
import type { SharingData } from 'owa-sharing-data';

export default function getSharingData(linkId: string): SharingData | null {
    const sharingLink: SharingLinkInfo = getSharingLinkInfo(linkId);

    if (!!sharingLink) {
        return {
            id: sharingLink.linkId,
            name: sharingLink.fileName,
            supportsDownsell: false, // Creating a classic attachment from a link in the body is not supported.
            currentPermissionLevel: sharingLink.permissionLevel,
            sharingInfo: sharingLink.sharingInfo,
            sharingTipsIgnored: sharingLink.sharingTipsIgnored,
            sharingRecipientsInfo: sharingLink.sharingRecipientsInfo,
            typeOfLink: isNewLink(linkId) ? 'newLink' : 'oldLink', // for logging purposes only
        };
    }

    return null;
}
