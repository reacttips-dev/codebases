import { LazyAction, LazyImport, LazyModule, registerLazyOrchestrator } from 'owa-bundling';
import { orchestrator } from 'satcheljs';
import { saveReadingPanePositionOption } from 'owa-reading-pane-option';
import { onClientReadingPanePositionChange } from 'owa-mail-layout/lib/actions/onClientReadingPanePositionChange';
import closeImmersiveReadingPane from 'owa-mail-actions/lib/closeImmersiveReadingPane';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "MailModuleOrchestrator" */ './lazyIndex')
);

export let lazyOnReplyOrReplyAllOrForwardMessage = new LazyAction(
    lazyModule,
    m => m.onReplyOrReplyAllOrForwardMessage
);

export let lazyOnSxSPreviewPaneClose = new LazyImport(lazyModule, m => m.onSxSPreviewPaneClose);

export let lazyOnReadingPanePositionOptionSaved = new LazyAction(
    lazyModule,
    m => m.onReadingPanePositionOptionSaved
);

export let lazyOnSelectMessageAd = new LazyAction(lazyModule, m => m.onSelectMessageAd);

registerLazyOrchestrator(
    onClientReadingPanePositionChange,
    lazyModule,
    m => m.onClientReadingPanePositionChangeOrchestrator
);

registerLazyOrchestrator(
    closeImmersiveReadingPane,
    lazyModule,
    m => m.closeImmersiveReadingPaneOrchestrator
);

// Initialize stitch to listen to action in Options that toggles Focused Inbox
export function subscribeSaveReadingPanePositionOptionStitch() {
    orchestrator(saveReadingPanePositionOption, () => {
        lazyOnReadingPanePositionOptionSaved.importAndExecute();
    });
}
export { default as onPrintRow } from './actions/onPrintRow';
export { default as onNewMessage } from './actions/onNewMessage';
export { exitSearch } from './actions/exitSearch';
