import {
    lazyPreviewLinkInSxS,
    AttachmentSelectionSource,
    SxSReadingPaneInitializeMethod,
} from 'owa-attachment-preview-sxs-actions';
import { onLinkSelectionChange, previewSharePointDocumentLinkInSxS } from 'owa-compose-link';
import { onSxSChangeOrClose } from 'owa-sxs-store';
import { orchestrator } from 'satcheljs';

orchestrator(previewSharePointDocumentLinkInSxS, actionMessage => {
    const { wacUrlGetter, linkId, readOnly, targetWindow } = actionMessage;
    lazyPreviewLinkInSxS.importAndExecute(
        wacUrlGetter,
        null /* parentItemId - not needed for compose */,
        AttachmentSelectionSource.ComposeDocLink,
        {
            method: SxSReadingPaneInitializeMethod.CopyMailReadingPaneContainer,
        },
        null /* instrumentationContext */,
        linkId,
        readOnly,
        targetWindow
    );
});

orchestrator(onSxSChangeOrClose, actionMessage => {
    const { selectedLinkId, isSelectedLinkReadOnly } = actionMessage;
    onLinkSelectionChange(selectedLinkId, isSelectedLinkReadOnly);
});
