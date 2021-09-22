import { LazyAction, LazyModule } from 'owa-bundling';
import { saveFocusInboxEnable } from 'owa-focused-option';
import { orchestrator } from 'satcheljs';

export { default as initializeFocusedInboxConfig } from './actions/initializeFocusedInboxConfig';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "FocusedInboxConfigActions"*/ './lazyIndex')
);

export let lazySetFocusedInboxOnOff = new LazyAction(lazyModule, m => m.setFocusedInboxOnOff);

// Initialize stitch to listen to action in Options that toggles Focused Inbox
export function subscribeSaveFocusInboxOptionStitch() {
    orchestrator(saveFocusInboxEnable, actionMessage => {
        lazySetFocusedInboxOnOff.importAndExecute(
            actionMessage.isFocusedInboxEnabled,
            true /* skipServiceRequest */
        );
    });
}
