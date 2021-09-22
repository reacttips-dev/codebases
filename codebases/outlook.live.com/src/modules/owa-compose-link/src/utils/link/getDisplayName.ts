import type { SharingLinkInfo } from 'owa-link-data';
import getText from '../getText';

export function getDisplayName(
    originalElement: HTMLElement,
    sharingLinkInfo: SharingLinkInfo,
    hasValidFileName: boolean,
    shouldBeautify: boolean,
    isLinkPreviouslyBeautified: boolean
): string {
    if (isLinkPreviouslyBeautified) {
        return getText(originalElement);
    }

    if (hasValidFileName && shouldBeautify) {
        return sharingLinkInfo.fileName;
    }

    return originalElement.innerText;
}
