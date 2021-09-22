import type SharingLinkInfo from '../store/schema/SharingLinkInfo';
import getStore from '../store/store';
import { getLinkIdFromAnchorElementId } from '../utils/getLinkIdFromAnchorElementId';

export default function getSharingLinkInfo(anchorElementId: string): SharingLinkInfo {
    const store = getStore();

    const linkId = getLinkIdFromAnchorElementId(anchorElementId);
    const info: SharingLinkInfo = store.sharingLinks.get(linkId);

    return info;
}
