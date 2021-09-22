import {
    ComposeViewState,
    ComposeTarget,
    getStore,
    ComposeLifecycleEvent,
    ComposeViewStateInitProps,
} from 'owa-mail-compose-store';
import moveComposeToTab from './moveComposeToTab';
import { openComposeActionName } from 'owa-mail-compose-action-names';
import popoutCompose from '../utils/popoutCompose';
import { lazyOpenComposeInSxS } from 'owa-sxs-store';
import { action } from 'satcheljs/lib/legacy';
import createComposeViewState from '../utils/createComposeViewState';
import onComposeLifecycleEvent from 'owa-mail-compose-store/lib/actions/onComposeLifecycleEvent';
import getTabIdFromProjection from 'owa-popout-v2/lib/utils/getTabIdFromProjection';
import getTabById from 'owa-tab-store/lib/utils/getTabById';
import type { MailComposeTabViewState } from 'owa-tab-store';
import { isFeatureEnabled } from 'owa-feature-flags';

/**
 * Open compose using ComposeViewState.
 * This is the most common case.
 * @param viewState ComposeViewState for this compose session
 * @param openTarget Target of compose
 * @param targetWindow The target window to popout to
 */
function openCompose(
    viewState: ComposeViewState,
    openTarget: ComposeTarget,
    targetWindow?: Window
): void;
/**
 * @param viewState ComposeViewState for this compose session
 * @param openTarget Target of compose
 * @param sxsId The sxsId to identify a SxS store
 */
function openCompose(
    viewState: ComposeViewState,
    openTarget: ComposeTarget.SxS,
    sxsId: string
): void;
/**
 * @param initProps Compose initial props used for creating ComposeViewState
 * @param openTarget Target of compose
 * @param sxsId The sxsId to identify a SxS store
 */
function openCompose(
    initProps: ComposeViewStateInitProps,
    openTarget: ComposeTarget.SxS,
    sxsId: string
): void;
/**
 * Open compose using ComposeViewStateInitProps, ComposeViewState will be created from this object.
 * This is a shortcut of createComposeViewState + openCompose using viewState.
 * @param initProps Compose initial props used for creating ComposeViewState
 * @param openTarget Target of compose
 * @param targetWindow The target window to popout to
 * @param targetId Optional target id for group or public folder
 */
function openCompose(
    initProps: ComposeViewStateInitProps,
    openTarget: ComposeTarget,
    targetWindow?: Window,
    targetId?: string
): void;
function openCompose(
    source: ComposeViewStateInitProps | ComposeViewState,
    openTarget?: ComposeTarget,
    targetWindowOrSxSId?: string | Window,
    targetId?: string
) {
    const viewState = !source
        ? null
        : isComposeViewState(source)
        ? source
        : createComposeViewState(source, targetId);

    if (viewState) {
        const store = getStore();
        store.viewStates.set(viewState.composeId, viewState);

        switch (openTarget) {
            case ComposeTarget.Popout:
                popoutCompose(viewState);
                break;

            case ComposeTarget.SecondaryTab:
                const composeTabId = moveComposeToTab(
                    viewState,
                    !viewState.isInlineCompose /*isShown*/,
                    !viewState.isInlineCompose /*makeActive*/
                );
                if (viewState.isInlineCompose && targetWindowOrSxSId) {
                    const composeTab = getTabById(composeTabId) as MailComposeTabViewState;
                    if (composeTab) {
                        composeTab.projectionRPTabId = getTabIdFromProjection(
                            <Window>targetWindowOrSxSId
                        );
                    }
                }
                break;

            case ComposeTarget.SxS:
                const sxsId = <string>targetWindowOrSxSId;
                lazyOpenComposeInSxS
                    .import()
                    .then(openComposeInSxS => openComposeInSxS(viewState.composeId, sxsId));
                break;

            case ComposeTarget.PrimaryReadingPane:
                store.primaryComposeId = viewState.composeId;
                break;
            case ComposeTarget.ExistingProjection:
                moveComposeToTab(viewState, false /*isShown*/, false /*makeActive*/);
                popoutCompose(viewState, <Window>targetWindowOrSxSId);
                break;
        }

        if (openTarget != ComposeTarget.Popout || isFeatureEnabled('mail-popout-projection')) {
            // Skip the lifecycle event for popout because when compose is opened directly in popout,
            // it is actually not opened in main window, so we should not trigger this event.
            // And popout window will call openCompose() again then the event will be triggered.
            onComposeLifecycleEvent(viewState, ComposeLifecycleEvent.Opened);
        }
    }
}

export default action(openComposeActionName)(openCompose);

function isComposeViewState(
    source: ComposeViewState | ComposeViewStateInitProps
): source is ComposeViewState {
    return !!(<ComposeViewState>source).composeId;
}
