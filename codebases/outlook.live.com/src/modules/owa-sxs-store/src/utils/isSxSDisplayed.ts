import getOrCreateSxSStoreData from '../store/Store';
import { ClientAttachmentId, isClientAttachmentIdEqual } from 'owa-client-ids';

export default function isSxSDisplayed(sxsId?: string) {
    return getOrCreateSxSStoreData(sxsId).shouldShow;
}

export function isSxSDisplayedForAttachment(id: ClientAttachmentId, sxsId: string) {
    return (
        isSxSDisplayed(sxsId) &&
        isClientAttachmentIdEqual(id, getOrCreateSxSStoreData(sxsId).extendedViewState.attachmentId)
    );
}

/**
 * If composeViewState is truthy, it will check if SxS is displaying that exact same compose view state
 * If composeViewState is falsy, it will check if any compose is displaying in SxS
 */
export function isSxSDisplayedWithCompose(composeViewState?: any, sxsId?: string) {
    return (
        isSxSDisplayed(sxsId) &&
        ((composeViewState &&
            composeViewState.composeId === getOrCreateSxSStoreData(sxsId).composeId) ||
            (!composeViewState && getOrCreateSxSStoreData(sxsId).composeId))
    );
}
