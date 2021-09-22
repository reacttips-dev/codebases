import type { ComposeViewState } from 'owa-mail-compose-store';
import itemId from 'owa-service/lib/factory/itemId';
import type RecipientWellWithFindControlViewState from 'owa-recipient-types/lib/types/RecipientWellWithFindControlViewState';
import { action } from 'satcheljs/lib/legacy';

function setRecipientWellNotDirty(wellViewState: RecipientWellWithFindControlViewState) {
    if (wellViewState) {
        wellViewState.isDirty = false;
    }
}

export default action('updateComposeItemId')(function updateComposeItemId(
    viewState: ComposeViewState,
    id: string,
    changeKey: string,
    lastModifiedTime?: string
) {
    if (viewState) {
        if (viewState.itemId) {
            // Id doesn't change, we only need to update the ChangeKey
            viewState.itemId.ChangeKey = changeKey;
        } else {
            viewState.itemId = itemId({
                Id: id,
                ChangeKey: changeKey,
            });
        }

        if (lastModifiedTime) {
            viewState.lastSaveTimeStamp = lastModifiedTime;
            viewState.isDirty = false;
            setRecipientWellNotDirty(viewState.toRecipientWell);
            setRecipientWellNotDirty(viewState.ccRecipientWell);
            setRecipientWellNotDirty(viewState.bccRecipientWell);
        }
    }
});
