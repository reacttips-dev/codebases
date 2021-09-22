import addInfoBarMessage from 'owa-info-bar/lib/actions/addInfoBarMessage';
import showCcWell from './showCcWell';
import datapoints from '../datapoints';
import convertInlineCssForHtml from '../utils/convertInlineCssForHtml';
import createAppendOnSendBlock from '../utils/createAppendOnSendBlock';
import isPublicFolderComposeViewState from 'owa-mail-compose-store/lib/utils/isPublicFolderComposeViewState';
import getFromViewState from '../utils/getFromViewState';
import shouldAlwaysShowFrom from '../utils/shouldAlwaysShowFrom';
import isGroupComposeViewState from 'owa-mail-compose-store/lib/utils/isGroupComposeViewState';
import { wrapFunctionForDatapoint } from 'owa-analytics';
import initializeUndoSnapshot from 'owa-editor/lib/actions/initializeUndoSnapshot';
import updateContentToViewState from 'owa-editor/lib/utils/updateContentToViewState';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import type { ComposeViewState } from 'owa-mail-compose-store';
import setShouldUpdateContentOnDispose from 'owa-editor/lib/actions/setShouldUpdateContentOnDispose';
import type TempEditorRef from 'owa-editor/lib/utils/TempEditorRef';
import { mutatorAction } from 'satcheljs';

export default wrapFunctionForDatapoint(
    datapoints.MailComposeUpConvert,
    function upConvert(viewState: ComposeViewState, editorRef?: TempEditorRef) {
        updateComposeViewStateRibbonShown(viewState);

        // Clear existing undo snapshots by reinitialize
        initializeUndoSnapshot(viewState);
        updateContentToViewState(viewState, editorRef);
        setShouldUpdateContentOnDispose(viewState, false /*shouldUpdateContentOnDispose*/);

        let content: string | undefined;
        if (viewState.quotedBody) {
            // Clean global CSS and convert to inline CSS if any, so that global CSS will not impact new content
            const quotedBody = convertInlineCssForHtml(viewState.quotedBody, viewState.bodyType);
            setComposeViewStateContent(
                viewState,
                viewState.content + createAppendOnSendBlock(viewState.bodyType) + quotedBody
            );
        } else if (isGroupComposeViewState(viewState) && viewState.lastSavedMessageBody) {
            setComposeViewStateContent(
                viewState,
                convertInlineCssForHtml(viewState.lastSavedMessageBody, viewState.bodyType)
            );
        } else {
            addInfoBarMessage(viewState, 'warningNoQuotedBody');
        }

        setComposeViewStateContent(viewState, content);

        if (!isConsumer()) {
            showCcWell(viewState);
        }
    }
);

const updateComposeViewStateRibbonShown = mutatorAction(
    'setComposeViewStateContent',
    (viewState: ComposeViewState) => {
        if (viewState.bodyType == 'HTML') {
            viewState.isRibbonShown = true;
        }
    }
);

const setComposeViewStateContent = mutatorAction(
    'setComposeViewStateContent',
    (viewState: ComposeViewState, content?: string) => {
        if (content) {
            viewState.content = content;
            viewState.useSmartResponse = false;
        }
        viewState.isInlineCompose = false;
        if (shouldAlwaysShowFrom()) {
            // When upconverting from inline compose, we need to re-initialize the from well view state.
            // This is because certain properties remain unset on purpose (to try to minimize when the well is visible unexpectedly)
            viewState.fromViewState = getFromViewState(
                viewState.fromViewState.from ? viewState.fromViewState.from.email : null,
                viewState.meetingRequestItem,
                viewState.referenceItemId,
                isPublicFolderComposeViewState(viewState),
                viewState.fromViewState.isFromShown
            );
        }
    }
);
