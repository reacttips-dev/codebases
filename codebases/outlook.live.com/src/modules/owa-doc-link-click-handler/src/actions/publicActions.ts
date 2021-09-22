import { AttachmentSelectionSource } from 'owa-attachment-data';
import type WacUrlInfo from 'owa-attachment-wac/lib/types/WacUrlInfo';
import type { ClientItemId } from 'owa-client-ids';
import type { SharingLinkInfo } from 'owa-link-data';
import { action } from 'satcheljs';

export const tryProcessOneDriveLink = action(
    'tryProcessOneDriveLink',
    (element: HTMLElement, itemId: ClientItemId, allElements: NodeListOf<Element>) => ({
        element,
        itemId,
        allElements,
    })
);

export const tryUndoProcessOneDriveLink = action(
    'tryUndoProcessOneDriveLink',
    (elements: HTMLElement[]) => ({
        elements,
    })
);

export const tryManageOneDriveLinksState = action(
    'TRY_MANAGE_ONE_DRIVE_LINKS_STATE',
    (itemId: ClientItemId) => ({
        itemId: itemId,
    })
);

export const previewLinkInSxS = action(
    'previewLinkInSxS',
    (
        wacUrlGetter: () => Promise<WacUrlInfo>,
        itemId: ClientItemId,
        targetWindow: Window,
        selectionSource: AttachmentSelectionSource
    ) => ({
        wacUrlGetter,
        itemId,
        targetWindow,
        selectionSource,
    })
);

export const previewBeautifulLinkImageInSxSFromReadingPane = action(
    'PREVIEW_BEAUTIFUL_LINK_IMAGE_IN_SXS_FROM_READING_PANE',
    (linkId: string, readOnly: boolean, window: Window, parentItemId: ClientItemId) => ({
        linkId,
        readOnly,
        window,
        parentItemId,
    })
);

export const verifyLinkData = action(
    'VERIFY_LINK_DATA',
    (
        linksContainerId: string,
        sharingLinkInformation: SharingLinkInfo,
        allElements: NodeListOf<Element>
    ) => ({
        linksContainerId: linksContainerId,
        linkSharingInformation: sharingLinkInformation,
        allElements: allElements,
    })
);
