import { action } from 'satcheljs';
import type WacUrlInfo from 'owa-attachment-wac/lib/types/WacUrlInfo';
import { ClientItemId } from 'owa-client-ids';

export const addComposeLinkViewState = action('ADD_COMPOSE_LINK_VIEW_STATE', (linkId: string) => ({
    linkId: linkId,
}));

export const removeAllComposeLinkViewStates = action('REMOVE_ALL_COMPOSE_LINK_VIEW_STATES');

export const previewSharePointDocumentLinkInSxS = action(
    'PREVIEW_SP_DOC_LINK_IN_SXS',
    (
        wacUrlGetter: () => Promise<WacUrlInfo>,
        linkId: string,
        readOnly: boolean,
        targetWindow: Window
    ) => ({
        wacUrlGetter,
        linkId,
        readOnly,
        targetWindow,
    })
);

export const previewBeautifulLinkImageInSxS = action(
    'PREVIEW_BEAUTIFUL_LINK_IMAGE_IN_SXS',
    (
        linkId: string,
        readOnly: boolean,
        window: Window,
        parentItemId: ClientItemId,
        linksContainerId: string
    ) => ({
        linkId,
        readOnly,
        window,
        parentItemId,
        linksContainerId,
    })
);

export const onLinkSelectionChange = action(
    'onLinkSelectionChange',
    (selectedLinkId: string, isSelectedLinkReadOnly: boolean) => ({
        selectedLinkId,
        isSelectedLinkReadOnly,
    })
);
