import trySaveMessage from '../actions/trySaveMessage';
import upConvert from '../actions/upConvert';
import { moveComposeToTab } from '../lazyIndex';
import type { ComposeViewState, GroupComposeViewState } from 'owa-mail-compose-store';
import { isSxSDisplayed, lazyOpenComposeInSxS, getActiveSxSId } from 'owa-sxs-store';
import type TempEditorRef from 'owa-editor/lib/utils/TempEditorRef';

// VSO 16069 [Mac/Safari] After set importance, then typing, the cursor is not at the end.
// This is a workaround to fix the focus issue in Edge and Mac Safari
export default async function upConvertHelper(
    composeViewState: ComposeViewState,
    targetWindow: Window,
    editorRef?: TempEditorRef
) {
    // In Group scenario, message is not saved in draft when user clicks ReplyAll, so Quoted body for the message is not available
    // Save the group message when expanding to get the quoted body.
    if (
        (composeViewState as GroupComposeViewState).groupId != null &&
        (!composeViewState.itemId || composeViewState.isDirty)
    ) {
        await trySaveMessage(composeViewState);
    }

    const sxsId = getActiveSxSId(targetWindow || window);
    if (isSxSDisplayed(sxsId)) {
        upConvert(composeViewState, editorRef);
        const openComposeInSxS = await lazyOpenComposeInSxS.import();
        openComposeInSxS(composeViewState.composeId, sxsId);
    } else {
        moveComposeToTab(composeViewState, true /*isShown*/, true /*makeActive*/);
    }
}
