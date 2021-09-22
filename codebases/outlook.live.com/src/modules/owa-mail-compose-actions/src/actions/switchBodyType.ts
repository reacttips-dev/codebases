import trySaveMessage from './trySaveMessage';
import type { ComposeViewState } from 'owa-mail-compose-store';
import formatTextToHTML from '../utils/formatTextToHTML';
import getCloudyAttachmentNames from '../utils/getCloudyAttachmentNames';
import { confirm, DialogResponse } from 'owa-confirm-dialog';
import loc from 'owa-localize';
import { mutatorAction } from 'satcheljs';
import {
    switchToPlainTextCloudAttachmentWarning,
    switchToPlainTextWarning,
} from './switchBodyType.locstring.json';
import setShouldUpdateContentOnDispose from 'owa-editor/lib/actions/setShouldUpdateContentOnDispose';
import { lazyOperateContent, OperateContentType } from 'owa-editor';
import { GetContentMode } from 'roosterjs-editor-types';
import closeExpressionPane from 'owa-expressions-store/lib/utils/closeExpressionPane';
import removeInlineAttachmentsFromWell from '../utils/removeInlineAttachmentsFromWell';

export default async function switchBodyType(viewState: ComposeViewState, targetWindow: Window) {
    const operateContent = await lazyOperateContent.import();
    if (await canSwitch(viewState, operateContent, targetWindow)) {
        let newContent = '';
        let toText = true;
        operateContent(
            viewState,
            editor => {
                editor.queryElements('img', image => editor.deleteNode(image));
                newContent = editor.getContent(GetContentMode.PlainText);
                removeInlineAttachmentsFromWell(viewState);
                return null;
            },
            content => {
                newContent = formatTextToHTML(content);
                toText = false;
                return null;
            }
        );

        await trySaveMessage(viewState, true /*isAutoSave*/);

        setShouldUpdateContentOnDispose(viewState, false /*shouldUpdateContentOnDispose*/);
        switchBodyTypeAction(viewState, newContent, toText);
        if (viewState.bodyType == 'Text') {
            closeExpressionPane(viewState.expressionId, targetWindow);
        }
    }
}

async function canSwitch(
    viewState: ComposeViewState,
    operateContent: OperateContentType,
    targetWindow: Window
) {
    const isPlainText = viewState.bodyType == 'Text';

    if (!isPlainText && getCloudyAttachmentNames(viewState).length > 0) {
        confirm(
            null /*title*/,
            loc(switchToPlainTextCloudAttachmentWarning),
            false /*resolveImmediately*/,
            {
                targetWindow,
                hideCancelButton: true,
            }
        );
        return false;
    } else {
        const resolveImmediately = isPlainText || isEmptyHtml(viewState, operateContent);

        return (
            (await confirm(null, loc(switchToPlainTextWarning), resolveImmediately, {
                targetWindow,
            })) == DialogResponse.ok
        );
    }
}

function isEmptyHtml(viewState: ComposeViewState, operateContent: OperateContentType) {
    let isEmpty = false;
    operateContent(viewState, editor => {
        isEmpty = editor.isEmpty();
        return null;
    });
    return isEmpty;
}

const switchBodyTypeAction = mutatorAction(
    'switchBodyType',
    (viewState: ComposeViewState, newContent: string, toText: boolean) => {
        viewState.content = newContent;
        viewState.bodyType = toText ? 'Text' : 'HTML';
        viewState.isRibbonShown = !toText;
        viewState.docking.isBottomDocking = false;
        viewState.isDirty = true;
    }
);
