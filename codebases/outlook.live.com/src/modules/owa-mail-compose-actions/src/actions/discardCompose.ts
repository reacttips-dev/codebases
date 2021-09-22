import { DiscardDraftDocument } from '../graphql/__generated__/DiscardDraftMutation.interface';
import { getApolloClient } from 'owa-apollo';
import { confirmDiscardText, confirmDiscardSubText } from './discardCompose.locstring.json';
import loc from 'owa-localize';
import closeCompose from '../actions/closeCompose';
import datapoints from '../datapoints';
import { ComposeViewState, ComposeOperation, ComposeLifecycleEvent } from 'owa-mail-compose-store';
import onComposeLifecycleEvent from 'owa-mail-compose-store/lib/actions/onComposeLifecycleEvent';
import { uiLessAddinIsRunning } from '../utils/validateSave';
import { isViewStateDirty } from '../utils/viewStateUtils';
import { confirm, DialogResponse } from 'owa-confirm-dialog';
import endSession from 'owa-controls-findpeople-feedback-manager/lib/actions/endSession';
import deleteItemService from 'owa-mail-store/lib/services/deleteItemService';
import { wrapFunctionForDatapoint } from 'owa-analytics';
import { logDiscardActionMailTipsDatapoint } from 'owa-mail-tips/lib/datapoints';
import { getAllRecipients } from '../utils/getAllRecipientsAsEmailAddressStrings';
import getMailTipsViewStateMap from '../utils/getMailTipsViewStateMap';
import setIsDirty from './setIsDirty';
import { isFeatureEnabled } from 'owa-feature-flags';

function deleteDraft(viewState: ComposeViewState): Promise<void> {
    if (viewState?.itemId) {
        const deleteType =
            viewState.operation == ComposeOperation.EditDraft || viewState.isManuallySaved
                ? 'MoveToDeletedItems'
                : 'HardDelete';
        if (isFeatureEnabled('mon-cmp-experimentalGraphQLCompose')) {
            getApolloClient().mutate({
                variables: {
                    itemIds: [viewState.itemId],
                    disposalType: deleteType,
                },
                mutation: DiscardDraftDocument,
            });
        } else {
            deleteItemService([viewState.itemId], deleteType);
        }
    }

    endSession(viewState.toRecipientWell.findPeopleFeedbackManager, 'Discard');
    onComposeLifecycleEvent(viewState, ComposeLifecycleEvent.Discard);

    return closeCompose(viewState, 'Discard');
}

export const shouldShowDiscardConfirmDialog = (viewState: ComposeViewState) =>
    isViewStateDirty(viewState) ||
    uiLessAddinIsRunning(viewState) ||
    (viewState.itemId &&
        (viewState.operation == ComposeOperation.EditDraft || viewState.lastSaveTimeStamp != null));

export default wrapFunctionForDatapoint(
    datapoints.ComposeCommandDiscardCompose,
    function discardCompose(
        viewState: ComposeViewState,
        targetWindow?: Window,
        doNotConfirm?: boolean
    ): Promise<void> {
        // No need to show confirm dialog when the viewState is not dirty and
        // (No draft created for this viewState, or draft is never saved since created),
        // Or there is no running uiless add-in
        const resolveImmediately = doNotConfirm || !shouldShowDiscardConfirmDialog(viewState);

        return confirm(loc(confirmDiscardText), loc(confirmDiscardSubText), resolveImmediately, {
            targetWindow,
            // Wait until dialog is dismissed to avoid focus interruption
            delayCallbackAfterAnimation: true,
        }).then((response: DialogResponse) => {
            if (response === DialogResponse.ok) {
                logDiscardActionMailTipsDatapoint(
                    getMailTipsViewStateMap(viewState.ccRecipientWell, getAllRecipients(viewState))
                );

                // Set isDirty to false to avoid projection window show before unload warning
                setIsDirty(viewState, false /*isDirty*/);
                return deleteDraft(viewState);
            } else {
                return Promise.resolve();
            }
        });
    }
);
