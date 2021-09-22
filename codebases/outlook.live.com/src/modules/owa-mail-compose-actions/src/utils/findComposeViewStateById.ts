import getAllAttachmentIds from './getAllAttachmentIds';
import { ComposeViewState, getStore as getComposeStore } from 'owa-mail-compose-store';
import { assertNever } from 'owa-assert';
import type { ClientAttachmentId, ClientItemId } from 'owa-client-ids';

type IdType = ClientAttachmentId | string | ClientItemId;
export enum IdSource {
    Compose,
    Attachment,
    Link,
    ComposeItem,
}

export default function findComposeViewStateById(id: IdType, idSource: IdSource): ComposeViewState {
    const composeContainsId = getIdChecker(idSource);
    const composeStore = getComposeStore();

    // Iterate over all ComposeViewStates.
    const viewStates = [...composeStore.viewStates.values()];

    for (let i = 0; i < viewStates.length; i++) {
        if (viewStates[i] && composeContainsId(viewStates[i], id)) {
            return viewStates[i];
        }
    }

    // We couldn't find composeViewState with a matching ID.
    return null;
}

function getIdChecker(idSource: IdSource): (viewState: ComposeViewState, id: IdType) => boolean {
    switch (idSource) {
        case IdSource.Compose:
            return composeIdChecker;
        case IdSource.Attachment:
            return attachmentIdChecker;
        case IdSource.Link:
            return linkIdChecker;
        case IdSource.ComposeItem:
            return composeItemIdChecker;
        default:
            return assertNever(idSource);
    }
}

function linkIdChecker(viewState: ComposeViewState, linkId: IdType): boolean {
    return viewState.attachmentWell.sharingLinkIds.indexOf(<string>linkId) !== -1;
}

function attachmentIdChecker(
    viewState: ComposeViewState,
    attachmentId: ClientAttachmentId
): boolean {
    return getAllAttachmentIds(viewState).some(x => x.Id === attachmentId.Id);
}

function composeIdChecker(viewState: ComposeViewState, composeId: IdType): boolean {
    return viewState.composeId === composeId;
}

function composeItemIdChecker(viewState: ComposeViewState, composeItemId: ClientItemId): boolean {
    const bothItemIdsAreNotNull = !!viewState.itemId.Id && !!composeItemId.Id;
    const idsAreEqual = viewState.itemId.Id === composeItemId.Id;
    return bothItemIdsAreNotNull && idsAreEqual;
}
