import type SharingMessage from 'owa-service/lib/contract/SharingMessage';
import type Item from 'owa-service/lib/contract/Item';
import * as Constants from '../utils/constants';
import getSharingMessageAction from './getSharingMessageAction';

export default function shouldShowSharingMessageHeader(item: Item) {
    if (!item.ItemClass.match(/^ipm\.sharing/i)) {
        // short circuit common case of not being a sharing message
        return false;
    }

    if (item.__type != Constants.SHARING_MESSAGE_TYPE) {
        // sharing messages used to be sent as just Items with class = IPM.Sharing
        // they're now sent as a SharingMessage:#Exchange, with additional properties for SharingMessageActions, but still need to handle older messages
        // if item class = ipm.sharing but type is not SharingMessage, it's an older message and we need to show a header for it
        return true;
    }

    const fixedItem = item as SharingMessage;

    // if the item's sharingMessageActions[] is non-null and empty, we're explicitly not supposed to show an accept button
    if (fixedItem.SharingMessageActions && fixedItem.SharingMessageActions.length == 0) {
        return false;
    }

    const sharingMessageAction = getSharingMessageAction(fixedItem);

    // there were some server versions that had SharingMessageActions on them but did not have the hook in the email,
    // so we need to actually parse the item body to see if there's something to hook to - if not, we might need a header
    const body = fixedItem.NormalizedBody ? fixedItem.NormalizedBody : fixedItem.UniqueBody;
    const doesHookExist = body ? body.Value.search(Constants.SHARING_HOOK_ID) > 0 : false;

    // The sharing message can be sent from a new server, which will have a SharingMessageAction; if the type is Accept, we want to include the accept button
    // if the sharingMessageAction is null, this invite was sent from an old server, so we want to show the button regardless
    let sharingMessageActionTypeAccept = true;
    if (sharingMessageAction) {
        sharingMessageActionTypeAccept =
            sharingMessageAction.ActionType == Constants.ACCEPT_ACTIONTYPE;
    }

    // if item does not have the hook in the body, and the sharingMessageAction action type is accept, show the accept button in the header
    return !doesHookExist && sharingMessageActionTypeAccept;
}
