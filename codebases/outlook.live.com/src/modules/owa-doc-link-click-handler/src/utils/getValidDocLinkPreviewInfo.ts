import { docLinkPreviewInfoValidPeriod } from './constants';
import type DocLinkPreviewInfo from '../store/schema/DocLinkPreviewInfo';
import getStore from '../store/store';
import forceGetWacInfoOperation from './forceGetWacInfoOperation';

export default function getValidDocLinkPreviewInfo(url: string): DocLinkPreviewInfo | null {
    const { docLinkPreviewInfo } = getValidDocLinkPreviewInfoWithReason(url);
    return docLinkPreviewInfo || null;
}

export async function forceGetValidDocLinkPreviewInfo(url: string) {
    let { docLinkPreviewInfo } = getValidDocLinkPreviewInfoWithReason(url);
    if (!docLinkPreviewInfo || docLinkPreviewInfo.needRedeem) {
        // this means the getWacInfo operation succeeded more than 5 minutes ago
        // or the link needs to be redeemed
        // force a getWacInfo call to ensure the preview info is valid (not expired)
        docLinkPreviewInfo = await forceGetWacInfoOperation(
            url,
            true /* shouldReturnDocLinkPreviewInfo */,
            true /* redeemSharingLinkIfNecessary */
        );
    }
    return docLinkPreviewInfo;
}

export function getValidDocLinkPreviewInfoWithReason(url: string): DocLinkPreviewInfoWithReason {
    const docLinkPreviewInfo = getStore.docLinkPreviewInfoMap.get(url);
    if (!!docLinkPreviewInfo) {
        if (docLinkPreviewInfo.time + docLinkPreviewInfoValidPeriod > Date.now()) {
            return { docLinkPreviewInfo };
        } else {
            return { reason: 'Expired' };
        }
    }

    if (
        getStore.getWacInfoQueue.some(queued => queued === url) ||
        getStore.activeGetWacInfoOperations.some(active => active === url)
    ) {
        return { reason: 'InQueue' };
    }

    if (getStore.suppressedUrls.some(suppressed => suppressed === url)) {
        return { reason: 'FileTypeNotSupportedOrSuppressedAfterError' };
    }

    return { reason: 'Unknown' };
}

export interface DocLinkPreviewInfoWithReason {
    docLinkPreviewInfo?: DocLinkPreviewInfo;
    reason?: 'Expired' | 'InQueue' | 'FileTypeNotSupportedOrSuppressedAfterError' | 'Unknown';
}
