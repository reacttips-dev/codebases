import {
    lazyPreviewLinkInSxS,
    SxSReadingPaneInitializeMethod,
} from 'owa-attachment-preview-sxs-actions';
import { previewLinkInSxS } from 'owa-doc-link-click-handler';
import { orchestrator } from 'satcheljs';

orchestrator(previewLinkInSxS, actionMessage => {
    const { wacUrlGetter, itemId, targetWindow, selectionSource } = actionMessage;
    lazyPreviewLinkInSxS.importAndExecute(
        wacUrlGetter,
        itemId,
        selectionSource,
        {
            method: SxSReadingPaneInitializeMethod.CopyMailReadingPaneContainer,
        },
        null /* instrumentationContext */,
        null /* linkId */,
        null /* readOnly */,
        targetWindow
    );
});
